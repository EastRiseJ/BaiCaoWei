$(function(){
	$('#form1').submit(function(){
		return false;
	});
	
	$('#loginMethod').html(utility.Cookie.getCookie('loginMethod'));
	$('#loginPhoneNum').html(utility.Cookie.getCookie('userName'));
	
	// 登录
	clickLoginBtn();
//	sqlCheckLogin();
//	checkJsonOrCookie();
	
	// 根据登录状态的不同 ，显示不同的div
	checkLoginState();
	
	// 点击注册按钮进入注册页面
	goToRegistPage();
	
	// 前往会员中心
	goToUserCenter();
	
	// 跳转到找回密码页面前保存当前网页路径
	savePresentHref();
})
// 前往会员中心
function goToUserCenter(){
	$('#btn_goMyCenter').click(function(){
		window.location.href = 'userCenter.html';
	});
}

// 验证数据库内数据登录
function clickLoginBtn(){
	$('#btn_login').click(function(){
		sqlCheckLogin();
	});
}
function sqlCheckLogin(){
	$('#form1 input[type!=checkbox]').focusout(function(){
		if($(this).val() === ''){
			$(this).addClass('error');
			$(this).next('.errorMsg').css({
								'visibility' : 'visible'
						});
		}else{
			$(this).removeClass('error');
			$(this).next('.errorMsg').css({
								'visibility' : 'hidden'
						});
		}
	});
	
	
	var $userName = $('#userName').val();
	var $userPwd = $('#userpwd').val();
	var db_baicaowei = openDatabase('baiCaoWei', '1.0', 'BaiCaoWei DB', 2 * 1024 * 1024);
	db_baicaowei.transaction(function (tx) {
	   tx.executeSql('SELECT * FROM UserInfor where name=?', [$userName], function (tx, results) {
	      var len = results.rows.length, i;
	      var sqlUserPwd = results.rows.item(0).password;
		  var sqlUserRMethod = results.rows.item(0).RMethod;
	      
	      console.log($userPwd +':'+ sqlUserPwd);
	      if($userPwd === sqlUserPwd.toString()){
	      	// 判断有没勾选checkbox 
			if($('#cb_remember').prop("checked")===true ){
				utility.Cookie.setCookie('userName',
				$userName,14);
				utility.Cookie.setCookie('userPwd',
				$userPwd,14);
				utility.Cookie.setCookie('loginMethod',
				sqlUserRMethod,14);
			}else{
				utility.Cookie.setCookie('userName',
				$userName);
				utility.Cookie.setCookie('userPwd',
				$userPwd);
				utility.Cookie.setCookie('loginMethod',
				sqlUserRMethod);
			}
			alert('登陆成功！');
			window.location.reload();
	      }else{
	      	alert('登录失败：帐号密码错误！');
	      }
	      
	   }, null);
	});
}

// 保存当前网页路径
function savePresentHref(){
	$('#rememberPwd').click(function(){
		var presentHref = window.location.href;
		utility.Cookie.setCookie('presentHref',presentHref);
		window.location.href = 'forgetPwd.html';
	});
}

// 点击注册按钮进入注册页面
function goToRegistPage(){
	$('#btn_regist').click(function(){
		window.location.href = 'userRegist.html';
	});
}


function checkLoginState(){
	if(utility.Cookie.getCookie('userName')){
		$('#loginContentC').css({
			'display' : 'none'
		});
		$('#loginContentCS').css({
			'display' : 'block'
		});
	}else{
		$('#loginContentC').css({
			'display' : 'block'
		});
		$('#loginContentCS').css({
			'display' : 'none'
		});
	}
	
}
function checkJsonOrCookie(){
	var registUserName = utility.Cookie.getCookie('userRName');
	var registUserPwd = utility.Cookie.getCookie('userRPwd');
	$('#form1 input[type!=checkbox]').focusout(function(){
		if($(this).val() === ''){
			$(this).addClass('error');
			$(this).next('.errorMsg').css({
								'visibility' : 'visible'
						});
		}else{
			$(this).removeClass('error');
			$(this).next('.errorMsg').css({
								'visibility' : 'hidden'
						});
		}
	});
		
	if(registUserName!=''){
		//// 判断Cookie中的帐号密码
		$('#btn_login').click(function(){
			var $userName = $('#userName').val();
			var $userPwd = $('#userpwd').val();
			var result = false;
			
			if($userName===registUserName && $userPwd===registUserPwd){
				result = true;
			}
			// 当帐号密码验证正确时，执行相应操作
			if(result===true){
				// 判断有没勾选checkbox 
				if($('#cb_remember').prop("checked")===true ){
					utility.Cookie.setCookie('userName',
					$userName,14);
					utility.Cookie.setCookie('userPwd',
					$userPwd,14);
					utility.Cookie.setCookie('loginMethod',
					'手机号码',14);
				}else{
					utility.Cookie.setCookie('userName',
					$userName);
					utility.Cookie.setCookie('userPwd',
					$userPwd);
					utility.Cookie.setCookie('loginMethod',
					'手机号码');
				}
				alert('登陆成功！');
				window.location.reload();
			}else{
				alert('帐号密码错误！');
			}
		});
	}else{
		// 判断Json文件内的帐号密码
//		alert('验证Json');
		checkUserNames();
	}
}
function checkUserNames(){
	//  获取json文件里的数据
	$.getJSON('../../static/userInfors/userInfor.txt',function(data){
		var users = data.users;
		var result;
//		console.log(users);
	//  点击登录按钮进行帐号密码验证
		$('#btn_login').click(function(){
			var $userName = $('#userName').val();
			var $userPwd = $('#userpwd').val();
			// 循环验证
			for(var keys in users){
				if($userName===users[keys].userName && $userPwd===users[keys].userPwd){
					result = true;
					break;
				}
				result = false;
			}
			// 当帐号密码验证正确时，执行相应操作
			if(result===true){
				// 判断有没勾选checkbox 
				if($('#cb_remember').prop("checked")===true ){
					utility.Cookie.setCookie('userName',
					users[keys].userName,20);
					utility.Cookie.setCookie('userPwd',
					users[keys].userPwd,20);
					utility.Cookie.setCookie('loginMethod',
					users[keys].method,20);
				}else{
					utility.Cookie.setCookie('userName',
					users[keys].userName);
					utility.Cookie.setCookie('userPwd',
					users[keys].userPwd);
					utility.Cookie.setCookie('loginMethod',
					users[keys].method);
				}
				alert('登陆成功！');
				window.location.reload();
			}else{
				alert('帐号密码错误！');
			}
		});
		
	});
}
