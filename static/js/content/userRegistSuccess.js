$(function(){
	
	// 判断是否存在注册帐号
	
	// 获取cookie中相关数据到页面中
	getCookieToPage();
	
	
	// 5秒后返回主页
	fiveSRetrunIndex();
	
	// 返回首页
	toIndex();
})
// 获取cookie中相关数据到页面中
function getCookieToPage(){
	var rMethod = utility.Cookie.getCookie('userRMethod');
	var rPhoneNum = utility.Cookie.getCookie('userRName');
	$('#registMethod').html(rMethod);
	$('#registPhoneNum').html(rPhoneNum);
	
}

// 5秒后返回主页
function fiveSRetrunIndex(){
	var timer = null;
	timer = setInterval(function(){
		$('.secondsSub').text(function(){
			return $(this).text()-1;
		});
		$('.fiveSToIndex').attr('class','fiveSToIndex color'+$('.secondsSub').text());
		if($('.secondsSub').text() === '0') {
			clearInterval(timer);
			window.location.href = 'index.html';
		}
		
	},1000);
	$('.fiveSToIndex').click(function(){
		clearInterval(timer);
		$(this).fadeOut('slow');
	});
}

// 返回首页
function toIndex(){
	$('#btn_backToIndex').click(function(){
		window.location.href = 'index.html';
	});
}
