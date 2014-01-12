
define(function (require, exports, module) {
	
	var root = window['Root'];
	console.log('root ',root)

	require('js/modules/publicApp');
	var app = angular.module('indexApp', ['angular-lazyload','ngRoute','publicApp'], angular.noop);

	app.config(function ($routeProvider,$compileProvider, $controllerProvider) {
    	var html;
      	
      	console.log(1)
        $routeProvider.when('/test', {
        	controller: 'testController',
    		controllerUrl: root+'js/controllers/testController.js',
    		templateUrl: root+'views/test.html'
        });

    });
	app.controller('indexController', function($scope,$routeParams,$timeout,$route,$rootScope){
		console.log(2)
		//console.log('$route',ScreenMask)
    	//ScreenMask.show('body');
    	/*$routeProvider.when('/test2', {
        	controller: 'test2Controller',
    		controllerUrl: root+'js/controllers/test2Controller.js',
    		templateUrl: root+'views/test.html'
        });*/
		$scope.name='xxx344343';

    });

    app.run(['$lazyload','$rootScope','$routeParams', function ($lazyload,$rootScope,$routeParams) {  
    	console.log(3)
	    $lazyload.init(app);
		app.register = $lazyload.register;
		
	}]);  

	module.exports = app;

});