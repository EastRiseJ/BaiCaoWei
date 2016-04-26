$(function(){
	// 表单验证
	checkedForm();
	
	// 动态生成随机验证码
	randomYZM();
	
	// 点击按钮换一个验证码;
	changeYZM();
	
	// 获取手机动态验证码
	getPhoneMsgYZM();
	
	// 注册成功 保存数据
	registSucceed();
	
})
// 获取手机动态验证码
function getPhoneMsgYZM(){
	$('.btn_getMsg').click(function(){
		var random = Math.floor(Math.random()*1000000);
//		alert('短信验证码为： ' + random);
		$('.tb_Msg').attr('placeholder', random);
	});
}

// 点击按钮换一个验证码;
function changeYZM(){
	$('.btn_changeYZM').click(function(){
		randomYZM();
	});
}
	
// 动态生成随机验证码
function randomYZM(){
	var random = Math.floor(Math.random()*10000);
	$('.randomNums').text(random);
}

// 注册成功 保存数据
function registSucceed(){
	
	var isSucceed = true;
	$('.registSubmit').off('click').click(function(){
		$('.registC input[type!=submit]').each(function(i,el){
			if($(this).val() === '' ){
				isSucceed = false;
			}
		});
		$('.registC .regist_error').each(function(i,el){
			console.log($(this).css('visibility'));
			if($(this).css('visibility') !== 'hidden' ){
				isSucceed = false;
			}
			// else{
			// 	isSucceed = true;
			// }
		});
		// 判断表单内的状态
		if(isSucceed){
			// To ： 验证成功后执行
			var phoneNum = $('.tb_phoneNum').val();
			var isPwd = $('.tb_isPwd').val();
			var userId = 1 ;
			
			// 验证成功后把相关数据保存到数据库
			var db_baicaowei = openDatabase('baiCaoWei', '1.0', 'BaiCaoWei DB', 2 * 1024 * 1024);
				db_baicaowei.transaction(function (tx) {
				   tx.executeSql('SELECT * FROM UserInfor', [], function (tx, results) {
				    var len = results.rows.length, i;
				    msg = "<p>查询记录条数: " + len + "</p>";
				      
					
				    console.log(msg);
				    if(!len){
				    	userId = 1;
				    }else{
					  userId = len+1;
				    }
				    for (i = 0; i < len; i++){
				    	console.log(results.rows.item(i).name );
//				    	if(phoneNum === results.rows.item(i).name){
//				      		return;
//				      	}
				         
				    }
				    
					
				   }, null);
				});
				
		    	utility.Cookie.setCookie('userName',$('.tb_phoneNum').val());
				utility.Cookie.setCookie('userPwd',$('.tb_isPwd').val());
		   		utility.Cookie.setCookie('userRName',$('.tb_phoneNum').val());
				utility.Cookie.setCookie('userRPwd',$('.tb_isPwd').val());
				utility.Cookie.setCookie('userRMethod','手机号码');
				db_baicaowei.transaction(function (tx) {  
				   tx.executeSql('CREATE TABLE IF NOT EXISTS UserInfor (id unique, name unique, password, RMethod,yuE,beans)');
				   tx.executeSql('INSERT INTO UserInfor (id, name, password, RMethod,yuE,beans) VALUES (?,?,?,"手机号码","10000","0")',
				   [userId,phoneNum,isPwd],function () { 
				   		window.location.href = 'registSuccessContent.html';
				   },
									function (tx, error) { alert('注册失败：此手机号码已被注册！'); 
									} );
				});
			    
				
					
//			alert('注册成功！快去登录吧');
		}else{
			// To ： 验证失败后执行
			alert('注册失败，请核对以上信息！');
		}
	});
	
}

// 表单验证
function checkedForm(){
	$('.registC input[type!=submit]').each(function(i,el){
		$(el).focusout(function(){
			var regExp ;
			var isInput = true;
			switch($(this).attr('class')){
				case 'tb_phoneNum' :
							regExp = new RegExp('^[1][3578][0-9]{9}$');
				break;
				case 'tb_YZM' :
							($(this).val()===$('.randomNums').text())?
							$(this).next().next().next('.regist_error').css({
								'visibility' : 'hidden'
							}): 
							$(this).next().next().next('.regist_error').css({
								'visibility' : 'visible'
							});
							isInput = false;
				break;
				case 'tb_Msg' :
							// To: 验证手机性息
							($(this).val()===$(this).attr('placeholder'))?
							$(this).next().next('.regist_error').css({
								'visibility' : 'hidden'
							}): 
							$(this).next().next('.regist_error').css({
								'visibility' : 'visible'
							});
							isInput = false;
				break;
				case 'tb_pwd' :
							regExp = new RegExp('^\\w{8,16}$');
				break;
				case 'tb_isPwd' :
							($(this).val()===$('.tb_pwd').val())?
							$(this).next('.regist_error').css({
								'visibility' : 'hidden'
							}): 
							$(this).next('.regist_error').css({
								'visibility' : 'visible'
							});
							isInput = false;
				break;
				default:
					alert($(this).val());
					isInput = false;
				break;
			}
			
			(isInput===true)&&regCheckedForm(regExp,$(this));
		});
	});
}



// 正则判断正确否
function regCheckedForm(regExp,obj){
	regExp.test(obj.val())? obj.next('.regist_error').css({
								'visibility' : 'hidden'
							}):
							obj.next('.regist_error').css({
								'visibility' : 'visible'
							});
							
}
