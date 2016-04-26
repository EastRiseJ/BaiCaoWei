$(function(){
	// 页面跳转 -- 管理地址
	submitPageJump();
	
	// 获取cookie中产品的数据。
	getGoodsMsg();
	
	// 显示收货地址
	showRecriveAddress();
	
	// 地址选择部分
	addressChange();
	
	// 提交订单跳转到支付页面
	$('.btn_submitOrder').click(function(){
		submitOrderToPay();
		
	})
	
	
	
})
// 提交订单跳转到支付页面
function submitOrderToPay(){
	var orderId = 1;
	var phoneNum = utility.Cookie.getCookie('userName');
	var userName = $('.recivePeople').html();
	var goodsNames = $('#goodsDetail tbody tr .t1 .goodsName').html() + '等';
	var goodsImgSrc = $('#goodsDetail tbody tr .t1').find('img').attr('src');
	var goodsWholePrice =parseFloat($('.factPrice').text().split('￥')[1]);
	var receiveAddress = $('.sendFactAddr').html();
	var isPay = false;
	var db_baicaowei = openDatabase('baiCaoWei', '1.0', 'BaiCaoWei DB', 2 * 1024 * 1024);

		db_baicaowei.transaction(function (tx) {
			tx.executeSql('CREATE TABLE IF NOT EXISTS allOrders (orderId unique, phoneNum, userName, goodsNames, goodsImgSrc,goodsWholePrice, receiveAddress,isPay)');
		   tx.executeSql('SELECT * FROM allOrders', [], function (tx, results) {
		    var len = results.rows.length, i;
		    msg = "<p>查询记录条数: " + len + "</p>";
		      
			
		    console.log(msg);
		    if(!len){
		    	orderId = 1;
		    }else{
			  orderId = len+1;
		    }
		    for (i = 0; i < len; i++){
		    	console.log(results.rows.item(i).name );        
		    }
		    
			
		   }, null);
		  
		});
		db_baicaowei.transaction(function (tx) {	  
		tx.executeSql('CREATE TABLE IF NOT EXISTS allOrders (orderId unique, phoneNum, userName, goodsNames,goodsImgSrc, goodsWholePrice,receiveAddress,isPay)');
		tx.executeSql('INSERT INTO allOrders (orderId ,phoneNum, userName, goodsNames,goodsImgSrc, goodsWholePrice, receiveAddress,isPay) VALUES (?,?,?,?,?,?,?,?)',
		[orderId,phoneNum,userName, goodsNames,goodsImgSrc, goodsWholePrice,receiveAddress,isPay],function () { 
				utility.Cookie.setCookie('orderId',orderId);
				window.location.href = 'userPayMethod.html';
		},
			function (tx, error) { alert(error.message); 
			} );
		});
		
		
		// 删除购物车中相应的商品
		deletShopCarSubmitGoods();
}

// 删除购物车中相应的商品
function deletShopCarSubmitGoods(){
	var goodsSubmitNums = $('#goodsDetail tbody tr').size();
	var goodsSubmitTr = $('#goodsDetail tbody tr');
	for(var i=0;i<goodsSubmitNums;i++){
		var goodsId = goodsSubmitTr.eq(i).attr('goodsid');
		// 删除数据库中数据
		deleSqlGoodsData(goodsId);
	}
}
// 删除数据库中数据
function deleSqlGoodsData(goodsId){
	var phoneNum = utility.Cookie.getCookie('userName');
	var db_baicaowei = openDatabase('baiCaoWei', '1.0', 'BaiCaoWei DB', 2 * 1024 * 1024);
	db_baicaowei.transaction(function (tx) {
	 	tx.executeSql('DELETE FROM shopCar  WHERE userName=? and goodsId=? ',[phoneNum,goodsId]);	
	});
	
}
		
// 地址选择部分
function addressChange(){
	$('.addressItems .rad_Address').change(function(){
		// 被选择地址样式变化
		$(this).parents('.addressItems').addClass('active');
		$(this).parent().siblings('.selectItems').addClass('active');
		$(this).parents('.addressItems').siblings('.active').removeClass('active')
		.children('.active').removeClass('active');
		$(this).siblings('.placeDetail').children('a').addClass('isDefaultAdd');
		$(this).parents('.addressItems').siblings('.addressItems').children().children().children('.isDefaultAdd').removeClass('isDefaultAdd');
			
		// 右下角付款框内容修改
		var $sendAddress = $(this).siblings('.placeDetail').children('.subPlace').text() + $(this).siblings('.placeDetail').children('.subPlaceDetail').text()
		var $receivePeople =  $(this).siblings('.placeDetail').children('.subPeople').text();
		$('.sendFactAddr').text($sendAddress);
		$('.recivePeople').text($receivePeople);
	});
}


// 显示收货地址
function showRecriveAddress(){
	var $cookieGet = $.cookies.get;
	//  反编译cookie
	var goodsAfter = decodeURIComponent(document.cookie);
	var goodsArr = goodsAfter.split('; ');
	for(var i=0;i<goodsArr.length;i++){
		var checkThisCookieName = goodsArr[i].split('=');
		if(checkThisCookieName[0].search(/addressMsg-/)!==-1){
//			var $div_addressItemsBox = $('<div class="addressItems"></div>');
//			var $selectItems = $('<span class="selectItems">寄送到</span>');
//			var $radAddress = $('<input type="radio" name="address" class="rad_Address" />');
			if( $cookieGet(checkThisCookieName[0]).IsDefault){
				var $addressItems = $('<div class="addressItems active"><span class="selectItems active">寄送到</span><label><input type="radio" checked="checked" name="address" class="rad_Address" /><span class="placeDetail"><span class="subPlace">'+ $cookieGet(checkThisCookieName[0]).Place +'</span><span class="subPlaceDetail">'+ $cookieGet(checkThisCookieName[0]).AddressDetail +'</span>(<span class="subPeople">'+ $cookieGet(checkThisCookieName[0]).RecivePeople +'</span> 收)<span class="phoneNum">'+ $cookieGet(checkThisCookieName[0]).PhoneNum +'</span><a href="javascript:;" class="btn_optDefault isDefaultAdd" >默认地址</a><a href="javascript:;" class="btn_editAddress isDefaultAdd" >修改本地址</a></span></label></div>');
				$('.sendFactAddr').text($cookieGet(checkThisCookieName[0]).Place + $cookieGet(checkThisCookieName[0]).AddressDetail);
				$('.recivePeople').text($cookieGet(checkThisCookieName[0]).RecivePeople);
			}else{
				var $addressItems = $('<div class="addressItems"><span class="selectItems">寄送到</span><label><input type="radio" name="address" class="rad_Address" /><span class="placeDetail"><span class="subPlace">'+ $cookieGet(checkThisCookieName[0]).Place +'</span><span class="subPlaceDetail">'+ $cookieGet(checkThisCookieName[0]).AddressDetail +'</span>(<span class="subPeople">'+ $cookieGet(checkThisCookieName[0]).RecivePeople +'</span> 收)<span class="phoneNum">'+ $cookieGet(checkThisCookieName[0]).PhoneNum +'</span><a href="javascript:;" class="btn_optDefault" >默认地址</a><a href="javascript:;" class="btn_editAddress" >修改本地址</a></span></label></div>');
			}
			
			$('.userAddressBox .sendAddress').append($addressItems);
		}
		
	}
}

// 获取cookie中产品的数据。
function getGoodsMsg(){
	//  反编译cookie
	var goodsAfter = decodeURIComponent(document.cookie);
	var goodsArr = goodsAfter.split('; ');
	for(var i=0;i<goodsArr.length;i++){
		var checkThisCookieName = goodsArr[i].split('=');
		if(checkThisCookieName[0].search(/checkedGoods-/)!==-1){
			console.log('in');
			var $tr = $('<tr cookieName="'+checkThisCookieName[0]+'" goodsid="'+ $.cookies.get(checkThisCookieName[0]).goodsId +'"></tr>'),
				$td1 = $('<td class="t1"><div class="goodsImgBox"><img src="'+ $.cookies.get(checkThisCookieName[0]).imgSrc  +'" /></div><span class="goodsName">'+ $.cookies.get(checkThisCookieName[0]).goodsName+ '</span></td>'),
				$td2 = $('<td class="t2">'+ $.cookies.get(checkThisCookieName[0]).goodsSinglePrice  +'</td>'),
				$td3 = $('<td class="t3">'+ $.cookies.get(checkThisCookieName[0]).goodsNums  +'</td>'),
				$td4 = $('<td class="t4">'+ $.cookies.get(checkThisCookieName[0]).goodsWholePrice  +'</td>');
			$tr.append($td1);
			$tr.append($td2);
			$tr.append($td3);
			$tr.append($td4);
			var $tbody = $('#goodsDetail tbody');
			var $tr1 = $('#goodsDetail tbody tr:first');
			if($tbody.has('tr')===true){
				$tr.insertBefore($tr1);
			}else{
				$tbody.append($tr);
			}
		}
	}
	$('.factPrice').text($.cookies.get('checkedGoodsWholePrice'));
	$('.theWholePrice').text($.cookies.get('checkedGoodsWholePrice'));
	
}


// 页面跳转 -- 管理地址
function submitPageJump(){
	$('.btn_addrM').click(function(){
		window.location.href = 'receiveAddress.html';
	});
}
