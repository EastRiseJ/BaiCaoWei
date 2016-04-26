$(function(){
	// 从Json中加载数据并添加到DOM树上
//	getJSONToDomTree();

	// 点击左侧导航栏跳转相应页面
	leftNavJumpPage();

	// 数据库导入数据加载到Dom树
	getSqlDataToDomTree();
	
})
// 点击左侧导航栏跳转相应页面
function leftNavJumpPage(){
	$('.lvToNav li').eq(1).click(function(){
		window.location.href = 'productsListMain1.html';
	});
	$('.lvToNav li').eq(10).click(function(){
		window.location.href = 'productsListMain2.html';
	});
}

// 数据库导入数据加载到Dom树
function getSqlDataToDomTree(){
	var goodsBox = $('.productsListCRightItems');
	
//	console.log(searchWord);
	var db_baicaowei = openDatabase('baiCaoWei', '1.0', 'BaiCaoWei DB', 2 * 1024 * 1024);
	db_baicaowei.transaction(function (tx) {
	   tx.executeSql('SELECT * FROM indexGoodItems', [], function (tx, results) {
	      var len = results.rows.length, i;
	      var searchWord = utility.Cookie.getCookie('searchWord');
	      var goodsId;
	      var goodsImgSrc;
	      var goodsName;
	      var goodsPrice;
	      
	      var isNoGoods = true;
	      console.log(len);
		  for(var j=0;j<len;j++){
		  	
		  	goodsName = results.rows.item(j).goodsName;
		  	console.log(goodsName);
		  	if(goodsName.search(searchWord) !== -1){
		  		isNoGoods = false;
		  		goodsId = results.rows.item(j).goodsId;
		  		goodsImgSrc = results.rows.item(j).goodsImgSrc;
		  		goodsPrice = results.rows.item(j).goodsPrice;
		  		goodsBox.append($('<div class="iC3ItemsMsg" goodsid="'+goodsId+'"><img src="'+goodsImgSrc+'" /><p class="iCItemsName">'+goodsName+'</p><p class="iCItemsPrice">￥'+goodsPrice+' </p><span class="proListAddShopCar">加入购物车</span></div>'));
		  	}
	     		
		  }
		  if(isNoGoods){
		  	goodsBox.append($('<h2>未找到商品!</h2>'));
		  }
			// 加入购物车
			addToShopCar();
			
			// 飞入购物车
			flyToShopCar();
			
			// 点击物品，跳转到详细信息界面
			goToProductsDetails();
	   }, null);
	  });
	  
}

// 从Json中加载数据并添加到DOM树上
function getJSONToDomTree(){
	//  获取json文件里的数据
	$.getJSON('../../static/userInfors/productsList2.txt',function(data){
		var jsonData = data.goodsList2;
		for(var i=0;i<jsonData.length;i++){
			$('<div class="iC3ItemsMsg"><img src="'+jsonData[i].goods_imgSrc+'" /><p class="iCItemsName">'+jsonData[i].goods_name+'</p><p class="iCItemsPrice">'+jsonData[i].goods_price+' </p><span class="proListAddShopCar">加入购物车</span></div>')
			console.log(jsonData[i]);
		}
	});
}
// 点击物品，跳转到详细信息界面
function goToProductsDetails(){
//	$('.iC3ItemsMsg').off('click mouseenter');
	$('.iC3ItemsMsg').click(function(){
		var $goodsId = $(this).attr('goodsId');
		var $imgSrc = $(this).children('img').attr('src');
		var $itemName = $(this).children('.iCItemsName').text();
		var $itemPrice = $(this).children('.iCItemsPrice').text();
		alert($imgSrc + '; '+$itemName + '; '+$itemPrice);
		$.cookies.set('goodsIdMsg',{
			'goodsId' : $goodsId,
			'from' : 'indexGoodItems'
		});
		utility.Cookie.setCookie('imgSrc',$imgSrc);
		utility.Cookie.setCookie('itemName',$itemName);
		utility.Cookie.setCookie('itemPrice',$itemPrice);
		window.location.href="../../views/MainHtml/productsDetails.html"
	});
	$('.iC3ItemsMsg').mouseenter(function(){
		$(this).parents('.iC3ItemsBox').stop(false,true);
	});
}


//飞入购物车
function flyToShopCar(){
	var offset = $(".span_HShopCar").offset(); 
	var offset2 = document.documentElement;
    $(".proListAddShopCar").click(function(event){ 
        var addcar = $(this); 
        var img = addcar.siblings('img').attr('src'); 
        var shopCar = $('.hCShopCar:visible').eq(0);
        var flyer = $('<img class="u-flyer" src="'+img+'" width="80" height="80" style="z-index:20001;" />'); 
        flyer.fly({ 
            start: { 
                left: event.clientX, //开始位置（必填）#fly元素会被设置成position: fixed 
                top: event.clientY //开始位置（必填） 
            }, 
            end: { 
                left: shopCar.prop('offsetLeft') + shopCar.outerWidth(true)/2, //结束位置（必填） 
                top: shopCar.prop('offsetTop')+shopCar.outerHeight(true)/2, //结束位置（必填） 
                width: 0, //结束时宽度 
                height: 0 //结束时高度 
            }, 
            onEnd: function(){ //结束回调 
//              $("#msg").show().animate({width: '250px'}, 200).fadeOut(1000); //提示信息 
//              addcar.css("cursor","default").removeClass('orange').unbind('click'); 
                this.destory(); //移除dom 
            } 
        }); 
        return false;
    }); 
}

function addToShopCar(){
	$('.proListAddShopCar').off('click');
	$('.proListAddShopCar').click(function(){
		var userName = utility.Cookie.getCookie('userName');
		var $goodsId = $(this).parent('.iC3ItemsMsg').attr('goodsId');
		var $imgSrc2 = $(this).siblings('img').attr('src');
		var $goodsName2 =  $(this).siblings('.iCItemsName').text();
		var $goodsPrice2 =  $(this).siblings('.iCItemsPrice').text();
		var $goodsNums2 = 1;
		var $goodsWholePrice = parseFloat($goodsPrice2.split('￥')[1])*parseInt($goodsNums2);
		var oDate = new Date();
		var oTimeIndex = ''+oDate.getDate()+'-'+oDate.getHours()+'-'+oDate.getMinutes()+'-'+oDate.getSeconds();
		
		
			// 存入数据库
//			var shopCarId = $(this).parent('.iC3ItemsMsg').attr('goodsid');
			console.log($goodsId);
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
					   		 var newNums = oldNums + $goodsNums2;
				    		updateGoodsNum(tx,newNums,userName);
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
						
				   }, function(tx, results){
					});
				});
			// 如果购物车存在该商品则数量+1.
			function updateGoodsNum(tx,newNums,userName){
				 tx.executeSql('update shopCar set itemsNums=? where goodsId =? and userName=?',[newNums,$goodsId,userName]);
				setTimeout(function(){
					$('#headerMain').load('../header/header.html #header');
					$.getScript('../../static/js/header/header.js');
				},800);
				setTimeout(function(){
					alert('已成功加入购物车');
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
							alert('已成功加入购物车');
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
			
			
		
        return false;
	});
	
}