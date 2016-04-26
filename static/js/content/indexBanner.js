$(function(){
	changePics();
	rightEWM();
})
//右边二维码的显示隐藏
function rightEWM(){
	$('#bannerContent .fixS').click(function(){
		$('#bannerContent .bCMsg').css('display','block');
		$('#bannerContent .bCMsg').css({
			'width' : '138px'
		});
	});
	$("#btn_closeEWM").click(function(){
		$('#bannerContent .bCMsg').animate({
			'width' : 0
		});
	});
}

//图片轮播（透明度）和按钮移上去切换
function changePics(){
	var indexTimer = null;
	var index = 0;
	indexTimer = setTimeout(startChange,3000);
	var $imgNums = $('#bannerContent>img').size();
	function startChange(){
		index++;
		//点击按钮显示对应图片
		$('#bannerContent>img').stop(true,false);
		$('#bannerContent>img').eq(index%$imgNums).animate({
			'opacity' : 1
		},800);
		$('#bannerContent>img').eq(index%$imgNums).siblings('#bannerContent>img').animate({
			'opacity' : 0
		},800);
//		$('#bannerContent .btnactive').removeClass('btnactive');
		$('#bannerContent>button').eq(index%$imgNums).addClass('btnactive')
		.siblings('#bannerContent>button.btnactive').removeClass('btnactive');
		indexTimer = setTimeout(arguments.callee,3000);
		
	}
	$('#bannerContent button').mouseenter(function(){
		index = $(this).index();
		$('#bannerContent button.btnactive').removeClass('btnactive');
		$(this).addClass('btnactive');
		$('#bannerContent>img').eq(index%$imgNums).animate({
			'opacity' : 1
		},800);
		$('#bannerContent>img').eq(index%$imgNums).siblings('#bannerContent>img').animate({
			'opacity' : 0
		},800);
//		index--;
		clearTimeout(indexTimer);
		startChange();
	});
}

