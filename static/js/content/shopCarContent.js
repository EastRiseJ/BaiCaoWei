$(function(){
	// 把cookie中的数据保存到表格中
//	showAllOfGoods();

	// 把sql中的数据导入到表格中
	getSqlAllGoodsForUser();
	

})
// 把sql中的数据导入到表格中
function getSqlAllGoodsForUser(){
	var userName = utility.Cookie.getCookie('userName');
	var db_baicaowei = openDatabase('baiCaoWei', '1.0', 'BaiCaoWei DB', 2 * 1024 * 1024);
	db_baicaowei.transaction(function (tx) {
	   tx.executeSql('SELECT * FROM shopCar where userName=? ', [userName], function (tx, results) {
	      var len = results.rows.length, i;
	      var shopCarId;
	      var goodsNums;
	      var goodsWholePrice;
	      
	      var goodsId;
	      var goodsImgSrc;
	      var goodsName;
	      var goodsPrice;
	      console.log(len);
		  for(var j=0;j<len;j++){
		  		//shopCarId = results.rows.item(j).shioCarId;
		  		goodsId = results.rows.item(j).goodsId;
		  		goodsName = results.rows.item(j).itemsName;
		  		goodsImgSrc = results.rows.item(j).itemsImgSrc;
		  		goodsPrice = results.rows.item(j).itemsPrice;
		  		goodsNums = results.rows.item(j).itemsNums;
		  		goodsWholePrice = results.rows.item(j).itemsWholePrice;
		  		
	     		
	     		var $tbody = $('#tab_shopCar tbody');
				var $tr1 = $('#tab_shopCar tbody tr:first');
				console.log($tbody.has('tr')===false);
				var $tr = $('<tr goodsid="'+goodsId+'"></tr>');	
				var $td1 = $('<td class="t1"><input type="checkbox" class="checkThis" /><div class="goodsPic"><img src="'+goodsImgSrc+'" /></div></td>');
				var $td2 = $('<td class="t2">'+ goodsName +'</td>');
				var $td3 = $('<td class="t3">'+ goodsPrice +'</td>');
				var $td4 = $('<td class="t4"><button class="numSub" disabled="disabled">-</button><input type="text" value="'+ goodsNums +'" class="goodsNum" /><button class="numAdd">+</button><p class="numError"></p></td>');
				var $td5 = $('<td class="t5">￥<span class="sumPrice">'+ goodsWholePrice +'</span>元</td>');
				var $td6 = $('<td class="t6"><a href="javascript:;" class="deleteThis">删除</a></td>');
				$tr.append($td1);
				$tr.append($td2);
				$tr.append($td3);
				$tr.append($td4);
				$tr.append($td5);
				$tr.append($td6);
				if($tr1 !== '' && $tr1 !==null){
					$tr.insertBefore($tr1);
				}else{
					$tbody.append($tr);
				}
		  }
			// 数量加减
			goodsNumAddOrSub();
			
			// 数量文本框只能输入数字,当数量为1时，不能点击-；
			numbersInputControl();
			
			// 点击删除 删除该产品
			deleteThisGoods();
			
			// 左边复选框操作checkbox
			checkeboxOpt();
			
			// 清空按钮
			clearShopCar();
			
			
			//跳转到提交订单界面
			goToSubmitOrder();
			
			// 继续购物
			continueShopping();
			
			// 判断购物车里是否有商品 无则禁止使用结算按钮
			isPayBtnDisabled();
	   }, null);
	  });
}
	
	
// 判断购物车里是否有商品 无则禁止使用结算按钮
function isPayBtnDisabled(){
	var $trNums = $('#tab_shopCar tbody tr td input:checked').size();
	console.log($trNums);
	if($trNums <= 0){
		$('#tab_shopCar .goToPay').addClass('goToPayUnUser');
		$('#tab_shopCar .goToPay').prop('disabled',true);
	}else{
		$('#tab_shopCar .goToPay').removeClass('goToPayUnUser');
		$('#tab_shopCar .goToPay').prop('disabled',false);
	}
}


// 继续购物
function continueShopping(){
	$('tfoot .continueShopping').off('click');
	$('tfoot .continueShopping').click(function(){
		window.location.href = '../../views/MainHtml/index.html';
	});
}

function goToSubmitOrder(){
	$('.goToPay').off('click');
	$('.goToPay').click(function(){
		// 把之前保存的提交订单时保存的产品信息cookie清除掉
		clearBeforeGoodsCookies();
		var $checkedInp = $('#tab_shopCar tbody tr td input:checked');
		var $checkedSize = $checkedInp.size();
		alert('你选择了'+$checkedSize+'件商品！');
		for(var i=0;i<$checkedSize;i++){
			var goodsId = $checkedInp.eq(i).parents('tr').attr('goodsid');
			var imgSrc = $checkedInp.eq(i).next('.goodsPic').children().attr('src');
			var goodsName = $checkedInp.eq(i).parents('.t1').siblings('.t2').text();
			var goodsSinglePrice = $checkedInp.eq(i).parents('.t1').siblings('.t3').text();
			var goodsNums = $checkedInp.eq(i).parents('.t1').siblings('.t4').children('.goodsNum').val();
			var goodsWholePrice = $checkedInp.eq(i).parents('.t1').siblings('.t5').text();
			var checkedGoodsWholePrice = $('.wholePrice').text();
			$.cookies.set('checkedGoods-'+i,{
				'goodsId' : goodsId,
				'imgSrc' : imgSrc,
				'goodsName' : goodsName,
				'goodsSinglePrice' : goodsSinglePrice,
				'goodsNums' : goodsNums,
				'goodsWholePrice' : goodsWholePrice
			});
			$.cookies.set('checkedGoodsWholePrice',checkedGoodsWholePrice);
		}
		
		
		window.location.href='../../views/MainHtml/submitOrder.html'
	});
}

// 把之前保存的提交订单时保存的产品信息cookie清除掉
function clearBeforeGoodsCookies(){
	//  反编译cookie
	var goodsAfter = decodeURIComponent(document.cookie);
	var goodsArr = goodsAfter.split('; ');
	for(var i=0;i<goodsArr.length;i++){
		var goodsNameArr = goodsArr[i].split('=');
		if( goodsNameArr[0].search(/checkedGoodsWholePrice/)!==-1 || goodsNameArr[0].search(/checkedGoods-/)!==-1){
			$.cookies.del(goodsNameArr[0]);
		}
	}
}
// 清空购物车
function clearShopCar(){
	var userName = utility.Cookie.getCookie('userName');
	$('#tab_shopCar .clearShopCar').off('click');
	$('#tab_shopCar .clearShopCar').click(function(){
		var isClearBoth = confirm('确定要清空购物车吗？');
		if(isClearBoth){
			$('#tab_shopCar tbody').html('');
			window.location.reload();
			clearGoodsCookie();
			// 清楚数据库数据
			clearSqlGoodsList(userName);
		}
//		document.cookie = '';
		clearGoodsCookie();
		isPayBtnDisabled();
		calTheSumPrice();
	});
	
}
// 清楚数据库数据
function clearSqlGoodsList(userName,goodsId){
	var db_baicaowei = openDatabase('baiCaoWei', '1.0', 'BaiCaoWei DB', 2 * 1024 * 1024);
	db_baicaowei.transaction(function (tx) {
		if(goodsId){
			 tx.executeSql('DELETE FROM shopCar  WHERE userName=? and goodsId=? ',[userName,goodsId]);	
		}else{
			tx.executeSql('DELETE FROM shopCar  WHERE userName=? ',[userName]);	
		}
	});
}

function clearShopCar1(){
	$('#tab_shopCar .clearShopCar').off('click');
	$('#tab_shopCar .clearShopCar').click(function(){
		var isClearBoth = confirm('确定要清空购物车吗？');
		isClearBoth&&$('#tab_shopCar tbody').html('')
		&&window.location.reload();
//		document.cookie = '';
		clearGoodsCookie();
		isPayBtnDisabled();
		calTheSumPrice();
	});
	
}
// 清楚商品相关Cookie。
function clearGoodsCookie(){
	//  反编译cookie
	var goodsAfter = decodeURIComponent(document.cookie);
	var goodsArr = goodsAfter.split('; ');
	for(var i=0;i<goodsArr.length;i++){
		var checkThisCookieName = goodsArr[i].split('=')[0];
		if(checkThisCookieName.search(/goodsName/)!==-1){
			// 获取到商品名字
			var goodsTime = checkThisCookieName.split('e')[1];
			utility.Cookie.removeCookie('imgSrcs'+goodsTime);
			utility.Cookie.removeCookie('goodsName'+goodsTime);
			utility.Cookie.removeCookie('goodsPrice'+goodsTime);
			utility.Cookie.removeCookie('goodsNums'+goodsTime);
		}
			
	}
}

function checkeboxOpt(){
	$('#tab_shopCar .checkAll').off('click');
	$('#tab_shopCar .checkAll').click(function(){
		var isCheckAll = $(this).prop('checked');
		$('#tab_shopCar .checkThis').prop('checked',isCheckAll);
		$('#tab_shopCar .checkAll').prop('checked',isCheckAll);
		calTheSumPrice();
		
		// 判断购物车里是否有商品 无则禁止使用结算按钮
		isPayBtnDisabled();
	});
	$('#tab_shopCar .checkThis').off('click');
	$('#tab_shopCar .checkThis').click(function(){
		var isAllOfCBChecked = true;
		$('#tab_shopCar .checkThis').each(function(i,el){
			if($(el).prop('checked') === false){
				isAllOfCBChecked=false;
			}
		});
		if(isAllOfCBChecked){
			$('#tab_shopCar .checkAll').prop('checked',true);
		}else{
			$('#tab_shopCar .checkAll').prop('checked',false);
		}
		calTheSumPrice();
		// 判断购物车里是否有商品 无则禁止使用结算按钮
		isPayBtnDisabled();
	});
	
}
// 计算总价格
function calTheSumPrice(){
	var sumPrice = 0;
	var goodsNumsChecked = $('#tab_shopCar .checkThis:checked').size();
	$('#tab_shopCar .checkThis:checked').each(function(i,el){
		var thisSumPrice = $(el).parent('td').siblings('.t5').children('.sumPrice').text();
		sumPrice += parseFloat(thisSumPrice);
	});
	$('.goodsNumsForPay').html(goodsNumsChecked);
	$('.wholePrice').html('￥'+sumPrice + '元');
	
}

function deleteThisGoods(){
	$('.deleteThis').off('click');
	$('.deleteThis').click(function(){
		var isDelete = confirm('确认要删除这件商品吗？');
		if(isDelete){
			// 删除数据库中数据
			var userName = utility.Cookie.getCookie('userName');
			var goodsId = $(this).parents('tr').attr('goodsid');
			clearSqlGoodsList(userName,goodsId);
			//  删除当前列
			$(this).parents('tr').remove();
			
			
			
		}
		// 判断购物车里是否有商品 无则禁止使用结算按钮
		isPayBtnDisabled();
	});
}

function showAllOfGoods(){
	//  反编译cookie
	var goodsAfter = decodeURIComponent(document.cookie);
	var goodsArr = goodsAfter.split('; ');
	for(var i=0;i<goodsArr.length;i++){
		var goodsNameArr = goodsArr[i].split('=');
		if( goodsNameArr[0].search(/goodsName/)!==-1){
			var goodsNameTime = goodsNameArr[0].split('e');
//			console.log(goodsNameTime);
			var utilityGetCookie = utility.Cookie.getCookie;
			var $tbody = $('#tab_shopCar tbody');
			var $tr1 = $('#tab_shopCar tbody tr:first');
			console.log($tbody.has('tr')===false);
			var $tr = $('<tr></tr>');	
			var $td1 = $('<td class="t1"><input type="checkbox" class="checkThis" /><div class="goodsPic"><img src="'+utilityGetCookie('imgSrcs'+goodsNameTime[1])+'" /></div></td>');
			var $td2 = $('<td class="t2">'+ utilityGetCookie('goodsName'+goodsNameTime[1]) +'</td>');
			var $td3 = $('<td class="t3">'+ utilityGetCookie('goodsPrice'+goodsNameTime[1]) +'</td>');
			var $td4 = $('<td class="t4"><button class="numSub" disabled="disabled">-</button><input type="text" value="'+ utilityGetCookie('goodsNums'+goodsNameTime[1]) +'" class="goodsNum" /><button class="numAdd">+</button><p class="numError"></p></td>');
			var sumPrice = parseFloat(utilityGetCookie('goodsPrice'+goodsNameTime[1]).split('￥')[1]) * utilityGetCookie('goodsNums'+goodsNameTime[1]);
			var $td5 = $('<td class="t5">￥<span class="sumPrice">'+ sumPrice +'</span>元</td>');
			var $td6 = $('<td class="t6"><a href="javascript:;" class="deleteThis">删除</a></td>');
			$tr.append($td1);
			$tr.append($td2);
			$tr.append($td3);
			$tr.append($td4);
			$tr.append($td5);
			$tr.append($td6);
			if($tbody.has('tr')===true){
				$tr.insertBefore($tr1);
			}else{
				$tbody.append($tr);
			}
//			$tr.insertBefore($tr1);
		}
	}
}

function numbersInputControl(){
	$('.goodsNum').each(function(i,el){
		// 判断文本框内容是否大于1，来改变-按钮的可用否;
		if(parseInt($(el).val()) > 1){
			$(this).siblings('.numSub').prop('disabled',false);
		}else{
			$(this).siblings('.numSub').prop('disabled',true);
		}
		$(el).keyup(function(){
			var sumPriceInThis = $(this).parent('td').siblings('.t5').children('.sumPrice');
			var goodsNumsInThis =parseInt($(this).val());
			var singlePriceInThis = parseFloat(($(this).parent('td').siblings('.t3').text().split('￥'))[1]);
			var calResult = goodsNumsInThis * singlePriceInThis;
			if(/^[1-9]\d*$/.test($(this).val())){
				$(this).siblings('.numError').html('');
				sumPriceInThis.html(calResult);
			}else{
				$(this).val('');
				sumPriceInThis.html(0);
				$(this).siblings('.numError').html('请输入正确的商品数量');
			}
			(parseInt($(this).val())>=999)&&$(this).val(999);
			calTheSumPrice();
		});
	});
	
}

function goodsNumAddOrSub(){
	//  +
	$('.numAdd').off('click');
	$('.numAdd').click(function(){
		$(this).siblings('.goodsNum').val(function(){
			return (parseInt($(this).val())||0 )+ 1;
		});
		if($(this).siblings('.goodsNum').val() === '1' || $(this).siblings('.goodsNum').val() === ''){
			$(this).siblings('.numSub').prop('disabled',true);
		}else{
			$(this).siblings('.numSub').prop('disabled',false);
		}
		if(/^[1-9]\d*$/.test($('.goodsNum').val())){
			$(this).siblings('.numError').html('');
		}else{
			$(this).val('');
			$(this).siblings('.numError').html('请输入正确的商品数量');
		}
		if(parseInt($(this).siblings('.goodsNum').val())>999){
			$(this).siblings('.goodsNum').val(999);
			$(this).siblings('.numError').html('库存不足！');
		}
		calThisGoodsSumPrice($(this));
		calTheSumPrice();
		// 判断购物车里是否有商品 无则禁止使用结算按钮
		isPayBtnDisabled();
	});
	
	//  -
	$('.numSub').off('click');
	$('.numSub').click(function(){
		$(this).siblings('.goodsNum').val(function(){
			return parseInt($(this).val()) - 1;
		});
		if($(this).siblings('.goodsNum').val() === '1' || $(this).siblings('.goodsNum').val() === ''){
			$(this).prop('disabled',true);
		}else{
			$(this).prop('disabled',false);
		}
		calThisGoodsSumPrice($(this));
		calTheSumPrice();
		// 判断购物车里是否有商品 无则禁止使用结算按钮
		isPayBtnDisabled();
	});
	
}

// 点击+ - 按钮后重新计算该商品总价。
function calThisGoodsSumPrice(el){
	var sumPriceInThis = el.parent('td').siblings('.t5').children('.sumPrice');
	var goodsNumsInThis =parseInt(el.siblings('.goodsNum').val());
	var singlePriceInThis = parseFloat((el.parent('td').siblings('.t3').text().split('￥'))[1]);
	var calResult = goodsNumsInThis * singlePriceInThis;
//	console.log(el.siblings('.goodsNum').val());
	sumPriceInThis.html(calResult);
}










