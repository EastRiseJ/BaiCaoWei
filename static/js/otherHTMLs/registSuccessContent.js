$(function(){
	$('#headerMain').load('../header/header.html #header');
	$('#navMain').load('../navOfAll/navOfAll.html #nav');
	//此处插入其他Html导入代码
	$('#contentMain').load('../content/userRegistSuccess.html #loginContent');
	
	$('#onTheFooterMain').load('../onTheFooter/onTheFooter.html #onTheFooter');// #onTheFooter
	$('#footerMain').load('../footer/footer.html #footer');
	
	
	$.getScript('../../static/js/header/header.js');
	$.getScript('../../static/js/navOfAll/navOfAll.js');
	//此处插入其他JS导入代码
	$.getScript('../../static/js/content/userRegistSuccess.js');
	
	
	$.getScript('../../static/js/onTheFooter/onTheFooter.js');
	$.getScript('../../static/js/footer/footer.js')
})
