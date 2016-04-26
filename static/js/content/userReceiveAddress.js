$(function(){
	$('#form1').submit(false);
	
	// 点击 添加收货地址 显示表单
	showForm();
	
	// 表单验证
	checkAddressForm();
	
	// 动态添加已有地址
	showAllAddress();
	
	// 点击提交按钮保存数据 和取消按钮
	submitAddressMsg();
	
	// 地区SelectChange
	changeSelects();
	
	
	// 修改和删除数据
	msgOption();
	
	// 页面跳转
	pageJump();

	
	
	// 返回提交订单 
	backToShopCar();
	
	
})
// 添加select默认项;
function loadAddSelectOptions(){
	var $province = $('.select_province');
	var $city = $('.select_city');
	var $area = $('.select_area');
	$city.html('');
	$area.html('');
	addOptions($city,['台州市','杭州市','温州市','宁波市','绍兴市']);
	addOptions($area,['黄岩区','温岭区','临海区','椒江区','路桥区']);
}
	
// 地区SelectChange
function changeSelects(){
	var $province = $('.select_province');
	var $city = $('.select_city');
	var $area = $('.select_area');
	// 切换省改变市的选项
	$province.change(function(){
		switch($(this).val()){
			case '浙江':
				$city.html('');
				addOptions($city,['杭州市','台州市','温州市','宁波市','绍兴市']);
				$area.html('');
				addOptions($area,['西湖','上城','江干','拱墅','滨江','余杭','萧山']);
			break;
				case '上海':
				$city.html('');
				addOptions($city,['上海市']);
				$area.html('');				
				addOptions($area,['黄浦区','宝山区','奉贤区']);
			break;
			default:
			break;
		}
	});
	// 切换市改变区的选项
	$city.change(function(){
		switch($(this).val()){
			case '台州市':
				$area.html('');
				addOptions($area,['黄岩区','温岭区','临海区','椒江区','路桥区']);
			break;
			case '杭州市':
				$area.html('');
				addOptions($area,['西湖','上城','江干','拱墅','滨江','余杭','萧山']);
			break;
			case '上海市':
				$area.html('');
				addOptions($area,['黄浦区','宝山区','奉贤区']);
			break;
			default:
			break;
		}
	});
	
}
// 添加options
function addOptions(obj,optArr){
	for(var i=0;i<optArr.length;i++){
		obj.append('<option>'+ optArr[i] +'</option>');
	}
}

// 表单验证
function checkAddressForm(){
	// 验证input[type=text]的文本框
	$('#form1 input[type=text]').focusout(function(){
		var regExp ;
		switch($(this).attr('class')){
			case 'tb_fRecivePeople' :
					regExp = new RegExp('^\.\+$');
			break;
			case 'tb_fAddresasDetail' :
					regExp = new RegExp('^\.\+$');
			break;
			case 'tb_fPostCode' :
					regExp = new RegExp('^\\d{6}$');
			break;
			case 'tb_fPhoneNum' :
					regExp = new RegExp('^\\d{11}$');
			break;
			case 'tb_fTelphone' :
					regExp = new RegExp('(^\.{3,4}-\\d{8}$)|(^$)');
			break;
			default:
			break;
		}
		regCheckedForm(regExp,$(this));
	});
	
}


// 正则判断正确否
function regCheckedForm(regExp,obj){
	if(regExp.test(obj.val())){
		obj.next('.address-error').css({
							'visibility' : 'hidden'
					});
		$(obj).css({
			'box-shadow' : 'none'
		});
	}else{
		obj.next('.address-error').css({
							'visibility' : 'visible'
						});
		$(obj).css({
			'box-shadow' : '0 0 20px red'
		});
}
	
							
}


// 页面跳转
function  pageJump(){
	$('.userInfors').click(function(){
		window.location.href = 'userCenter.html';
	});
	$('.receiveAddrs').click(function(){
		window.location.href = 'receiveAddress.html';
	});
}
// 动态添加已有地址
function showAllAddress(){
	//  反编译cookie
	var goodsAfter = decodeURIComponent(document.cookie);
	var goodsArr = goodsAfter.split('; ');
	for(var i=0;i<goodsArr.length;i++){
		var checkThisCookieName = goodsArr[i].split('=');
		if(checkThisCookieName[0].search(/addressMsg-/)!==-1){
			console.log('checkThisCookieName[0]');
			var $tr = $('<tr cookieName="'+checkThisCookieName[0]+'"></tr>'),
				$td1 = $('<td class="t1">'+ $.cookies.get(checkThisCookieName[0]).RecivePeople  +'</td>'),
				$td2 = $('<td class="t2">'+ $.cookies.get(checkThisCookieName[0]).Place  +'</td>'),
				$td3 = $('<td class="t3">'+ $.cookies.get(checkThisCookieName[0]).AddressDetail  +'</td>'),
				$td4 = $('<td class="t4">'+ $.cookies.get(checkThisCookieName[0]).PostCode  +'</td>'),
				$td5 = $('<td class="t5">'+ $.cookies.get(checkThisCookieName[0]).PhoneNum +'/'+ $.cookies.get(checkThisCookieName[0]).TelphoneNum +'</td>'),
				$td6 = $('<td class="t6"><a href="javascript:;" class="editAddress">修改</a>|<a href="javascript:;" class="deletAddress" >删除</a></td>'),
				$td7 = $('<td class="t7">'+ $.cookies.get(checkThisCookieName[0]).IsDefault  +'</td>');
			$tr.append($td1);
			$tr.append($td2);
			$tr.append($td3);
			$tr.append($td4);
			$tr.append($td5);
			$tr.append($td6);
			$tr.append($td7);
			var $tbody = $('.allOfAddress tbody');
			var $tr1 = $('.allOfAddress tbody tr:first');
			if($tbody.has('tr')===true){
				$tr.insertBefore($tr1);
			}else{
				$tbody.append($tr);
			}
		}
	}
}
// 修改和删除数据
function msgOption(){
	$('.editAddress').click(function(){
		// 添加select默认项;
		loadAddSelectOptions();
		
		// 修改数据
		var isDefaultAddr = $(this).parents('tr').find('.isDefault');
		var isNotDefaultAddr = $(this).parents('tr').find('.isnotDefault');
		var recivePeople = $('.tb_fRecivePeople');
		var sProvince = $('.select_province');
		var sCity = $('.select_city');
		var sArea = $('.select_area');
		var addressDetail = $('.tb_fAddresasDetail'),
			postCode = $('.tb_fPostCode'),
			phoneNum = $('.tb_fPhoneNum'),
			telphoneNum = $('.tb_fTelphone');
			
		var $cookieName = $(this).parent('td').parent('tr').attr('cookieName');
		var $isDefault = $.cookies.get($cookieName).IsDefault;
		var $recivePeople =$.cookies.get($cookieName).RecivePeople;
		var $place = $.cookies.get($cookieName).Place;
		var $addressDetail = $.cookies.get($cookieName).AddressDetail;
		var $postCode = $.cookies.get($cookieName).PostCode;
		var $phoneNum = $.cookies.get($cookieName).PhoneNum;
		var $telphoneNum = $.cookies.get($cookieName).TelphoneNum;
		$isDefault?isDefaultAddr.prop('checked',true):
					isNotDefaultAddr.prop('checked',true);
		recivePeople.val($recivePeople);
		var placeArr = $place.split(' ');
		console.log(placeArr);
//		sProvince.append('<option>'+placeArr[0]+'</option>');
//		sCity.append('<option>'+placeArr[1]+'</option>');
//		sArea.append('<option>'+placeArr[2]+'</option>');
		sProvince.val(placeArr[0]);
		sCity.val(placeArr[1]);
		sArea.val(placeArr[2]);
		
		addressDetail.val($addressDetail);
		postCode.val($postCode);
		phoneNum.val($phoneNum);
		telphoneNum.val($telphoneNum);
		
		$('#form1').slideDown('slow');
		$.cookies.set('editAddressName',$cookieName);
		//console.log($.cookies.get('editAddressName'));
		
	});
	$('.deletAddress').click(function(){
		var isTrue = confirm('确认删除此地址？');
		if(isTrue){
			$.cookies.del($(this).parent('td').parent('tr').attr('cookieName'));
			$(this).parents('tr').remove();
		}
	});
}

// 点击 添加收货地址 显示表单
function showForm(){
	$('.btn_addAddress').click(function(){
		$('#form1').slideDown('slow');
	});
}
// 点击提交按钮保存数据
function submitAddressMsg(){
	$('.btn_submit').off('click').click(function(){
		var isSubmitMsgOk = true;
		//验证select
		var oSel_provice = $('.select_province').val();
		var oSel_city = $('.select_city').val();
		var oSel_area = $('.select_area').val();
		
		if(oSel_provice === '请选择' || oSel_city === '请选择' || oSel_area === '请选择' ){
			 $('.select_area').next('.address-error').css({
								'visibility' : 'visible'
						});
			$('#form1 select').css({
				'box-shadow' : '0 0 20px red'
			});
			isSubmitMsgOk = false;
		}else{
			$('.select_area').next('.address-error').css({
								'visibility' : 'hidden'
						});
			$('#form1 select').css({
				'box-shadow' : 'none'
			});
		}
		// 验证文本框是否全填写 并且没报错
		$('#form1 input[type=text]').each(function(i,el){
			if($(el).val() === ''){
				isSubmitMsgOk = false;
			}else{
				if($(el).next('.address-error').css('visibility') === 'visible'){
					isSubmitMsgOk = false;
				}
			}
		});
		
		if(isSubmitMsgOk){
			var trSize = 0;
			if($('.allOfAddress tbody tr')){
				trSize = $('.allOfAddress tbody tr').size();
			}
			
			
			console.log('tr个数：'+trSize);
			if(trSize >= 5){
				alert('收货地址已达到上限，请删除后再添加!');
			}else{
				var isDefaultAddr = $('.isDefault').prop('checked');
				var recivePeople = $('.tb_fRecivePeople').val();
				var place = $('.select_province').val() + ' ' + $('.select_city').val() + ' ' + $('.select_area').val()
				var addressDetail = $('.tb_fAddresasDetail').val(),
					postCode = $('.tb_fPostCode').val(),
					phoneNum = $('.tb_fPhoneNum').val(),
					telphoneNum = $('.tb_fTelphone').val();
				if(isDefaultAddr === true){
					for(var j=0;j<trSize;j++){
						var $recivePeople = $.cookies.get('addressMsg-'+(j+1)).RecivePeople;
						var $place = $.cookies.get('addressMsg-'+(j+1)).Place;
						var $addressDetail = $.cookies.get('addressMsg-'+(j+1)).AddressDetail;
						var $postCode = $.cookies.get('addressMsg-'+(j+1)).PostCode;
						var $phoneNum = $.cookies.get('addressMsg-'+(j+1)).PhoneNum;
						var $telphoneNum = $.cookies.get('addressMsg-'+(j+1)).TelphoneNum;
						
						$.cookies.set('addressMsg-'+(j+1),{
				//			'Id' : 'addressMsg' +  1,
							'IsDefault' : false,
							'RecivePeople' : $recivePeople,
							'Place' : $place,
							'AddressDetail' : $addressDetail,
							'PostCode' : $postCode,
							'PhoneNum' : $phoneNum,
							'TelphoneNum' : $telphoneNum
						});
					}
				}
				var cookieEditAddressName = $.cookies.get('editAddressName');
				if(cookieEditAddressName!==null){
					$.cookies.set(cookieEditAddressName,{
			//			'Id' : 'addressMsg' +  1,
						'IsDefault' : isDefaultAddr,
						'RecivePeople' : recivePeople,
						'Place' : place,
						'AddressDetail' : addressDetail,
						'PostCode' : postCode,
						'PhoneNum' : phoneNum,
						'TelphoneNum' : telphoneNum
					});
					alert('修改地址成功！');
				}else{
					$.cookies.set('addressMsg-'+(trSize+1),{
			//			'Id' : 'addressMsg' +  1,
						'IsDefault' : isDefaultAddr,
						'RecivePeople' : recivePeople,
						'Place' : place,
						'AddressDetail' : addressDetail,
						'PostCode' : postCode,
						'PhoneNum' : phoneNum,
						'TelphoneNum' : telphoneNum
					});
					alert('添加地址成功！');
				}
				
				window.location.reload();
			}
		}else{
			alert('请正确填写上述信息！');
		}
		
			
			
	});

	//点击取消 收回地址表单
	$('.btn_cancel').click(function(){
		$('#form1').slideUp('slow');
		$.cookies.del('editAddressName');
	});

}
// 返回购物车 
function backToShopCar(){
	$('.btn_toShopCar').click(function(){
		window.location.href = 'submitOrder.html';
	});
}
