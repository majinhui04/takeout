/**
 * Created with IntelliJ IDEA.
 * User: Mateusz
 * Date: 15.11.12
 * Time: 22:38
 */

'use strict';

define(function (require, exports, module) {
	var app = require('js/modules/adminApp');
	
	app.register.controller('foodtypeController', 
    ['$scope','$routeParams', '$location','$timeout' ,'FnUtil',
	    function($scope,$routeParams, $location,$timeout,FnUtil){
	         
          var QAQ = window['QAQ'];
          var Loading = QAQ['Loading'];
          var Message = QAQ['Message'];
          var MMDialog = QAQ['MMDialog'];
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
         
          $scope.toCreateView = function(){
              initFormData();
              
              $('#myTab a:last').tab('show');
          };
          $scope.toRetrieveView = function(){
              $('#myTab a:first').tab('show');
              _list();
          };
          $scope.toUpdateView = function(data){
              initFormData(data);
              
              $('#myTab a:last').tab('show');
          };
          $scope.toDeleteView = function(data){

              MMDialog.confirm('确认删除吗?',function(){
                  _delete(data);
              });
          };
          $scope.save = function(){
              var formData = $scope.formData;

              console.log(' save data ',formData);

              if(!formData.name){
                  Message('名称不能为空！','warning');
                  return;
              }
              if(formData.id){
                  console.log('update')
                  _update(formData);
              }else{
                  console.log('create')
                  _create(formData);
              }
          };
          function initFormData(data){
              if(data){
                  $scope.formData = {
                      id          : data.id,
                      name        : data.name
                     
                  };
              }
              else{
                  $scope.formData = {
                      name        : ''
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
              Dao.getFoodtypeList(data).then(function (result) {
                  var list = result.data || [],extra = result.extra || {total:0},item;
                  
                  //更新总记录
                  pagination.recordCount = extra.total;

                  $scope.dataList = list;
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


                  Dao.deleteFoodtype({id:id}).then(function(result){
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
                  Dao.createFoodtype(data).then(function(result){
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
              Dao.updateFoodtype(data).then(function(result){
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

