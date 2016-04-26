$(function(){
	// showNav
	showNavAll();
	
	// 点击导航上的找回密码事跳转到找回密码页面前保存当前网页路径
	navForgetPwd();
})
// 点击导航上的找回密码事跳转到找回密码页面前保存当前网页路径
function navForgetPwd(){
	$('.nav2S a:last').click(function(){
		var presentHref = window.location.href;
		utility.Cookie.setCookie('presentHref',presentHref);
		window.location.href = 'forgetPwd.html';
	});
}


function showNavAll(){
	$('#navContent .navAllUlTitle').hover(function(){
		$('.navAllUl').css({
			'display' : 'block'
		});
	},function(){
		$('.navAllUl').css({
			'display' : 'none'
		});
	});
	$('#navContent .navAllUl li').mouseenter(function(){
		$('.navAllUl').css({
			'display' : 'block'
		});
		$(this).siblings('li').css({
//			'background' : '#fff',
//			'color' : '#434a54'
		});
		$('.navLiContent').css({
			'display' : 'block'
		});
//		$(this).children('.navLiContent').css({
//			'display' : 'block'
//		});
		// 更改中间div的内容
		$('.navLiContent:last #J_menu1_con').load('../../views/navOfAll/lv3NavItems.html #J_menu1_con #J_con_'+($(this).index()+1));
	}).mouseleave(function(){
		$('.navAllUl').css({
			'display' : 'none'
		});
		$('.navLiContent').css({
			'display' : 'none'
		});
	});
	$('.navLiContent').hover(function(){
		$(this).css({
			'display' : 'block'
		});
		$('.navAllUl').css({
			'display' : 'block'
		});
	},function(){
		$('.navAllUl').css({
			'display' : 'none'
		});
		$(this).css({
			'display' : 'none'
		});
	});
}



















