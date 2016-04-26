$(function(){
	// 移入图片显示阴影，移出隐藏
	showShadow();
	
	// 点击图片跳转
	onTheFooterPageJump();

})
// 点击图片跳转
function onTheFooterPageJump(){
	$('.oTFCPics').click(function(){
		switch($(this).index()){
			case 0 :
					window.location.href = '../../views/MainHtml/productsListMain1.html';
			break;
			case 2 :
					window.location.href = '../../views/MainHtml/productsListMain2.html';
			break;
			default:
			break;
		}
	});
}
	
// 移入图片显示阴影，移出隐藏
function showShadow(){
	$('#onTheFooterC .oTFCPics').hover(function(){
		$(this).children('.oTFCPicsShadow').css({
			'display' : 'block'
		});
	},function(){
		$(this).children('.oTFCPicsShadow').css({
			'display' : 'none'
		});
	});
}
