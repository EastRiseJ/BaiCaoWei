$(function(){
	//创建cookie
//	$.cookie('userNameTest1','xiaoMing',{
//		expires:10
//	});
	// 判断是否登录 没有的话，直接跳转到首页；
	//isUserNameExit();
	
	// Logo跳转到首页
	logoToIndex();
	
	
	//  根绝cookie决定购物车数量
	showShopItemsNums();
	
	// 搜索功能
	searchGoods();
	
	// 根据sql决定购物车数量
	getSqlShopCarNums();
	
	//  检验用户是否登录
	checkUserName();
	
	//  用户退出
	userBackUp();
	
	//查看购物车
	goToShopCar();
	
	//  头部浮动窗口在scrollTop>600出现 否则隐藏
	showHeaderFixedDiv();
	
	// 跳转到找回密码页面前保存当前网页路径
	savePresentHref();
	
})
// Logo跳转到首页
function logoToIndex(){
	$('.header-BCWLogo').click(function(){
		window.location.href = 'index.html';
	});
	$('.bcw_headLogo').click(function(){
		window.location.href = 'index.html';
	});
}

// 判断是否登录 没有的话，直接跳转到首页；
function isUserNameExit(){
	var userName = utility.Cookie.getCookie('userName');
	if(userName === '' || userName === null ){
		if(window.location.pathname === '/views/MainHtml/index.html' 
		|| window.location.pathname === '/views/MainHtml/userLogin.html'
		|| window.location.pathname === '/views/MainHtml/userRegist.html'){
			
		}else{
			window.location.href = 'userLogin.html';
			alert('请先登录');
		}
	}

}


// 搜索功能
function searchGoods(){
	$('.btn_Hsearch').off('click');
	$('.btn_Hsearch').click(function(){
		var word = $(this).siblings('.tb_Hsearch').val();
		console.log(word);
		if(word.length > 0){
			utility.Cookie.setCookie('searchWord',word);
			window.location.href = 'searchResults.html'
		}else{
			alert('请输入关键字！');		
		}
	});
}
	
	
	
// 根据sql决定购物车数量
function getSqlShopCarNums(){
	var userName = utility.Cookie.getCookie('userName');
	var db_baicaowei = openDatabase('baiCaoWei', '1.0', 'BaiCaoWei DB', 2 * 1024 * 1024);
			console.log('成功打开数据库');
			db_baicaowei.transaction(function (tx) {
				   tx.executeSql('SELECT * FROM shopCar where  userName=?', [userName], function (tx2, results) {
						var len = results.rows.length, i;
						$('.span_HShopCar').html(len);
				   },null);
			});
}
	
	
// 保存当前网页路径
function savePresentHref(){
	$('.header_getNewPwd').click(function(){
		var presentHref = window.location.href;
		utility.Cookie.setCookie('presentHref',presentHref);
		window.location.href = 'forgetPwd.html';
	});
}

function goToShopCar(){
	$('.hCShopCar').click(function(){
		window.location.href="shopCar.html";
	});
}

function showShopItemsNums(){
	var goodsNameNumArr = document.cookie.split('; ');
	var goodsNums = 0;
	for(var i=0;i<goodsNameNumArr.length;i++){
		var checkGoodsName = goodsNameNumArr[i].split('=');
		if(checkGoodsName[0].search(/goodsName/)!== -1){
			goodsNums++;
		}
	}
	$('.span_HShopCar').html(goodsNums);
}

function showHeaderFixedDiv(){
	$(window).scroll(function(){
		var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
		if(scrollTop >= 600){
			$('#headerFixed').slideDown('slow');
		}else{
			$('#headerFixed').slideUp('slow');
		}
	});
	
}


var utiCookie = utility.Cookie;
function userBackUp(){
	
	$('#userBack').click(function(){
		var isBack = confirm('确定要退出吗？');
		if(isBack===true){
			utiCookie.removeCookie('userName');
			window.location.href = 'index.html';
		}
	});
}

function checkUserName(){
	if(utiCookie.getCookie('userName')){
		$('#headerTop .headerTopC2').css({
			'display' : 'block'
		});
		$('#headerTop .headerTopC').css({
			'display' : 'none'
		});
	}else{
		$('#headerTop .headerTopC2').css({
			'display' : 'none'
		});
		$('#headerTop .headerTopC').css({
			'display' : 'block'
		});
	}
}
