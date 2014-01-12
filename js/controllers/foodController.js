/**
 * Created with IntelliJ IDEA.
 * User: Mateusz
 * Date: 15.11.12
 * Time: 22:38
 */

'use strict';

define(function (require, exports, module) {
	var app = require('js/modules/adminApp');
	
	app.register.controller('foodController', 
    ['$scope','$routeParams', '$location','$timeout' ,'$compile','FnUtil',
	    function($scope,$routeParams, $location,$timeout,$compile,FnUtil){
	         
          var QAQ = window['QAQ'];
          var Loading = QAQ['Loading'];
          var Message = QAQ['Message'];
          var MMDialog = QAQ['MMDialog'];
          var AADialog = QAQ['AADialog'];
          var Dao = window['Dao'];
          $scope.saveText = '保存';
        	$scope.pagination = {
              pagesize:20
          };
          $scope.searchData = {};
          $scope.pagination.click = _list;
          /*
          $scope.searchAll=function(){
              $scope.searchData = {};
              $scope.search();
          };
          $scope.toBulkDeleteView = function(){
              if( confirm('你确定不要我们了吗？') ){
                  $scope.bulkdelete();
                  
              }
          };*/
         
          $scope.toCreateView = function(data){
              initFormData(data);
              
              $('#myTab a:last').tab('show');
          };
          $scope.toRetrieveView = function(){
              $('#myTab a:first').tab('show');
              _list();
          };
          $scope.toUpdateView = function(data){
               var name = data.name;
               $scope.editData = angular.copy(data);
               var dialog = new AADialog({
                  scope:$scope,
                  compile:$compile,
                  title:'修改',
                  content:'<p style="padding:25px;"><input class="form-control" required ng-model="editData.name"></p>',
                  buttons:[
                      {
                        name:'确定',
                        cls:'.bt_tip_hit',
                        click:function(){
                            console.log($scope.editData)
                            var data = {
                                name:$scope.editData.name,
                                id:$scope.editData.id
                            }
                            if(!data.name){
                              Message('请填写完整','warning')
                              return;
                            }
                            this.close();
                            _update(data);
                           
                        }
                      },
                      {
                        name:'取消',
                        cls:'.bt_tip_normal',
                        click:function(){
                            
                            this.close();
                          
                           
                        }
                      }
                  ]

               });
              
              
          };
          $scope.toDeleteView = function(data){

              MMDialog.confirm('确认删除吗?'+data.name,function(){
                  _delete(data);
              });
          };
          $scope.save = function(){
              var formData = $scope.formData,foodTypeId = formData.foodTypeId;

              console.log(' save data ',formData);

              if(!formData.foodTypeId){
                  Message('类型不能为空！','warning');
                  return;
              }
              var item,ret=[];
              for (var i = formData.foodList.length - 1; i >= 0; i--) {
                 item = formData.foodList[i];
                 if(item.name && item.price && (false == isNaN(item.price))){
                    ret.push(item)
                 }
              };
              if(ret.length == 0){
                  Message('食物列表不能为空！','warning');
                  return;
              }
              
              var foods = JSON.stringify(ret);
              console.log(formData )
              _create({foodTypeId:foodTypeId,foods:foods});
          };
          $scope.addFood = function(){
              $scope.formData.foodList.push({name:'',price:''});
          };
          function initFormData(data){
            var foodTypeList = $scope.foodTypeList || [];

            if(data && data.foodTypeId){
               $scope.formData = {
                      foodTypeId:data.foodTypeId,
                      foodList:[{name:'',price:''}]
                  }
            }else{
               $scope.formData = {
                      foodTypeId:foodTypeList[0].id,
                      foodList:[{name:'',price:''}]
                  }
            }
           
                  
          }
          function _list(page){
              var pagination = $scope.pagination, 
                  page = page || pagination.page || 1,
                  pagesize = pagination.pagesize,
                  recordCount = pagination.recordCount || 0,
                  pages,data = {};

              pages = Math.ceil(recordCount/pagesize);
              if(page > pages){
                  page = pages;
              }

              data = {
                  _page       : page,
                  _pagesize   : pagination.pagesize
  
              };
              Loading.show('正在加载中...');
              Dao.getMenuList(data).then(function (result) {
                  var list = result.data || [],extra = result.extra || {total:0},item,children,ret=[],foodTypeList=[];
                  
                  //更新总记录
                  pagination.recordCount = extra.total;

                  for (var i = 0 ;i<list.length ;i++) {
                    item = list[i];
                    foodTypeList.push(item);
                    children = item.children || [];
                    if(children.length == 0){
                      children.push({name:'暂无数据',_action:false});
                      
                    }
                    for(var j=0; j<children.length;j++){
                        if(j==0){
                          children[j].isFirst = true;
                        }
                        children[j].foodTypeId = item.id;
                        children[j].foodTypeName = item.name;
                        children[j].total = children.length;
                        ret.push(children[j]);
                    }


                  };
                  $scope.foodTypeList = foodTypeList;
                  $scope.dataList = ret;
                  console.log('list',$scope.dataList,' extra.total ',extra.total);
                  $scope.$apply();
                  FnUtil.scrollTo();

              },function(result){
                  FnUtil.errorHandle(result);

              }).always(function () {
                  Loading.hide();
                  
              });
          }

          

          function _delete(data){
              var id = data.id;

              //$scope.$apply(function(){
                  Loading.show('正在处理...');


                  Dao.deleteFood({id:id}).then(function(result){
                      //更新总记录
                      $scope.pagination.recordCount--;
                      $scope.toRetrieveView();

                  }, function(result){
                      FnUtil.errorHandle(result);

                  }).always(function(){
                      Loading.hide();
                  });
              //});
                  

          }
          function _create(data){
              $scope.pending = true;

              Loading.show('正在处理...');
              //$scope.$apply(function(){
                  Dao.createFood(data).then(function(result){
                    console.log(2222222,result)
                    
                    $scope.toRetrieveView();

                  }, function(result){
                      FnUtil.errorHandle(result);

                  }).always(function(){
                      $scope.pending = false;
                      Loading.hide();
                  });
              //});
               
          }

          function _update(data){
              $scope.pending = true;

              Loading.show('正在处理...');
              Dao.updateFood(data).then(function(result){
                  console.log(result)
                 
                  $scope.toRetrieveView();

              }, function(result){
                  FnUtil.errorHandle(result);

              }).always(function(){
                  $scope.pending = false;
                  Loading.hide();
              });
          }

          init();
          bindUI();
          function bindUI(){
              //Util.bindCheckAll();
          }
          function init(){
              $scope.toRetrieveView();
          }
            
       		
	    }
    ]
	);

	
		
   
});

