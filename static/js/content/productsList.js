$(function(){
	// 点击左侧导航栏跳转相应页面
	leftNavJumpPage();
	
	// 加入购物车
	addToShopCar();
	
	// 飞入购物车
	flyToShopCar();
	
	// 点击物品，跳转到详细信息界面
	goToProductsDetails();
})
// 点击左侧导航栏跳转相应页面
function leftNavJumpPage(){
	$('.lvToNav li').eq(1).click(function(){
		window.location.href = 'productsListMain.html';
	});
	$('.lvToNav li').eq(10).click(function(){
		window.location.href = 'productsListMain2.html';
	});
}


// 点击物品，跳转到详细信息界面
function goToProductsDetails(){
	$('.iC3ItemsMsg').click(function(){
		var $imgSrc = $(this).children('img').attr('src');
		var $itemName = $(this).children('.iCItemsName').text();
		var $itemPrice = $(this).children('.iCItemsPrice').text();
//		alert($imgSrc + '; '+$itemName + '; '+$itemPrice);
		utility.Cookie.setCookie('imgSrc',$imgSrc);
		utility.Cookie.setCookie('itemName',$itemName);
		utility.Cookie.setCookie('itemPrice',$itemPrice);
		window.location.href="../../views/MainHtml/productsDetails.html"
	});
	$('.iC3ItemsMsg').mouseenter(function(){
		$(this).parents('.iC3ItemsBox').stop(false,true);
	});
}


//飞入购物车
function flyToShopCar(){
	var offset = $(".span_HShopCar").offset(); 
	var offset2 = document.documentElement;
    $(".proListAddShopCar").click(function(event){ 
        var addcar = $(this); 
        var img = addcar.siblings('img').attr('src'); 
        var shopCar = $('.hCShopCar:visible').eq(0);
        var flyer = $('<img class="u-flyer" src="'+img+'" width="80" height="80" style="z-index:20001;" />'); 
        flyer.fly({ 
            start: { 
                left: event.clientX, //开始位置（必填）#fly元素会被设置成position: fixed 
                top: event.clientY //开始位置（必填） 
            }, 
            end: { 
                left: shopCar.prop('offsetLeft') + shopCar.outerWidth(true)/2, //结束位置（必填） 
                top: shopCar.prop('offsetTop')+shopCar.outerHeight(true)/2, //结束位置（必填） 
                width: 0, //结束时宽度 
                height: 0 //结束时高度 
            }, 
            onEnd: function(){ //结束回调 
//              $("#msg").show().animate({width: '250px'}, 200).fadeOut(1000); //提示信息 
//              addcar.css("cursor","default").removeClass('orange').unbind('click'); 
                this.destory(); //移除dom 
            } 
        }); 
        return false;
    }); 
}

function addToShopCar(){
	$('.proListAddShopCar').click(function(){
		var $imgSrc2 = $(this).siblings('img').attr('src');
		var $goodsName2 =  $(this).siblings('.iCItemsName').text();
		var $goodsPrice2 =  $(this).siblings('.iCItemsPrice').text();
		var $goodsNums2 = 1;
		var oDate = new Date();
		var oTimeIndex = ''+oDate.getDate()+'-'+oDate.getHours()+'-'+oDate.getMinutes()+'-'+oDate.getSeconds();
		
		//  验证购物车里是否有该商品
		//  反编译cookie
		var goodsNameAfter = decodeURIComponent(document.cookie);
		var goodsNameNumArr = goodsNameAfter.split('; ');
		var goodsNums = 0;
		var isHaveThis = false;
		for(var i=0;i<goodsNameNumArr.length;i++){
			var goodsSrc = goodsNameNumArr[i].split('=');
			if(goodsSrc[1] === $imgSrc2 && goodsSrc[0].search(/imgSrcs/)!==-1){
				console.log('正在加入购物车已有商品');
				isHaveThis = true;
				//  获取到该产品存入cookie中的名字
				var goodsSrcTime = goodsSrc[0].split('cs');
				//  获取到原来该商品的数量;
				var goodsNameOldNums = utility.Cookie.getCookie('goodsNums'+goodsSrcTime[1]);
				utility.Cookie.setCookie('goodsNums'+goodsSrcTime[1],parseInt(goodsNameOldNums)+parseInt($goodsNums2),30);
//				alert('购物车已有产品，已修改数量');
//				window.location.reload();
//				$('.span_HShopCar').load();
				break;
			}
		}
		if(isHaveThis === false){
			utility.Cookie.setCookie('imgSrcs'+oTimeIndex,$imgSrc2,30);
			utility.Cookie.setCookie('goodsName'+oTimeIndex,$goodsName2,30);
			utility.Cookie.setCookie('goodsPrice'+oTimeIndex,$goodsPrice2,30);
			utility.Cookie.setCookie('goodsNums'+oTimeIndex,$goodsNums2,30);
//			window.location.reload();
//			alert('已成功加入购物车');
			setTimeout(function(){
				$('#headerMain').load('../header/header.html #header');
				$.getScript('../../static/js/header/header.js');
			},800);
			setTimeout(function(){
				alert('已成功加入购物车');
				
				$('#headerFixed').css({
					'display' : 'block'
				});
			},1000);
		}
		
        return false;
	});
	
}