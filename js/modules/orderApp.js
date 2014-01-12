
/*
定时器
更新状态

*/
(function(){
	var Util = window['Util'],
		Dao = window['Dao'],
		MLoading = window['MLoading'],
		MDialog = window['MDialog'],
		SDialog = window['SDialog'],
		iTemplate = window['iTemplate'];

	function OrderApp(){
		this.ordersInfoTpl = $('#ordersInfoTpl').html();
		this.ordersItemTpl = $('#ordersItemTpl').html();
		this.ordersCountTpl = $('#ordersCountTpl').html();

		this.orderInfoList = [];
		this.orderSwitch = 'on';
		this.$orderSwitch = $('#orderSwitch');

		this.interval = 5*1000;
		this.init();
	}

	OrderApp.prototype =  {
		initData:function(list){
			var result = [],item,status = window['orderDefaultStatus'];

			/*for (var i = list.length - 1; i >= 0; i--) {
				item = list[i];
				if(status == item.status){
					result.unshift(item);
				}

			};*/

			this.orderInfoList = list;
		},
		init:function(){
			var self = this;
			var status = window['orderDefaultStatus'];
			MLoading.show('正在加载数据...');
			Dao.getOrderList({status:status}).done(function(result){
				var list = result.data || [];
				
				self.initData(list);
				self.renderUI(list);
				self.bindUI();

			}).fail(function(result){
				SDialog.alert(result.msg);

			}).always(function(){
				MLoading.hide();
			});

			Dao.getOrderSwitch().done(function(result){
				var data = result.data ;

				self.syncOrderSwitchUI(data);
			
			}).fail(function(result){
				SDialog.alert(result.msg);

			});
			
		},
		getLastedOrders:function(){
			var self = this;
			var orderSwitch = this.orderSwitch;
			var status = window['orderDefaultStatus'];
			var orderInfoList = this.orderInfoList;
			console.log(' orderSwitch ',orderSwitch);
			if(orderSwitch === 'off'){
				return;
			}
			//MLoading.show('正在加载数据...');
			Dao.getOrderList({status:status}).done(function(result){
				var list = result.data || [],lastedList = list.slice(0),len,addedList=[];
				
				self.orderInfoList = lastedList;
				len = list.length - orderInfoList.length;

				/*self.renderUI(list);
				return;*/
				if(len>0){
					addedList = list.splice(0,len);
					self.renderUI(addedList);
				}
				

			}).fail(function(result){
				SDialog.alert(result.msg);

			}).always(function(){
				//MLoading.hide();
			});
		},
		syncOrderSwitchUI:function(status){
			var self = this;
			if(status === 'on'){
				self.orderSwitch = 'on';
				self.$orderSwitch.attr('data-status','on').text('停止接收订单');

			}else{
				self.orderSwitch = 'off';
				self.$orderSwitch.attr('data-status','off').text('开启接收订单');
			}
		},
		changeOrderSwitch:function(){
			var self = this;
			var $orderSwitch = this.$orderSwitch,status = $orderSwitch.attr('data-status'),ret='';

			if('on' === status){
				ret = 'off';

			}else{
				ret = 'on';
			}
			Dao.updateOrderSwitch({status:ret}).done(function(result){
				self.syncOrderSwitchUI(ret);
				
			}).fail(function(result){
				SDialog.alert(result.msg);

			});

		},
		bindUI:function(){
			var self=this;
			console.log(22222,$('body'));
			this.setTimer();

			self.$orderSwitch.bind('click',function(){
				self.changeOrderSwitch();

			});
			//点击配送
			$('body').delegate('.orders-send-btn','click',function(event){
				var $this = $(this),$order = $this.closest('.orders-info'),id = $order.attr('data-uuid');
				var status = window['orderSendingStatus'];
			
				MLoading.show('正在处理...');
				Dao.updateOrder({id:id,status:status}).done(function(result){
					$order.remove();
				}).fail(function(result){
					SDialog.alert(result.msg);

				}).always(function(){
					MLoading.hide();
				});
			});

			//取消配送
			$('body').delegate('.orders-cancel-btn','click',function(event){
				var $this = $(this),$order = $this.closest('.orders-info'),id = $order.attr('data-uuid');
				var status = window['orderCancelStatus'];
				
				MLoading.show('正在处理...');
				Dao.updateOrder({id:id,status:status}).done(function(result){
					$order.remove();
				}).fail(function(result){
					SDialog.alert(result.msg);

				}).always(function(){
					MLoading.hide();
				});
			});
		},
		setTimer:function(){
			var self =this;
			//设置定时器 每隔一段时间获取新订单
			this.timer = setInterval(function(){
				self.getLastedOrders();
			},self.interval);
		},
		clearTimer:function(){
			clearInterval(this.timer);
			this.timer = null;
		},
		syncOrderStatus:function(id,status){
				
		},
		renderUI:function(list){
			var orderInfoList = list,
				ordersCountTpl = this.ordersCountTpl,
				ordersItemTpl = this.ordersItemTpl,
				ordersInfoTpl = this.ordersInfoTpl,
				orderInfo,orderInfoStr,orderItem,orderItemStr,orderCount,orderCountStr,
				$orderInfo,frag=[];

			for (var i = orderInfoList.length - 1; i >= 0; i--) {
				orderInfo = orderInfoList[i];
				console.log(' orderInfo ',orderInfo)
				orderList = orderInfo.order || [];
				
				orderItemStr = iTemplate.makeList(ordersItemTpl,orderList);

				
				//console.log(11,orderItemStr)
				var amount = 0,price = 0;
				for (var j = orderList.length - 1; j >= 0; j--) {
					amount+=parseInt(orderList[j]['amount']);
					price+=parseInt(orderList[j]['price'])*parseInt(orderList[j]['amount']);
				};
				orderCount = {
					amount:amount,
					price:price
				};
				//console.log(' orderCount ',orderCount)
				orderCountStr = Util.substitute(ordersCountTpl,orderCount);

				orderInfo.ordersList = orderItemStr;
				orderInfo.ordersCount = orderCountStr;
				orderInfoStr = Util.substitute(ordersInfoTpl,orderInfo);
				frag.unshift(orderInfoStr);
			};

			$('.orders-wrapper').prepend(frag.join(' '));
		}
	
		
	};

	window['OrderApp'] = OrderApp;
}());