$(function(){
	$('#headerMain').load('../header/header.html #header');
	$('#navMain').load('../navOfAll/navOfAll.html #nav');
	$('#contentMain').load('../content/submitOrderContent.html #submitOrderContent');
	$('#onTheFooterMain').load('../onTheFooter/onTheFooter.html #onTheFooter');// #onTheFooter
	$('#footerMain').load('../footer/footer.html #footer');
	
	
	$.getScript('../../static/js/header/header.js');
	$.getScript('../../static/js/navOfAll/navOfAll.js');
	$.getScript('../../static/js/content/submitOrderContent.js');
	$.getScript('../../static/js/onTheFooter/onTheFooter.js');
	$.getScript('../../static/js/footer/footer.js')
})
