(function(){
	var Util = window['Util'],
		Dao = window['Dao'],
		MLoading = window['MLoading'],
		MDialog = window['MDialog'],
		SDialog = window['SDialog'],
		iTemplate = window['iTemplate'];

	function MenuApp(){
			this.$orderListWrapper = $('#myorder-wrapper');//我的订单列表
			this.$infoWrapper = $('#info-wrapper');//个人信息页面
			this.$orderWrapper = $('#order-wrapper');//订单页面
			this.order = {};//订单数据
			this.totalAmount = 0;//订单中菜的总数
			this.totalPrice = 0;//订单中菜总价
			this.myorderItemTpl = $('#myorderItemTpl').html();
			this.orderItemTpl = $('#orderItemTpl').html();
			this.orderCountTpl = $('#orderCountTpl').html();
			this.dishTpl = $('#dishTpl').html();
			this.dishCategoryTpl = $('#dishCategoryTpl').html();

			this.data = {};
			this.init();
			//console.log(this);
		}

	MenuApp.prototype = {
		//获取数据
		requestData:function(){
			var self = this;
			var dfd = $.Deferred();

			
			var urlParams = Util.getUrlParams();
			console.log('url params ',urlParams)

			if(!urlParams.uid){
				urlParams.uid = 111;
				//SDialog.alert('用户id不存在');
				//return false;
			}
			
			MLoading.show('正在拼命加载...');
			$.when( Dao.getUser({id:urlParams.uid}),Dao.getMenuList() ).done(function(a,b){
				self.data.user = a.data;
				self.data.menuList = b.data;
				//console.log(11111,a,b);
				dfd.resolve();

			}).fail(function(result){
				dfd.reject(result);

			}).always(function(){
				MLoading.hide();
			});
			

			return dfd.promise(); 
		},
		init:function(){
			var self = this;

			self.requestData().done(function(){
				
				self.initData();
				self.renderUI();
				self.bindUI();
				self.syncUI();

			}).fail(function(result){
				SDialog.alert(result.msg);
			});
				
		},
		//
		initData:function(){
			var data = this.data,
				menuList = data.menuList,
				user = data.user;

			user.name = user.name || '';
			user.address = user.address || '';
			user.cellphone = user.cellphone || '';



		},
		renderUI:function(){
			this.syncOrderinfoUI();
			this.syncInfoUI();
			this.renderDishUI();
			this.selectCategory();
		},
		//更新订单里收货人的UI
		syncOrderinfoUI:function(){
			var user = this.data.user;

			$('.order-receiver').html(user.name);
			$('.order-cellphone').html(user.cellphone);
			$('.order-address').html(user.address);
		},
		//更新个人信息里收货人的UI
		syncInfoUI:function(){
			var user = this.data.user;

			$('.info-input-name').val(user.name);
			$('.info-input-cellphone').val(user.cellphone);
			$('.info-input-address').val(user.address);
		},
		//渲染菜单页面
		renderDishUI:function(){
			var dataList = this.data.menuList,
				dishTpl=this.dishTpl,
				dishCategoryTpl=this.dishCategoryTpl,
				categoryID,$menuList,
				category={},dish={},categoryFrag=[],dishFrag=[],categoryStr='',dishStr='';

			for(var i = 0; i <dataList.length; i++){
				category = dataList[i];
				children = category.children;
				categoryID = category.id;
				categoryStr = Util.substitute(dishCategoryTpl,category);
				categoryFrag.push(categoryStr);

				dishFrag.push('<div class="dish-list" data-categoryid="'+categoryID+'">');
				dishFrag.push('<div class="fixbox"></div>');
				for(var j=0; j<children.length;j++){
					dish = children[j];
					dish.index = j+1;
					dish.categoryid = categoryID;
					dishStr = Util.substitute(dishTpl,dish);
					dishFrag.push(dishStr);
				};
				dishFrag.push('<div class="fixbox"></div>');
				dishFrag.push('</div>');
			};

			$('#dish-category-box').html(categoryFrag.join(' '));
			$('#content').html(dishFrag.join(' '));
		},
		
		bindUI:function(){
			var self = this;
			this.setHeight();

			//点击logo
			$('.restaurant').bind('click',function(){
				location.href = location.href;
			});
			//点击我的订单
			$('.myorder').bind('click',function(){
				self.syncMyOrderList();
				//self.showMyOrderList();
				//location.href = location.href;
			});
			$('.myorder-back-btn').bind('click',function(){
				self.hideMyOrderList();
				//location.href = location.href;
			});
			//点击取消订单
			$('body').delegate('.myorder-cancel-btn', 'click', function(event) {
				var $this = $(this),uuid = $this.attr('data-uuid');

				self.cancelOrder(uuid);

			});

			


			//点击菜单大类
			$('body').delegate('.dish-category-list-link', 'click', function(event) {
				var $this = $(this),uuid = $this.attr('data-uuid');

				self.selectCategory(uuid);

			});

			//添加数量
			$('body').delegate('.amount-btn-plus', 'click', function(event) {
				var $this = $(this),
					$dish = $this.closest('.dish-item'),
					$amount = $dish.find('.amount-btn-number'),
					price = parseInt($dish.attr('data-price')),
					amount = parseInt($amount.text()),
					dishid = $dish.attr('data-uuid'),
					name = $dish.attr('data-name'),
					categoryid = $dish.attr('data-categoryid');
				
				self.syncDishAmount($amount,1);
				self.syncDishCount(1);
				self.syncTotalAmount(1);
				self.syncTotalPrice(price);
				self.syncOrder(dishid,price,categoryid,name,1);
			});

			
			//减少数量
			$('body').delegate('.amount-btn-minus', 'click', function(event) {
				var $this = $(this),
					$dish = $this.closest('.dish-item'),
					$amount = $dish.find('.amount-btn-number'),
					price = parseInt($dish.attr('data-price')),
					amount = parseInt($amount.text()),
					dishid = $dish.attr('data-uuid'),
					name = $dish.attr('data-name'),
					categoryid = $dish.attr('data-categoryid');

				if(amount>0){
					self.syncDishAmount($amount,-1);
					self.syncDishCount(-1);
					self.syncTotalPrice(-price);
					self.syncTotalAmount(-1);
					self.syncOrder(dishid,price,categoryid,name,-1);
				}
					

			});
			//显示个人信息
			$('body').delegate('.myinfo', 'click', function(event) {
				self.showInfo();
			});
			//点击个人信息中的返回
			$('.info-cancel-btn').bind('click',function(){
				self.hideInfo();
			});
			//点击个人信息中的保存
			$('.info-save-btn').bind('click',function(){
				self.saveInfo();
			});


			//准备下单
			$('body').delegate('.book-btn', 'click', function(event) {
				if(!self.data.user.name){
					self.showInfo();
				}else if(self.totalAmount > 0){
					self.renderOrderUI();
					self.showOrder();
				}else{
					SDialog.alert('请选择几个菜先')
				}
				
			});

			//点击订单中的返回
			$('.order-back').bind('click',function(){
				self.hideOrder();
			});
			//点击下单
			$('.order-sure-btn').bind('click',function(){
				self.saveOrder();
			});

			
		},
		cancelOrder:function(uuid){
			//设置订单状态
			var status = window['orderCancelStatus'];
			MLoading.show('正在取消订单...');
			Dao.updateOrder({id:uuid,status:status}).done(function(result){
				var $btn = $('.myorder-cancel-btn[data-uuid="'+uuid+'"]');

				$btn.closest('.myorder-item').remove();
				SDialog.alert('订单取消成功');

			}).fail(function(result){
				SDialog.alert(result.msg);
			}).always(function(){
				MLoading.hide();
			});
		},
		renderMyOrderListUI:function(){
			var myorderItemTpl = this.myorderItemTpl;
			var orderList = this.data.orderList;
			var frag = iTemplate.makeList(myorderItemTpl,orderList);

			$('.myorder-content').html(frag);
		},
		syncMyOrderList:function(){
			var self = this;
			var user = this.data.user;

			MLoading.show('正在获取订单...');
			Dao.getOrderList({uid:user.id}).done(function(result){
				self.data.orderList = result.data || [];
				self.renderMyOrderListUI();
				self.showMyOrderList();

			}).fail(function(result){
				SDialog.alert(result.msg);
			}).always(function(){
				MLoading.hide();
			});
		},
		//保存订单
		saveOrder:function(){
			var self=this;
			var order = this.order,user = this.data.user;
			
			var notes= $('.order-notes').val() || '';
			var hour = $('.order-time-hour').val() || '';
			var minute = $('.order-time-minute').val() || '';
			var time = '';
			if(hour!='' && minute!=''){
				time = hour+':'+minute;
			}
			var data = {
				uid:user.id,
				username:user.name,
				address:user.address,
				cellphone:user.cellphone,
				notes:notes,
				time:time
			};
			var orders = [];
			for(var dishid in order){
				orders.push( { id:dishid,amount:order[dishid]['amount'] } );
				
			}

			data.order = JSON.stringify(orders);
			
			
			MLoading.show('正在保存订单...');
			Dao.createOrder(data).done(function(){
				SDialog.alert('下单成功,我们会尽快为您送达!');
				//self.hideOrder();
			}).fail(function(result){
				SDialog.alert(result.msg);
			}).always(function(){
				MLoading.hide();
			});

		},
		//保存个人信息
		saveInfo:function(){
			var self = this;
			var user = this.data.user;
			var id = user.id;
			var name,cellphone,address;

			name = $('.info-input-name').val();
			cellphone = $('.info-input-cellphone').val();
			address = $('.info-input-address').val();
			if(!name || !cellphone || !address){
				SDialog.alert('请填写所有值');
				return;
			}
			//var re= /^(13[0-9]{9})| (18[0-9]{9}) |(15[0-9]{9})$/;
			var re = /^1[3|4|5|8][0-9]\d{4,8}$/;
			if( !re.test(cellphone) ){
				SDialog.alert('手机格式不对！');
				return false;
			}
			MLoading.show('正在保存信息...');
			var data = {
				id:id,
				name:name,
				address:address,
				cellphone:cellphone

			};
			Dao.updateUser(data).done(function(){
				self.data.user = data;
				self.hideInfo();

			}).fail(function(result){
				SDialog.alert(result.msg);
			}).always(function(){
				MLoading.hide();
			});
			
		},
		//渲染订单UI
		renderOrderUI:function(){
			var order = this.order,
				orderItemTpl = this.orderItemTpl,
				orderCountTpl = this.orderCountTpl,
				orderFrag=[],orderStr,countStr;

			//
			var total = 0,number = 0;
			for(var key in order){
				var dish = order[key];
				number++;
				total+=dish['amount']*dish['price'];
				orderStr = Util.substitute(orderItemTpl,dish);
				orderFrag.push(orderStr);
			}
			console.log('total price ',total)

			//统计
			var account = {
				number:this.totalAmount,//数目
				total:this.totalPrice//价格
			};
			countStr = Util.substitute(orderCountTpl,account);

			$('.order-list').html(orderFrag.join(' '));
			$('.order-count-box').html(countStr);

			this.syncOrderinfoUI();

		},
		syncUI:function(){
			this.syncTotalAmount(0);
			this.syncTotalPrice(0);
		},
		//更新订单数据
		syncOrder:function(dishid,price,categoryid,name,amount){
			var order = this.order,dish = {};

			if(order[dishid]){
				dish = order[dishid];
				dish.amount = dish.amount+amount;
				if(dish.amount == 0){
					delete order[dishid];
				}
			}else{
				order[dishid] = {
					dishid:dishid,
					price:price,
					categoryid:categoryid,
					name:name,
					amount:amount
				};
			}
			
			/*var count = 0;
			for(var key in order){
				count+=order[key]['amount']*order[key]['price'];
			}*/
			/*console.log('order ',this.order);
			console.log('total price ',count)*/
		},
		//更新总数
		syncTotalAmount:function(amount){
			var totalAmount = this.totalAmount;

			totalAmount = totalAmount+amount;

			this.totalAmount = totalAmount;

			$('#totalAmount').text(totalAmount);
		},
		//更新总价
		syncTotalPrice:function(price){
			var totalPrice = this.totalPrice;

			totalPrice = totalPrice+price;

			this.totalPrice = totalPrice;

			$('#totalPrice').text(totalPrice);
		},
		//更新右侧单个菜品的数量
		syncDishAmount:function($amount,number){
			var num = parseInt($amount.text()),
				$btnGroup = $amount.parent();

			if( (num + number)>0 ){
				num = num + number;
				$btnGroup.find('.amount-btn-minus,.amount-btn-number').show();
			}else{
				num = 0;
				$btnGroup.find('.amount-btn-minus,.amount-btn-number').hide();
			}

			$amount.text(num);

		},
		//更新左侧激活大类中所有菜品的数量总和
		syncDishCount:function(number){
			var $category = $('.dish-category-active'),
				$amount = $category.find('.amount'),
				count = parseInt( $amount.text() );

			
			count = count+number;
			count = count>0?count:0;
			$amount.text(count);
			if(count == 0){
				$amount.hide();
			}else{
				$amount.show();
			}
			
			
		},
		//选中大类
		selectCategory:function(id){
			var data = this.data,
				menuList = data.menuList;
			var category,list;


			if(id){
				category = this.getCategoryData(id);
				
			}else{
				category = menuList[0] || {};
				id = category.id;
			}
			if(!category){
				SDialog.alert('category is null');
				return;
			}
			$('.dish-category-list-link[data-uuid="'+id+'"]').addClass('dish-category-active').siblings().removeClass('dish-category-active');

			$('.dish-list[data-categoryid="'+id+'"]').addClass('show').siblings().removeClass('show');
			


		},
		getCategoryData:function(id){
			var data = this.data,
				menuList = data.menuList,
				ret = null;

			for (var i = menuList.length - 1; i >= 0; i--) {
				if(menuList[i].id == id ){
					ret = menuList[i];
					break;
				}
			};

			return ret;
		},
		setHeight:function(){
			var  cHeight,orderHeight;
            cHeight = document.documentElement.clientHeight;
            orderHeight = (cHeight-41)+'px';
            cHeight = cHeight +"px";
            document.getElementById("sidebar").style.height =  cHeight;
            document.getElementById("content").style.height =  cHeight;

            this.$infoWrapper.css({
            	height: cHeight,
            	top: cHeight
            });

            var  cWidth;
            cWidth = document.documentElement.clientWidth;
            this.$orderWrapper.css({
            	height: cHeight,
            	left: cWidth
            });

            this.$orderListWrapper.css({
            	height: cHeight,
            	left: cWidth
            });
		},

		showInfo:function(){
			this.$infoWrapper.show().animate({
				top: 0
				},
				300, function() {
				//SDialog.alert(1);
			});
		},
		hideInfo:function(){
			var  cHeight;
			var $infoWrapper = this.$infoWrapper;
            cHeight = document.documentElement.clientHeight;
			$infoWrapper.animate({
				top: cHeight
				},
				300, function() {
				$infoWrapper.hide();
			});
		},
		showOrder:function(){
			var self = this;
			this.$orderWrapper.show().animate({
				top: 0,
				left:0},
				300, function() {
					$('.order-footer').show();
				//SDialog.alert(1);
			});
		},
		hideOrder:function(){
			var  cWidth;
			var $orderWrapper = this.$orderWrapper;
            cWidth = document.documentElement.clientWidth;
            $('.order-footer').hide();
			$orderWrapper.animate({
				top: 0,
				left:cWidth},
				300, function() {
				$orderWrapper.hide();

			});
		},
		showMyOrderList:function(){
			this.$orderListWrapper.show().animate({
				top: 0,
				left:0},
				300, function() {
				//SDialog.alert(1);

			});
		},
		hideMyOrderList:function(){
			var  cWidth;
			var $orderListWrapper = this.$orderListWrapper;
            cWidth = document.documentElement.clientWidth;
			$orderListWrapper.animate({
				top: 0,
				left:cWidth},
				300, function() {
				$orderListWrapper.hide();
			});
		}
	};
	window.MenuApp = MenuApp;
}());