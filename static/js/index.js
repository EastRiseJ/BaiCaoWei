$(function(){
	$('#headerMain').load('../header/header.html #header');
	$('#navMain').load('../navOfAll/navOfAll.html #nav');
	$('#bannerMain').load('../content/indexBanner.html #banner');
	$('#contentMain').load('../content/indexContent.html #indexContent');
//	$('#indexFloorNavMain').load('../content/indexFloorNav.html #J_side_nav');
	$('#onTheFooterMain').load('../onTheFooter/onTheFooter.html #onTheFooter');// #onTheFooter
	$('#footerMain').load('../footer/footer.html #footer');
	$.getScript('../../static/js/header/header.js');
	$.getScript('../../static/js/navOfAll/navOfAll.js');
//	$.getScript('http://127.0.0.1:8020/BaiCaoWei/static/js/content/indexFloorNav.js');
	$.getScript('../../static/js/content/indexBanner.js');
	$.getScript('../../static/js/content/indexContent.js');
	$.getScript('../../static/js/onTheFooter/onTheFooter.js');
	$.getScript('../../static/js/footer/footer.js')
})
