
define(function (require, exports, module) {
	
	var app = angular.module('adminApp', ['angular-lazyload'], angular.noop);
	var root = window['ROOT'];

 	/*分页*/
    app.directive('qaqpagination', function () {
       
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, elm, attr, ngModelCtrl) {
                var modal = attr['qaqpagination'];
                var target =  modal+'.recordCount';
              
                //if (!ngModelCtrl) return;
                //if (!pageModel) return;

                scope.$watch(target, function (recordCount) {
                    
                    var pageModel = scope[modal];
                    //console.log('value',value)
                    //console.log(111111,scope, elm, attr,scope.pagination)
                    //console.log(pageModel,attr,attr.ngModel)
                    if(!pageModel){
                        return;
                    }
                    
                    //scope.pagination.click(3);
                    //console.log('watch pagination recordCount ',value,ul.attr('data-pagination'));
                    if(recordCount == undefined){
                    	return;
                    }
                    
                    if(recordCount == 0 ){
                        elm.html('<div class="no-records">暂无记录</div>')
                    }else{
                        var pagesize = pageModel.pagesize || 10;
                        var page = pageModel.page || 1;
                        var pages = Math.ceil(recordCount/pagesize);
                        elm.find('.no-records').remove();
                        if(page>pages){
                       
                            page = pages;
                        }
                        if(page<1){
                            page = 1;
                        }
                        pageModel.page = page;
                        //console.log(page)
                        elm.pagination(recordCount,{
                            current_page:page - 1,
                            items_per_page:pagesize,
                            $scope:scope,
                            callback:function(index){
                                //console.log('page index ',index)
                                pageModel.page = index+1;
                                pageModel.click(index+1);
                                return false;
                            }
                        }); 
                    }
                        
                        
                    
                        

                });
               
            }
        }
    });
/* 公共方法 */
    app.factory('FnUtil', function () {
        
        return {
            staticData:{
               
            },
            errorHandle:function(error){
                console.warn(error);
            },
            
            isInArray:function(value,arr){
                var arr=arr || [],value = value+'';

                if(angular.isString(arr)){
                    arr = arr.split(',');
                }
                for (var i = arr.length - 1; i >= 0; i--) {
                    if(arr[i] == value){
                        return true;
                    }
                };
                return false;
            },
            //设置数组里的对象 _check:boolean
            checkList:function(list,str){
                var list = list || [],item,str = str || '',arr = str.split(',');
                
                for (var i = list.length - 1; i >= 0; i--) {
                    item = list[i];
                    if(this.isInArray(item.id,arr)){
                        item._checked = true;
                    }else{
                        item._checked = false;
                    }
                    
                };
            },
            getSelectedCheckbox:function(cls){
                var ids='',frag = [];

                jQuery(cls+'[type="checkbox"]').each(function(i,item){
                    var uuid = item.value;
                    if(item.checked && uuid){
                        frag.push(uuid);
                    }
                    
                });
                
                return frag;
            },
            
            scrollTo:function(){
                var target = arguments[0];

                if(typeof target === 'undefined'){
                    //window.scrollTo(0,0);
                    $('html').animate({scrollTop:0}, 500); 
                }
                else if(typeof target === 'number'){
                    window.scrollTo(0,target);
                }
                else{
                    target.ScrollTo && target.ScrollTo();
                }
                
                

            },
            test:function(){
                console.log(this);
            }
        };
            
    });
	
	app.config(function ($routeProvider,$compileProvider, $controllerProvider) {
    	var html;
      	
        $routeProvider.when('/foodtype', {
        	controller: 'foodtypeController',
    		controllerUrl: 'js/controllers/foodtypeController.js',
    		templateUrl: root+'views/foodtype.html'
        });
        $routeProvider.when('/food', {
        	controller: 'foodController',
    		controllerUrl: 'js/controllers/foodController.js',
    		templateUrl: root+'views/food.html'
        });
		$routeProvider.when('/admin', {
	        controller: function($scope, $routeParams, $location){
	          $scope.str = new Date()
	          
	        },
	        template: '<div>{{str}}</div>'
	      });
  
    	$routeProvider.otherwise({redirectTo:'/admin'});
    	

    	
	});

	app.controller('adminCtrl', function($scope, $routeParams,$timeout,$route,$rootScope){
		
    	console.log(22222222)

    });
	app.run(['$lazyload','$rootScope','$routeParams', function ($lazyload,$rootScope,$routeParams) {  
	    $lazyload.init(app);
		app.register = $lazyload.register;
		$rootScope.$on('$routeChangeStart', routeChangeStart);
		$rootScope.$on('$routeChangeSuccess', routeChangeSuccess);
		var ScreenMask = window['QAQ']['ScreenMask'];
		function routeChangeStart(event,route) { 
			
	        ScreenMask.show('#module-content');
	        var hash = location.hash,$link ;
	        console.log('hash ',hash,$('#admin-navbar').find('a[href="'+hash+'"]'))
	      	if(hash && $('#admin-navbar').find('a[href="'+hash+'"]').length>0 ){
	      		$link = $('#admin-navbar').find('a[href="'+hash+'"]');
	      		$link.addClass('active').siblings('a').removeClass('active');
	      		$('#current-place').html($link.text());
	      	}else{
	      		$('#admin-navbar').find('a').removeClass('active');
	      		$('#current-place').html('');
	      	}
	    }
	    function routeChangeSuccess(event,route) {  
	    	ScreenMask.hide('#module-content');
	    }  
	}]);  

	module.exports = app;

});