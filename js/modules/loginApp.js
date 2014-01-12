(function(){
	var Dao=window['Dao'],
		MLoading = window['MLoading'],
        SDialog = window['SDialog'];

	function LoginApp(){
		this.$loginForm = $('#loginForm');
		this.$username = $('#username');
		this.$password = $('#password');
		console.log(this.$loginForm)
		this.init();
	}

	LoginApp.prototype =  {
		init:function(){
			this.bindUI();
		},
		bindUI:function(){
			var self=this;
			
			this.$loginForm.bind('submit',function(event){
				
        		event.preventDefault();
        		
		        self.validate();
		      });
		},
		validate:function(){
			var username = this.$username.val() || '',
				password = this.$password.val() || '';

			console.log(username,password)
			if(username=='' || password==''){
				SDialog.alert('请填写完整');
				return false;
			}
			MLoading.show('正在验证...');
			Dao.getUser({name:username,password:password}).done(function(result){
				var user = result.data,uid=user.id;
				location.href= 'index.html';
            	
          	}).fail(function(result){
            	SDialog.alert('账号或者密码出错');
          	}).always(function(){
          		MLoading.hide();
          	});

		}
		
	};

	window['LoginApp'] = LoginApp;
}());