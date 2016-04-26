$(function(){
	// 从cookie获取相关信息
	getCookieMsg();
	
	// 保存当前网页路径
	savePresentHref();
	
	// 付款
	payTheseGoods();
	
})
// 保存当前网页路径
function savePresentHref(){
	$('.btn_forgetPwd').click(function(){
		var presentHref = window.location.href;
		utility.Cookie.setCookie('presentHref',presentHref);
		window.location.href = 'forgetPwd.html';
	});
}

// 付款
function payTheseGoods(){
	$('.btn_pay').click(function(){
		var userPwd = utility.Cookie.getCookie('userPwd');
		var $userPwd = $('.payPwd').val();
		if(userPwd === $userPwd ){
			var phoneNum = utility.Cookie.getCookie('userName');
			var orderId = parseInt($('.orderId').html());
			var yuE =parseFloat($('.payYuR').html());
			var patMoney = parseFloat($('.payMonet').html());
			var addBeans = parseInt(patMoney);
			var surplusMoney = yuE - patMoney;
			
			if(surplusMoney>0){
				var isPay = true;
				var oldBeans =0 ;
				var nowBeans = 0;
				var db_baicaowei = openDatabase('baiCaoWei', '1.0', 'BaiCaoWei DB', 2 * 1024 * 1024);
				
		         db_baicaowei.transaction(function (tx) {
//		             tx.executeSql('UPDATE UserInfor SET yuE=? WHERE name=?',[surplusMoney,phoneNum]);
//		             tx.executeSql('UPDATE UserInfor SET beans=? WHERE name=?',[addBeans,phoneNum]);
					 tx.executeSql('SELECT * FROM UserInfor where name=?',[phoneNum],function(tx,results){
						var len = results.rows.length, i;
		   				 msg = "<p>查询记录条数: " + len + "</p>";
		   				 console.log(msg);
		   				 console.log(results.rows.item(0).yuE);
		   				 console.log(results.rows.item(0).beans);
		   				 oldBeans = results.rows.item(0).beans;
		   				 nowBeans =parseInt(oldBeans) + addBeans;
//						alert(nowBeans);
						tx.executeSql('UPDATE UserInfor SET yuE=? where name=?',[surplusMoney,phoneNum]);
						tx.executeSql('UPDATE UserInfor SET beans=? where name=?',[nowBeans,phoneNum]);
			            tx.executeSql('UPDATE allOrders SET isPay=? where orderId=?',[isPay,orderId]);
						
					});
					
		         });
		         alert('支付成功！');
				window.location.href = 'userCenter.html';
			}else{
				alert('余额不足');
			}
		}else{
			alert('密码错误！');
		}
		
			
		
	});
}

// 从cookie获取相关信息
function getCookieMsg(){
	var phoneNum = utility.Cookie.getCookie('userName');
	var orderId = parseInt(utility.Cookie.getCookie('orderId'));
	var db_baicaowei = openDatabase('baiCaoWei', '1.0', 'BaiCaoWei DB', 2 * 1024 * 1024);
	$('.orderId').html(orderId);
	db_baicaowei.transaction(function (tx) {
		tx.executeSql('CREATE TABLE IF NOT EXISTS allOrders (orderId unique, userName, goodsNames, goodsWholePrice, receiveAddress,isPay)');
	   tx.executeSql('SELECT * FROM allOrders where orderId=? ', [orderId], function (tx, results) {
	    var len = results.rows.length, i;
	    msg = "<p>查询记录条数: " + len + "</p>";
	    console.log(results.rows.item(0));
	    var goodsNames = results.rows.item(0).goodsNames;
	    var goodsReceiveAddress = results.rows.item(0).receiveAddress;
	    var goodsReceivePeople = results.rows.item(0).userName;
	    var goodsImgSrc = results.rows.item(0).goodsImgSrc;
	    var payMoney = results.rows.item(0).goodsWholePrice;
	    $('.goodsNames').html(goodsNames+'等');
	    $('.goodsReceiveAddress').html(goodsReceiveAddress);
	    $('.goodsReceivePeople').html(goodsReceivePeople);
	    $('.goodsImg').find('img').attr('src',goodsImgSrc);
	    $('.payMonet').html(payMoney);
	    
	   }, null);
	});
	db_baicaowei.transaction(function (tx) {
		tx.executeSql('CREATE TABLE IF NOT EXISTS allOrders (orderId unique, userName, goodsNames, goodsWholePrice, receiveAddress,isPay)');
	   tx.executeSql('SELECT * FROM UserInfor where name=? ', [phoneNum], function (tx, results) {
	    var len = results.rows.length, i;
	    msg = "<p>查询记录条数: " + len + "</p>";
	    console.log(results.rows.item(0));
	    $('.payYuR').html(results.rows.item(0).yuE);
	   }, null);
	});
}
