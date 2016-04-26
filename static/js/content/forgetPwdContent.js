$(function(){
	// 点击“获取新密码”按钮 获取新密码
	getNewPwd();
	
	// 点击“返回”按钮 ， 返回前一个操作页面
	backToBeforePage();
	
	// 文本框只能输入数字
	onlyNumbers();
})
// 点击“返回”按钮 ， 返回前一个操作页面
function backToBeforePage(){
	$('#btn_back').click(function(){
		var beforePageHrf = utility.Cookie.getCookie('presentHref');
			window.location.href = beforePageHrf;
	});
}


// 文本框只能输入数字
function onlyNumbers(){
	$('.fP_phoneNum').keydown(function(ev){
		if((ev.keyCode >= 48 && ev.keyCode <= 57 ) || 
			(ev.keyCode >= 96 && ev.keyCode <= 105 || ev.keyCode === 8)){
			
		}else{
			console.log(ev.keyCode);
			return false;
		}
		
	});
}
	
// 点击“获取新密码”按钮 获取新密码
function getNewPwd(){
	$('#btn_getNewPwd').click(function(){
		var random = Math.floor(Math.random()*100000000);
		var $phoneNum = $('.fP_phoneNum').val();
//		var userRName = utility.Cookie.getCookie('userRName');
//		var isExistuserRName = false;
		var db_baicaowei = openDatabase('baiCaoWei', '1.0', 'BaiCaoWei DB', 2 * 1024 * 1024);
		
		
		if($phoneNum===''){
			alert('手机号码不能为空，请输入手机号码！');
		}else if(/^[1][3578][0-9]{9}$/.test($phoneNum)=== false){
			alert('请输入正确的手机号码！');
		}
		else{
			db_baicaowei.transaction(function (tx) {
			   tx.executeSql('SELECT * FROM UserInfor where name=?', [$phoneNum], function (tx, results) {
			    var len = results.rows.length, i;
			    msg = "<p>查询记录条数: " + len + "</p>";
			     if(len>0){
			     	db_baicaowei.transaction(function (tx) {
					    tx.executeSql('UPDATE UserInfor SET password=? WHERE name=?',[random,$phoneNum]);
					});
					utility.Cookie.setCookie('userRPwd',random);
					alert('您的新密码是： ' + random);
			     }else{
					alert('该手机号码未注册！');
			     }
				
			    console.log(msg);

			   }, function(tx,errorMsg){
			   		alert(errorMsg);
			   });
			});
		}
	});
}








