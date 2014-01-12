
define(function (require, exports, module) {
	
	var root = window['Root'];
	
	var app = angular.module('publicApp', [], angular.noop);


	/* 消息提示 */
    app.service('Message', MessageTip);
    window['Message'] = new MessageTip;
    function MessageTip() {
        var self = this;
        
        self.msgHash = {
            'create'                                    :'数据创建',
            'add'                                       :'数据添加',
            'update'                                    :'数据更新',
            'delete'                                    :'数据删除'
        };
        self.show = function (msg,type) {
            var type = type || 'error',msg = msg || '',interval = 3000,ret;
            
            self.hide();
          
            ret = (type=='error') ? '失败':'成功';
            msg = self.msgHash[msg]?(self.msgHash[msg]+ret):msg;
            self.render();
            self.$container.find('.toast').addClass('toast-'+type);
            self.$container.find('.toast-message').html(msg);
            self.$container.fadeIn();
        
            if(type != 'error'){
                self.timer = setTimeout(function(){
                    self.hide();
                }, interval);
            }else{
                self.timer = setTimeout(function(){
                    self.hide();
                }, 8*1000);
            }
                
        };
        self.hide = function () {
            clearTimeout(self.timer);
            self.$container && self.$container.fadeOut().find('.toast').attr('class','toast');
        };
        self.render = function(){
        	
            if($('#toast-container').length == 0){
                self.$container = $('<div id="toast-container"><div class="toast"><span class="toast-message"></span><span class="toast-close">close</span></div></div>').appendTo('body');
                self.$container.find('.toast-close').bind('click',function(){
                    self.hide();
                })
            }else{
                self.$container = $('#toast-container');
            }   
        } 
            
    };
    /* 公共方法 */
    app.factory('Util', function () {
        
        return {
            delObjInArray : function(list,target,param){
                var item;

                for (var i = list.length - 1; i >= 0; i--) {
                    item = list[i];
                    if(target[param] == item[param]){
                        list.splice(i,1);
                        break;
                    };
                };
            },
            updateObjInArray : function(list,target,param){
                var item,ret=false;

                for (var i = list.length - 1; i >= 0; i--) {
                    item = list[i];
                    if(target[param] == item[param]){
                        list[i] = target;
                        ret = true;
                        break;
                    };
                };
                if(!ret){
                    console.warn('target:',target,' not find');
                }
            },
            validateData:function(obj){
                
                if(this.isEmptyObj(obj)){
                    return false;
                }
                for( var param in obj){
                    if(!obj[param]){
                        console.warn('数据不完整！')
                        return false;
                    }
                }

                return true;
            },
            isEmptyObj:function(obj){
                
                for( var param in obj){
                    return false;
                }
                return true;
            },
            cloneArray:function(arr){
                var arr = arr || [];
                return arr.slice(0);
            },
            getObjInArray:function(list,param,value){
                var result=null,item,list = list || [];

                for (var i = list.length - 1; i >= 0; i--) {
                    item = list[i];
                    if( item[param] == value ){
                        result = item;
                        break;
                    }
                };
               
                return result;
            },
     		
            arrayToMap:function(arr,prop){
                var arr = arr || [],ret={},item,key;

                for (var i = arr.length - 1; i >= 0; i--) {
                    item = arr[i];
                    key = item[prop];
                    ret[key] = item;
                };

                return ret;
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
            bindCheckAll:function(){
            	$('#checkAll').bind('click',function(){
            		var $this = $(this),checked = $this.prop('checked');

            		$('.chk').prop('checked',checked);
            	});
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
            showModal:function(id){
                $(id).modal({
                    show:true,
                    backdrop:'static'
                });
            },
            hideModal:function(id){
                $(id).modal('hide');
            },
            getDeletedArray:function(oldArr,newArr){
                var oldArr = oldArr || [],newArr = newArr || [],ret = [],obj={};

                for (var i = newArr.length - 1; i >= 0; i--) {
                    obj[newArr[i]] = true;
                };

                for (var i = oldArr.length - 1; i >= 0; i--) {
                    if(!obj[oldArr[i]]){
                        ret.push(oldArr[i]);
                    }
                };

                return ret;
            },
            getAddedArray:function(oldArr,newArr){
                var oldArr = oldArr || [],newArr = newArr || [],ret = [],obj={};

                for (var i = oldArr.length - 1; i >= 0; i--) {
                    obj[oldArr[i]] = true;
                };

                for (var i = newArr.length - 1; i >= 0; i--) {
                    if(!obj[newArr[i]]){
                        ret.push(newArr[i]);
                    }
                };

                return ret;
            },
            getPropArray:function(list,prop){
                var list = list || [],ret=[];

                for(var i=0;i<list.length;i++){
                    ret.push(list[i][prop]);
                };

                return ret;
            },
            scrollTop:function(){
                var target = arguments[0],len=arguments.length,value = 0;

                if(len == 1){
                    value = arguments[0];
                    target = jQuery('.section-content');
                }
                if(len == 2){
                    value = arguments[1];
                }
                
                target.scrollTop(value);

            },
            test:function(){
                console.log(this);
            }
        };
            
    });
	/* 全屏遮罩
    * 
    * show：打开遮罩
    * hide：关闭遮罩
    * 
    * Example：fullScreenMask.show();
    *          fullScreenMask.hide();
    */
    app.service('ScreenMask', function () {
        var tpl = '<div class="screen-mask" ><span></span></div>';
        this.show = function (id) {
            this.hide();
            if(jQuery(id).hasClass('modal')){
                jQuery(id).find('.modal-body').append($(tpl));
            }else{
                jQuery(id).append($(tpl));
            }
            
        };
        this.hide = function (id) {
            jQuery(id).find('.screen-mask').remove();
        };
    });
	/*分页*/
    app.directive('pagination', function () {
       
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, elm, attr, ngModelCtrl) {
                var pageModel = scope[attr.ngModel];
               
                if (!ngModelCtrl) return;

                scope.$watch('pagination.recordCount', function (value) {
                    var panel = elm;
                    var page = pageModel.page || 1;
                    //scope.pagination.click(3);
                    //console.log('watch pagination recordCount ',value,ul.attr('data-pagination'));
                    value = value ? value : 0;
                    console.log('record ',value,pageModel.page);
                    panel.pagination(value,{
                        current_page:page - 1,
                        items_per_page:pageModel.pagesize,
                        $scope:scope,
                        callback:function(page){
                            pageModel.page = page+1;
                            pageModel.click(page+1);
                            return false;
                        }
                    });  
                });
               
            }
        }
    });
	/* 公共ajax */
    app.factory('http', ['$http','$q','Message', function ($http,$q,Message) {
        var urlHash = {
        	/*'text.create':'dao.php',
        	'text.update':'dao.php',
        	'text.delete':'dao.php',
        	'text.list':'dao.php',
        	'text.bulkdelete':'dao.php',

        	'image.create':'dao.php',
        	'image.update':'dao.php',
        	'image.delete':'dao.php',
        	'image.list':'dao.php',
        	'image.bulkdelete':'dao.php'*/
        };
        var root = window['Root'];
        var http = {
            ajax: function (key, data , opts,successCallback,failCallback) {
                    var self = this,
                        opts = opts || {},
                        data = data || {},
                        prefix = root,
                        url = urlHash[key],
                        deferred = $q.defer() ,
                        method = opts.method || 'GET';
                        _error = (data._error === false)? false : true,//true 则错误时提示错误信息 默认提示错误
                        _action = data._action,//true 则成功时提示成功信息
                        config = {};
 					console.log('promise ',deferred.promise)

                    if(url){
                        url = prefix + url;
                    }else{
                    	url = prefix+'dao.php';
                    }
                    
                    //url = key;
                    delete data._error;
                    delete data._action;

                    if(method === 'POST'){
                        data = self.filter(data);
                        config = {
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            transformRequest: function (obj) { 
                             
                                return jQuery.param(obj);
                            },
                            method: method,
                            url: url,
                            type:'POST',
                            dataType:'json',
                            data: data
                            
                        };
                    }else{
                        config = {
                            method: method,
                            url: url,
                            type:'GET',
                            dataType:'json',
                            params : data
                        };
                    }
                    
                    console.log('send data ',data,' action:',_action,url);
                    
                  
                    $http(config).success(function (data, status, headers, config) {
                        var message,data,str='<!-- 请勿屏蔽广告',index,json_text;
                        
                        if(angular.isObject(data)){
                        	if(data.code == 0 || data.code == 200){
                				_action && Message.show(_action,'success');
                        		deferred.resolve(data);

                			}else{
                				deferred.reject( data );
                			}
                        	
                        }else{
                        	index = data.indexOf(str);
                        	console.log('请勿屏蔽广告');
                        	if(index>-1){
                        		json_text = data.substring(0,index);
                        		//console.log('json_text ',json_text);
                        		try{
                        			data = JSON.parse(json_text);
                        			console.log('parse data ',data);
                        			if(data.code == 0){
                        				_action && Message.show(_action,'success');
	                            		deferred.resolve(data);

                        			}else{
                        				deferred.reject( { message:data.msg } );
                        			}
	                        			

                        		}catch(err){
                        			_error && Message.show(message,'error');
                        			deferred.reject({message:'json parse error'});
                        		}
                        	}else{

                        	}
                        }
                       
                           
                        
                    }).error(function (data, status, headers, config) { 

                    	
                        var message = '服务器出错';
                        _error && Message.show(message,'error');
                        deferred.reject({message:message});
                        

                    });
                   	

                    return deferred.promise;
                },
            get: function (url, data,successCallback,failCallback) {
                    var self = this;

                    return self.ajax(url, data , { method:'GET' } ,successCallback , failCallback);
                    
                },
            post: function (url, data,successCallback,failCallback) {
                    var self = this,data = data || {};

                    
                    return self.ajax(url, data , { method:'POST' } ,successCallback , failCallback);
               
            },
            filter:function(data){
                var ret = {},data = data || {};

                for(var key in data){
                    if(key.indexOf('_') == -1){
                        ret[key] = data[key];
                    }
                };

                return ret;
            },
            formatterError:function(data, status, headers, config){
                var message,result,url = config&&config.url,error;
                
                message = data.message + ' 出错的url: '+url;
                error = data.error || {};
                //console.warn(error.message,error.type,error.file,error.line);
                console.warn(message);

                return message;
               
            }
        };

        return http;


    }]);
	/*服务工厂*/
    app.factory('GeneralFactory', ['http',function (http) {
        
        var factory = function(factoryName){
            var self = this;

            this.name = factoryName;
           
            this.list = function(data){
                var name = this.name,url = name+'.list',data = data || {};

                data.action = url;
                data._page = data._page ? data._page:1;
                data._pagesize = data._pagesize ? data._pagesize:10;
                
                return http.get(url,data);
            };
            this.get = function(data){
                var name = this.name,url = name+'.get',data = data || {};
                
                data.action = url;
                return http.get(url,data);
            };
            this.update = function(data){
                var name = this.name,url = name+'.update',data = data || {};
                data.action = url;
                return http.post(url,data);
            };
            this.create = function(data){
                var name = this.name,url = name+'.create',data = data || {};

         		data.action = url;
                return http.post(url,data);
            };
            this.bulkdelete = function(data){
                var name = this.name,url = name+'.bulkdelete',data = data || {};
         		data.action = url;
                return http.get(url,data);
            };
            this['delete'] = function(data){
                var name = this.name,url = name+'.delete',data = data || {};
                
                data.action = url;
                return http.get(url,data);
            };
        }

        return factory;  

    }]);

	/*文本*/
    app.factory('textService', ['http','GeneralFactory',function (http,GeneralFactory) {
        var factory = new GeneralFactory('text');

        return factory;

    }]);
   
	



	module.exports = app;

});