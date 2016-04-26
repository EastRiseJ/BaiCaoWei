$(function(){
	//  移入图片上改变li内容,点击添加样式
	changeIndexFNav();
	//  根据滚动条位置来给li添加样式。
	scrollChangeNav();
})
function scrollChangeNav(){
	
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
	});
	
}
