$(function(){
	
	//F4-F10 轮播效果
	changeICF4ToF10Items();
	//FloorNav切换效果
	changeFloorNav();
	
	//  移入图片上改变li内容,点击添加样式 ,并跳转到相应地区
	changeIndexFNav();
	//  根据滚动条位置来给li添加样式。
//	scrollChangeNav();
	//  返回顶部
	floorNavToTop();
	
	// 点击物品，跳转到详细信息界面
	goToProductsDetails();
})

function goToProductsDetails(){
	$('.iC3ItemsMsg').click(function(){
		var $imgSrc = $(this).children('img').attr('src');
		var $itemName = $(this).children('.iCItemsName').text();
		var $itemPrice = $(this).children('.iCItemsPrice').text();
		var goodsId = $(this).attr('goodsid');
		$.cookies.set('goodsIdMsg',{
			'goodsId' : goodsId,
			'from' : 'indexGoodItems'
		});
		
		window.location.href="../../views/MainHtml/productsDetails.html"
	});
	$('.iC3ItemsMsg').mouseenter(function(){
		$(this).parents('.iC3ItemsBox').stop(false,true);
	});
}

function changeFloorNav(){
	// 把内容区域的offsetTop保存到fHeightArr数组中
	var fHeightArr = [];
	for(var i=0;i<$('#indexContent .indexContent3').size();i++){
		fHeightArr.push($('#indexContent .indexContent3').eq(i).offset().top);
	}
	//根据数组高度决定左侧楼梯导航的显示部分
	$(window).scroll(function(){
		var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		if(scrollTop>=fHeightArr[0]-50){
			$('#J_side_nav').css({
				'display' : 'block'
			});
		}
		else{
			$('#J_side_nav').css({
				'display' : 'none'
			});
		}
		for(var i=0;i<fHeightArr.length;i++){
			if(scrollTop < fHeightArr[0]-50){
				$('.J_ft').eq(0).children('a').addClass('active');
				$('.J_ft').eq(0).siblings('.J_ft').children('a.active').removeClass('active');
				
			}
			else if(scrollTop>fHeightArr[fHeightArr.length-1]-50){
				$('.J_ft').eq(fHeightArr.length-1).children('a').addClass('active');
				$('.J_ft').eq(fHeightArr.length-1).siblings('.J_ft').children('a.active').removeClass('active');
			}
			else{
				if(scrollTop > fHeightArr[i]-50 && scrollTop<fHeightArr[i+1]-50){
					$('.J_ft').eq(i).children('a').addClass('active');
					$('.J_ft').eq(i).siblings('.J_ft').children('a.active').removeClass('active');
				}else{
					continue;
				}
			}
			
		}
	});
}

function changeICF4ToF10Items(){
	changeICFnItems('f4');
	changeICFnItems('f5');
	changeICFnItems('f6');
	changeICFnItems('f7');
	changeICFnItems('f8');
	changeICFnItems('f9');
	changeICFnItems('f10');
}

function changeICFnItems(el){
	var boxIndex = 0;
	var timer = null;
	var minIndex = 2;
	timer = setTimeout(startChangeBoxs,5000);
	var $boxNum = $('.'+el+' .iC3ItemsBoxs>.iC3ItemsBox').size();
	function startChangeBoxs(){
		// 循环播放Box
		boxIndex++;
		var $iC3ItemsBoxArr = $('.'+el+' .iC3ItemsBoxs>.iC3ItemsBox')
		$iC3ItemsBoxArr.stop(true,false);
		$iC3ItemsBoxArr.eq(boxIndex%$boxNum).animate({
			'opacity' : 1,
			'z-index' : minIndex
		},1500).siblings('.iC3ItemsBox').animate({
			'opacity' : 0
		},1500);
		console.log(boxIndex);
		// 改变右侧按钮样式
		$('.'+el+' .iC3RContent .iC3RContentTopItems').eq(boxIndex%$boxNum).addClass('active '+el+'BtnColor')
		.siblings('.'+el+' .iC3RContent .active').removeClass('active '+el+'BtnColor');
		timer = setTimeout(arguments.callee,5000);
	}
	//鼠标点击按钮 改变box显示
	$('.'+el+' .iC3RContentTopItems').click(function(){
		boxIndex = $(this).index();
		$('.'+el+' .iC3RContent .active ').removeClass('active '+el+'BtnColor');
		$(this).addClass('active '+el+'BtnColor');
		$('.'+el+' .iC3ItemsBoxs>.iC3ItemsBox').eq(boxIndex%$boxNum).animate({
			'opacity' : 1,
			'z-index' : minIndex
		},1500).siblings('.iC3ItemsBox').animate({
			'opacity' : 0
		},1500);
		console.log('click'+boxIndex);
		boxIndex--;
		clearTimeout(timer);
		startChangeBoxs();
	});
}

/**************** 楼梯导航FloorNav 部分 *************** */
function floorNavToTop(){
	$('#J_side_nav .f_top').click(function(){
		var doc=document.documentElement.scrollTop? document.documentElement : document.body;
		$(doc).animate({
			'scrollTop' : 0
		});
	});
}



function changeIndexFNav(){
	//  移入图片上改变li内容
	var $indexFloorLis = $('#J_floor_link .J_ft')
	$indexFloorLis.hover(function(){
		$(this).children('a').css({
			'display' : 'block',
		});
	},function(){
		$(this).children('a').css({
			'display' : 'none',
		});
		$(this).children('a.active').css({
			'display' : 'block',
		});
	});
	
	// 点击添加删除样式
	$indexFloorLis.click(function(){
		$(this).siblings().children('a.active').removeClass('active').css({
			'display' : 'none',
		});
		$(this).children('a').addClass('active');
		// 把内容区域的offsetTop保存到fHeightArr数组中
		var fHeightArr = [];
		for(var i=0;i<$('#indexContent .indexContent3').size();i++){
			fHeightArr.push($('#indexContent .indexContent3').eq(i).offset().top);
		}
		var doc=document.documentElement.scrollTop? document.documentElement : document.body;
//		changeFloorNav();
		$(doc).animate({
			'scrollTop' : fHeightArr[$(this).index()]
		},function(){
			$('.J_ft a').css({
				'display' : 'none'
			});
			$('.J_ft a.active').css({
				'display' : 'block'
			});
		});
	});
	
}

function windowScroll(){
	var doc=document.documentElement.scrollTop? document.documentElement : document.body;
//		changeFloorNav();
		$(doc).animate({
			'scrollTop' : fHeightArr[$(this).index()]
		},function(){
			$('.J_ft a').css({
				'display' : 'none'
			});
			$('.J_ft a.active').css({
				'display' : 'block'
			});
		});
}
