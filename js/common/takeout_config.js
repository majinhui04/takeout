(function(){
	var Api = {
		'menu.list':'data/menu_list.json',
		'user.get':'data/user_get.json',
		'user.update':'data/user_update.json',
		'order.list':'data/order_list.json',
		//'order.get':'data/order_get.json',
		'order.update':'data/order_update.json',
		'order.create':'data/order_create.json',

		'foodtype.list':'data/foodtype_list.json',
		'foodtype.update':'data/order_update.json',
		'foodtype.create':'data/order_create.json',
		'foodtype.delete':'data/order_create.json',

		'food.list':'data/food_list.json',
		'food.update':'data/order_update.json',
		'food.create':'data/order_create.json',
		'food.delete':'data/order_create.json',

		'order.switch.get':'data/order_switch.json',
		'order.switch.update':'data/order_update.json'


	};
	//订单取消的状态值 后台定义
	window['orderCancelStatus'] = '1';
	//订单下单后的值
	window['orderDefaultStatus'] = '0';
	//订单配送中的状态值
	window['orderSendingStatus'] = '2';

	window.Api = Api;

	/*var href = location.href;
	var index ;
	var root;
	if(location.hash){
		href = href.split('#')[0];
	}
	if(href.lastIndexOf('/admin')>-1){
		root = href.substring(0,href.lastIndexOf('admin/'));
	}else{
		root = href.substring(0,href.lastIndexOf('/'));
	}
*/
	var root = window['ROOT'] = 'http://localhost/xampp/majinhui/takeout/';
	console.log('root',root)

}());

/*
数据格式请参考对应的json

'menu.list':菜单列表获取,
'user.get':'获取用户数据',{id:''}(用户的id)
'user.update':'更新用户数据',{id:'',cellphone:'',address:'',name:''}
'order.list':'获取当天的订单列表', {uid:''}(用户的id)
'order.update':'更新订单状态 取消时用',{status:''}
'order.create':'订单创建'

{
	uid:'用户的id',
	username:'用户名',
	cellphone:'电话',
	address:'地址',
	notes:'备注',
	time:'预定时间 12:30',
	order:{
		'菜的id':'菜的数量',
		'菜的id':'菜的数量'
	}

}

*/