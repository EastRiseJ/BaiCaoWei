$(function(){
	// 获取相关cookie值;
	getThisGoodsMsg();
	
	

})

	
	
// 获取相关cookie值;
function getThisGoodsMsg(){
//	var goodsId = utility.Cookie.getCookie('goodsId')
	console.log($.cookies.get('goodsIdMsg'));
	var goodsId = $.cookies.get('goodsIdMsg').goodsId;
	var goodsIdFrom = $.cookies.get('goodsIdMsg').from;
	var db_baicaowei = openDatabase('baiCaoWei', '1.0', 'BaiCaoWei DB', 2 * 1024 * 1024);
	db_baicaowei.transaction(function (tx) {
	  	getSqlDatas(tx,goodsIdFrom,goodsId);
	});
}
function getSqlDatas(tx,tableName,goodsId){
	tx.executeSql('SELECT * FROM '+tableName+' where goodsId=?', [goodsId], function (tx, results) {
		var len = results.rows.length, i;
		console.log(len);
		if(len !== 0){
			var goodsImgSrc = results.rows.item(0).goodsImgSrc;
			var goodsName = results.rows.item(0).goodsName;
			var goodsPrice = results.rows.item(0).goodsPrice;
		
		   $('.pDContentMain .pDContentMainLeftPic img').attr('src', goodsImgSrc );
			$('.pDContentMain .big_pic').html('<img src="'+ goodsImgSrc +'" width="840" height="840" />');
			$('#goodsName').html(goodsName);
			$('.span_goodsNewPrice').html('￥'+goodsPrice+'元');
			$('.span_goodsOldPrice').html('￥'+(goodsPrice*2)+'元');
			
			// 保存用户浏览记录
			function saveBrowseHistory(){
				var userName = utiCookie.getCookie('userName');
				tx.executeSql('CREATE TABLE IF NOT EXISTS browseHistory (id unique, name unique, password, RMethod,yuE,beans)');
				   
			}
			saveBrowseHistory();
			
			// 数量加减
			goodsNumAddOrSub();
			
			// 数量文本框只能输入数字,当数量为1时，不能点击-；
			numbersInputControl();
			
			// 加入购物车
			addToShopCar();
			
			// 飞入购物车
			flyToShopCar();
			
			// 到一定ScrollTop 出现返回顶部按钮
			showBtnGoTop();
			
			// 放大镜
			seeBigPic();
			
			// 返回顶部
			productsDetGoTop();
		}
	},null);
}


// 放大镜
function seeBigPic(){
	var oDiv = $('.pDContentMainLeftPic');
	var oSmallP = $('.pDContentMainLeftPic img');
	var oMark = $('.pDContentMainLeftPic .mark');
	var oFloat = $('.pDContentMainLeftPic .float_layer');
	var oBigP = $('.big_pic');
	var oImg = $('.big_pic img');
	oMark.hover(function(){
		oFloat.css('display','block');
		oBigP.css('display','block');
	},function(){
		oFloat.css('display','none');
		oBigP.css('display','none');
	});
	oMark.mousemove(function(ev){
		var oEvent = ev || window.event;
		var l = oEvent.pageX - oDiv.prop('offsetLeft') - oSmallP.prop('offsetLeft') - oFloat.outerWidth(true)/2;
		var t = oEvent.pageY - oDiv.prop('offsetTop') - oSmallP.prop('offsetTop') - oFloat.outerHeight(true)/2;
		if(l<0)
		{
			l=0;
		}
		else if(l>oMark.outerWidth(true)-oFloat.outerWidth(true))
		{
			l=oMark.outerWidth(true)-oFloat.outerWidth(true);
		}
		
		if(t<0)
		{
			t=0;
		}
		else if(t>oMark.outerHeight(true)-oFloat.outerHeight(true))
		{
			t=oMark.outerHeight(true)-oFloat.outerHeight(true);
		}
		oFloat.css('left', l);
		oFloat.css('top', t);
		var percentX=l/(oMark.outerWidth(true)-oFloat.outerWidth(true));
		var percentY=t/(oMark.outerHeight(true)-oFloat.outerHeight(true));
		
		oImg.css('left' , percentX*(oBigP.outerWidth(true)- oImg.outerWidth(true)));
		oImg.css('top' , percentY*(oBigP.outerHeight(true) - oImg.outerHeight(true)));
		
		
	});
}
	
// 到一定ScrollTop 出现返回顶部按钮
function showBtnGoTop(){
	$(window).scroll(function(){
		var scrollTop=document.documentElement.scrollTop?
						document.documentElement.scrollTop : 
						document.body.scrollTop;
		if(scrollTop>500){
			$('.proDetCGoTop').show('slow');
		}else{
			$('.proDetCGoTop').hide('slow');
		}
		
	});
}

// 返回顶部
function productsDetGoTop(){
	// 移入移出改样式
	$('.proDetCGoTop').hover(function(){
		$(this).text('返回顶部');
	},function(){
		$(this).text('TOP');
	});
	
	// 点击返回顶部
	$('.proDetCGoTop').click(function(){
		var doc=document.documentElement.scrollTop? document.documentElement : document.body;
		$(doc).animate({
			'scrollTop' : 0
		});
	});
}

// 点击按钮，飞入购物车然后购物车加1。
//function clickButtonAddOne(){
//	$('#addInCar').click(function(){
//		flyToShopCar();
//		setTimeout(addToShopCar,2000);
//	});
//}

//飞入购物车
function flyToShopCar(){
	var offset = $(".span_HShopCar").offset(); 
	var offset2 = document.documentElement;
    $("#addInCar").click(function(event){ 
        var addcar = $(this); 
        var img = addcar.parents('.pDContentMain').find('img').attr('src'); 
        var shopCar = $('.hCShopCar:visible').eq(0);
        var flyer = $('<img class="u-flyer" src="'+img+'" width="80" height="80">'); 
        flyer.fly({ 
            start: { 
                left: event.clientX, //开始位置（必填）#fly元素会被设置成position: fixed 
                top: event.clientY //开始位置（必填） 
            }, 
            end: { 
                left: shopCar.prop('offsetLeft')+shopCar.outerWidth(true)/2, //结束位置（必填）1211 
                top: shopCar.prop('offsetTop')+shopCar.outerHeight(true)/2, //结束位置（必填） 70
                width: 0, //结束时宽度 
                height: 0 //结束时高度 
            }, 
            onEnd: function(){ //结束回调 
//              $("#msg").show().animate({width: '250px'}, 200).fadeOut(1000); //提示信息 
//              addcar.css("cursor","default").removeClass('orange').unbind('click'); 
                this.destory(); //移除dom 
            } 
        }); 
    }); 
}
	
// 判断是否有用户登录，没有则不能加入购物车
//function userNameIsExit(){
//	var userName = utility.Cookie.getCookie('userName');
//	if(userName === '' || userName === null ){
//		alert('请先登录');
//		return;
//	}else{
//		
//	}
//		
//	
//}


function addToShopCar(){
	$('#addInCar').click(function(){
		var userName = utiCookie.getCookie('userName');
		var $imgSrc2 = $('.pDContentMainLeftPic img').attr('src');
		var $goodsName2 = $('#goodsName').text();
		var $goodsPrice2 =  $('.span_goodsNewPrice').text();
		var $goodsNums2 = $('#goodsNum').val();
		var $goodsWholePrice = parseFloat($goodsPrice2.split('￥')[1]) * parseInt($goodsNums2);
		console.log($goodsWholePrice);
		var oDate = new Date();
		var lastShopId;
		var $goodsId = $.cookies.get('goodsIdMsg').goodsId;
		var db_baicaowei = openDatabase('baiCaoWei', '1.0', 'BaiCaoWei DB', 2 * 1024 * 1024);
			console.log('成功打开数据库');
			db_baicaowei.transaction(function (tx) {
				   tx.executeSql('SELECT * FROM shopCar where goodsId =? and userName=?', [$goodsId,userName], function (tx2, results) {
					    var len = results.rows.length, i;
					    msg = "<p>查询记录条数: " + len + "</p>";
					    debugger
					    console.log(msg);
				    	if(len>0){
				    		// 如果购物车存在该商品则数量+1.
					   		 var oldNums = results.rows.item(0).itemsNums;
					   		 var newNums = oldNums + parseInt($goodsNums2);
					   		 var oldWholePrice =  results.rows.item(0).itemsWholePrice;
					   		 var  NewWholePrice = parseFloat(oldWholePrice) + $goodsWholePrice;
				    		updateGoodsNum(tx,newNums,NewWholePrice,userName);
				    	}else{
				    		tx.executeSql('SELECT * FROM shopCar',[],function(tx, results3){
				    			var len2 = results3.rows.length, i;
				    			var lastShopId=1;
				    			console.log(len2);
				    			if(!len2){
				    				lastShopId = 1;
				    			}else{
				    				lastShopId = results3.rows.item(len2-1).shopCarId;
				    			}
				    			
				    			// 如果购物车不存在该商品则记录+1.
					    		addOneShopRecord(tx,lastShopId);
						    },null);
				    	}
						
				   }, null);
				});
			// 如果购物车存在该商品则数量+1.
			function updateGoodsNum(tx,newNums,NewWholePrice,userName){
				 tx.executeSql('update shopCar set itemsNums=? where goodsId =? and userName=?',[newNums,$goodsId,userName]);
				 tx.executeSql('update shopCar set itemsWholePrice=? where goodsId =? and userName=?',[NewWholePrice,$goodsId,userName]);
				setTimeout(function(){
					$('#headerMain').load('../header/header.html #header');
					$.getScript('../../static/js/header/header.js');
				},800);
				setTimeout(function(){
					$('#header .addShopCar-Prompt').animate({
						'width' : 150,
						'height' : 30,
						'opacity' : 1
					},800).delay(500).animate({
						// 'width' : 0,
						// 'height' :0,
						'opacity' : 0
						// 'left' : 670,
						// 'top'  : 30
					},800);
				},1000);
			}
			// 如果购物车不存在该商品则记录+1.
			function addOneShopRecord(tx,lastShopId){
				var shopCarId2 = lastShopId+1;
				tx.executeSql('INSERT INTO shopCar (shopCarId, goodsId, userName, itemsImgSrc,itemsName, itemsPrice,itemsNums,itemsWholePrice) VALUES (?,?,?,?,?,?,?,?)',
				   [shopCarId2,$goodsId,userName,$imgSrc2,$goodsName2,$goodsPrice2,$goodsNums2,$goodsWholePrice],function () { 
	//			   		alert('加入购物车成功');
				   		setTimeout(function(){
							$('#headerMain').load('../header/header.html #header');
							$.getScript('../../static/js/header/header.js');
						},800);
						
						setTimeout(function(){
							$('#header .addShopCar-Prompt').animate({
								'width' : 150,
								'height' : 30,
								'opacity' : 1
							},800).delay(500).animate({
								// 'width' : 0,
								// 'height' :0,
								'opacity' : 0
								// 'left' : 670,
								// 'top'  : 30
							},800);
							
							var scrollTop = document.documentElement.scrollTop || 
											document.body.scrollTop;
							if(scrollTop > 310){
								$('#headerFixed').css({
									'display' : 'block'
								});
							}
							
						},1000);
					},
					function (tx, error) { alert('添加数据失败: ' + error.message); 
					} );
			}
		
		var oTimeIndex = ''+oDate.getDate()+'-'+oDate.getHours()+'-'+oDate.getMinutes()+'-'+oDate.getSeconds();
		
		//  验证购物车里是否有该商品
		//  反编译cookie
//		var goodsNameAfter = decodeURIComponent(document.cookie);
//		var goodsNameNumArr = goodsNameAfter.split('; ');
//		var goodsNums = 0;
//		var isHaveThis = false;
//		for(var i=0;i<goodsNameNumArr.length;i++){
//			var goodsSrc = goodsNameNumArr[i].split('=');
//			if(goodsSrc[1] === $imgSrc2 && goodsSrc[0].search(/imgSrcs/)!==-1){
//				console.log('正在加入购物车已有商品');
//				isHaveThis = true;
//				//  获取到该产品存入cookie中的名字
//				var goodsSrcTime = goodsSrc[0].split('cs');
//				//  获取到原来该商品的数量;
//				var goodsNameOldNums = utility.Cookie.getCookie('goodsNums'+goodsSrcTime[1]);
//				utility.Cookie.setCookie('goodsNums'+goodsSrcTime[1],parseInt(goodsNameOldNums)+parseInt($goodsNums2),30);
////				alert('购物车已有产品，已修改数量');
////				window.location.reload();
////				$('.span_HShopCar').load();
//				setTimeout(function(){
//					$('#header .addShopCar-Prompt').animate({
//						'width' : 150,
//						'height' : 30,
//						'opacity' : 1
//					},800).delay(500).animate({
//						// 'width' : 0,
//						// 'height' :0,
//						'opacity' : 0
//						// 'left' : 670,
//						// 'top'  : 30
//					},800);
//				},800);
//				break;
//			}
//		}
//		if(isHaveThis === false){
//			utility.Cookie.setCookie('imgSrcs'+oTimeIndex,$imgSrc2,30);
//			utility.Cookie.setCookie('goodsName'+oTimeIndex,$goodsName2,30);
//			utility.Cookie.setCookie('goodsPrice'+oTimeIndex,$goodsPrice2,30);
//			utility.Cookie.setCookie('goodsNums'+oTimeIndex,$goodsNums2,30);
////			window.location.reload();
////			alert('已成功加入购物车');
//			$('#headerMain').load('../header/header.html #header');
//			$.getScript('../../static/js/header/header.js');
//			setTimeout(function(){
//				$('#header .addShopCar-Prompt').animate({
//					'width' : 150,
//					'height' : 30,
//					'opacity' : 1
//				},800).delay(500).animate({
//					// 'width' : 0,
//					// 'height' :0,
//					'opacity' : 0
//					// 'left' : 670,
//					// 'top'  : 30
//				},800);
//			},800);
//		}
		
	});
	
}

function numbersInputControl(){
	$('#goodsNum').keyup(function(){
		if(/^[1-9]\d*$/.test($(this).val())){
			$('.numError').html('');
		}else{
			$(this).val('');
			$('.numError').html('请输入正确的商品数量');
		}
		(parseInt($(this).val())>=999)&&$(this).val(999);
	});
	
}

function goodsNumAddOrSub(){
	$('#numAdd').click(function(){
		$('#goodsNum').val(function(){
			return (parseInt($(this).val())||0 )+ 1;
		});
		if($('#goodsNum').val() === '1' || $('#goodsNum').val() === ''){
			$('#numSub').prop('disabled',true);
		}else{
			$('#numSub').prop('disabled',false);
		}
		if(parseInt($('#goodsNum').val())>999){
			$('#goodsNum').val(999);
			$('.numError').html('库存不足！');
		}
	});
	$('#numSub').click(function(){
		$('#goodsNum').val(function(){
			return parseInt($(this).val()) - 1;
		});
		if($('#goodsNum').val() === '1' || $('#goodsNum').val() === ''){
			$('#numSub').prop('disabled',true);
		}else{
			$('#numSub').prop('disabled',false);
		}
	});
	
}
