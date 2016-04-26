$(function(){
	
	// 页面跳转
	pageJump();
})
// 页面跳转
function  pageJump(){
	$('.userInfors').click(function(){
		window.location.href = 'userCenter.html';
	});
	$('.receiveAddrs').click(function(){
		window.location.href = 'receiveAddress.html';
	});
}