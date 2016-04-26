$(function(){
//	var iSpeed = true;
	
	//  点击‘返回顶部按钮’返回顶部
	bSToTop();
//	$(window).scroll(function(){
//		(iSpeed===false)&&$('body').stop();
//		iSpeed=false;
//	});
})
function bSToTop(){
	$('#btn_toTop').click(function(){
		$('body').animate({
			'scrollTop' : 0
		});
	});
}
