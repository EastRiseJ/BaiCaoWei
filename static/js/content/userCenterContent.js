$(function(){
	//显示右侧时间
	showThisTime();
	showTime();
	
	// 中间部分上面余额和豆子
	getYuEAndBeans();
	
	// 订单相关数据。
	getOrderMsg();
	
	// 点击显示相关数据 -- 未付款、已付款、全部订单
	btnClickToTable();
	
	
	
	// 加载页面时显示全部订单
	showTheOrders('all');
	
	// 页面跳转
	pageJump();
	
	// 显示用户名称
	showUserName()
})
// 点击去付款跳转到支付界面
function toPayPageToContinuePay(){
	$('#tab-orderMsg tbody .btn_continuePay').off('click');
	$('#tab-orderMsg tbody .btn_continuePay').click(function(){
		var orderId =parseInt($(this).parents('tr').find('.order-id').html());
		utility.Cookie.setCookie('orderId',orderId);
		window.location.href = 'userPayMethod.html';
	});
}

// 点击显示相关数据 -- 未付款、已付款、全部订单
function btnClickToTable(){
	$('.orderDetails a').each(function(i,el){
		$(el).click(function(){
			switch($(this).attr('class')){
				case 'orderNoPay':
					showTheOrders('noPay');
				break;
				case 'orderSended':
					showTheOrders('isPay');
				break;
				case 'orderComplete':
					showTheOrders('isPay');
				break;
				default:
				break;
			}
		});
	});
	$('.seeAllOrders').click(function(){
		showTheOrders('all');
	});
}
function showTheOrders(msg){
	var userName = utility.Cookie.getCookie('userName');
	var db_baicaowei = openDatabase('baiCaoWei', '1.0', 'BaiCaoWei DB', 2 * 1024 * 1024);
		db_baicaowei.transaction(function (tx) {
		   tx.executeSql('SELECT * FROM allOrders where phoneNum=?', [userName], function (tx, results) {
		       var len = results.rows.length, i;
		       var oTbody =$('#tab-orderMsg tbody');
				oTbody.empty();
				oTbody.append($('<tr></tr>'));
				debugger
		       for(var j=0;j<len;j++){
		       		// 计算未付款和已付款订单的数量
		       		var orderId = results.rows.item(j).orderId;
		       		var userName2 = results.rows.item(j).userName;
		       		var goodsNames = results.rows.item(j).goodsNames;
		       		var goodsWholePrice = results.rows.item(j).goodsWholePrice;
		       		var receiveAddress = results.rows.item(j).receiveAddress;
		       		var isPay = results.rows.item(j).isPay;
		       		
		       		// 判断表格中是否存在tr
//		       		 var oTbody =$('#tab-orderMsg tbody');
		       		var trFirst = $('#tab-orderMsg tbody tr:first');
		       		var oNewTr = $('<tr><td><span class="order-id">'+orderId+'</span></td><td><span class="order-goodsNames">'+goodsNames+'</span></td><td><span class="order-receiveAddress">'+goodsWholePrice+'</span></td><td><span class="order-price">'+receiveAddress+'</span></td><td><span class="order-receivePeople">'+userName2+'</span></td><td><span class="order-isPay">'+isPay+'</span></td></tr>');
					var oNewTrNoPay = $('<tr><td><span class="order-id">'+orderId+'</span></td><td><span class="order-goodsNames">'+goodsNames+'</span></td><td><span class="order-receiveAddress">'+goodsWholePrice+'</span></td><td><span class="order-price">'+receiveAddress+'</span></td><td><span class="order-receivePeople">'+userName2+'</span></td><td><span class="order-isPay">'+isPay+'</span><a href="javascript:;" class="btn_continuePay">(去付款)</a></td></tr>');
					
					
					switch(msg){
						case 'noPay' :
							if(isPay === 'false'){
		       					if(trFirst !=='' && trFirst !== null){
				       				oNewTrNoPay.insertBefore(trFirst);
				       			}else{
				       				oTbody.append(oNewTrNoPay);
				       			}
		       				}else{
		       					continue;
		       				}
		       			break;
		       			case 'isPay' :
							if(isPay === 'true'){
		       					if(trFirst !=='' && trFirst !== null){
				       				oNewTr.insertBefore(trFirst);
				       			}else{
				       				oTbody.append(oNewTr);
				       			}
		       				}else{
		       					continue;
		       				}
		       			break;
		       			case 'all' :
		       				if(isPay === 'true'){
		       					if(trFirst !=='' && trFirst !== null){
				       				oNewTr.insertBefore(trFirst);
				       			}else{
				       				oTbody.append(oNewTr);
				       			}
		       				}else{
		       					if(trFirst !=='' && trFirst !== null){
				       				oNewTrNoPay.insertBefore(trFirst);
				       			}else{
				       				oTbody.append(oNewTrNoPay);
				       			}
		       				}
//							if(trFirst.size()===0){
//			       				oNewTr.insertBefore(trFirst);
//			       			}else{
//			       				oTbody.append(oNewTr);
//			       			}
		       			break;
		       			default:
		       			break;
					}
		       		
		       }
		      // 点击去付款跳转到支付界面
				toPayPageToContinuePay();
		       
		   }, null);
	});
}


// 订单相关数据。
function getOrderMsg(){
	var userName = utility.Cookie.getCookie('userName');
	var db_baicaowei = openDatabase('baiCaoWei', '1.0', 'BaiCaoWei DB', 2 * 1024 * 1024);
		db_baicaowei.transaction(function (tx) {
		   tx.executeSql('SELECT * FROM allOrders where phoneNum=?', [userName], function (tx, results) {
		       var len = results.rows.length, i;
		       var noPayNums = 0;
		       var yesPayNums = 0;
		       for(var j=0;j<len;j++){
		       		// 计算未付款和已付款订单的数量
		       		if(results.rows.item(j).isPay === 'true'){
		       			yesPayNums++;
		       		}
		       		if(results.rows.item(j).isPay === 'false'){
		       			noPayNums++;
		       		}
		       }
		       $('.orderNoPay').html(noPayNums);
		       $('.orderSended').html(yesPayNums);
		       
		   }, null);
	});
}

// 中间部分上面余额和豆子
function getYuEAndBeans(){
	var userName = utility.Cookie.getCookie('userName');
	var db_baicaowei = openDatabase('baiCaoWei', '1.0', 'BaiCaoWei DB', 2 * 1024 * 1024);
		db_baicaowei.transaction(function (tx) {
		   tx.executeSql('SELECT * FROM UserInfor where name=?', [userName], function (tx, results) {
		       var len = results.rows.length, i;
		       var yuE = results.rows.item(0).yuE;
		       var beans = results.rows.item(0).beans;
		       $('.userCMidTopBot .userCBoxContent').eq(0).html('￥'+yuE);
		       $('.userCMidTopBot .userCBoxContent').eq(2).html(beans);
		   }, null);
	});
}

// 页面跳转
function  pageJump(){
	$('.userInfors').click(function(){
		window.location.href = 'userCenter.html';
	});
	$('.receiveAddrs').click(function(){
		window.location.href = 'receiveAddress.html';
	});
}
// 显示用户名称
function showUserName(){
	var userName = utility.Cookie.getCookie('userName');
	$('.userCRTRText .uCenterUserName').html(userName);
}

//显示右侧时间
function showTime(){
	var timer =null;
	timer = setInterval(showThisTime,1000);

}
function showThisTime(){
	var oDate = new Date();
	var oTime = oDate.toLocaleString();
	$('.nowTime').html(oTime);
}