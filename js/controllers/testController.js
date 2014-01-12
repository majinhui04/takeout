/**
 * Created with IntelliJ IDEA.
 * User: Mateusz
 * Date: 15.11.12
 * Time: 22:38
 */

'use strict';

define(function (require, exports, module) {
	var app = require('js/modules/indexApp');
	
	app.register.controller('testController', 
		
	    function($scope,Message){
	        
          	$scope.name="ttttt";
          	Message.show('ssssssssssss')
          
       		
	    }
    );

	
		
   
});

