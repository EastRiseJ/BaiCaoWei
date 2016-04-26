var utility = {
	Event: {
		addHandler: function(el, type, handler) {
			if (el.addEventListener !== undefined) {
				el.addEventListener(type, handler, false)
			} else if (el.attachEvent) {
				el.attachEvent('on' + type, handler);
			} else {
				el['on' + type] = handler;
			}
		},
		removeHandler: function(el, type, handler) {
			if (el.removeEventListener !== undefined) {
				el.removeEventListener(type, handler);
			} else if (el.detachEvent) {
				el.detachEvent(type, handler);
			} else {
				el['on' + type] = null;
			}
		},
		getEvent: function(event) {
			return (event !== undefined) ? event : window.event;
		},
		getTarget: function(event) {
			return event.target !== undefined ? event.target : event.srcElement;
		},
		preventDefault: function(event) {
			if (event.preventDefault !== undefined) {
				event.preventDefault();
			} else {
				event.returnVaule = false;
			}
		},
		stopPropagation: function(event) {
			if (event.stopPropagation !== undefined) {
				event.stopPropagation();
			} else {
				event.cancelBubble = true;
			}
		}
	},
	Cookie: {
		setCookie: function(name, value, days) {
			if (days !== undefined) {
				var oDate = new Date();
				oDate.setDate(oDate.getDate() + days);
				document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value) + ';expires=' + oDate;
			} else {
				document.cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
			}

		},
		getCookie: function(name) {
			var cookieArray = decodeURIComponent(document.cookie).split('; ');
			var cookieOfArray = [];
			for (var i = 0; i < cookieArray.length; i++) {
				cookieOfArray = cookieArray[i].split('=');
				if (cookieOfArray[0] === name) {
					return cookieOfArray[1];
				}
			}
			return '';
		},
		removeCookie: function(name) {
			this.setCookie(name, '', -1);
		}
	},
	Ajax: {
		send: function(method, url, asyn, successfn, errorfn) {
			var xhr = null;
			if (window.ActiveXObject) { //如果是IE
				xhr = new ActiveXObject("Microsoft.XMLHTTP");
			} else if (window.XMLHttpRequest) {
				xhr = new XMLHttpRequest(); //实例化一个xmlHttpReg
			}
			var ajaxResponseOK = (location.protocol === 'file:') ? 0 : 200;
			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) {
					if (xhr.status === ajaxResponseOK) {
						if (typeof successfn === 'function') {
							successfn(xhr.responseText);
						}
					} else {
						if (typeof errorfn === 'function') {
							errorfn(xhr.status);
						}
					}
				}
			}
			xhr.open(method, url, asyn);
			xhr.send();
		}
	},
	Movement: {
		getStyle: function(obj, att) {
			if (obj.currentStyle) {
				return obj.currentStyle[att];
			} else {
				return getComputedStyle(obj, false)[att];
			}
		},
		startMove: function(obj, json, fn) {
			clearInterval(obj.timer);
			var self = this;
			obj.timer = setInterval(function() {
				var isOver = true;
				for (var att in json) {
					var iCur = 0;
					if (att === 'opacity') {
						iCur =parseInt(parseFloat(self.getStyle(obj, att)) * 100);
					} else {
						iCur = parseInt(self.getStyle(obj, att));
					}
					var iSpeed = (json[att] - iCur) / 8;
					iSpeed = (iSpeed > 0) ? Math.ceil(iSpeed) : Math.floor(iSpeed);
					if (iCur !== json[att]) {
						isOver = false;
					}

					if (att === 'opacity') {
						obj.style.filter = 'alpha(opacity:' + (iCur + iSpeed) + ')'
						obj.style[att] = (iCur + iSpeed) / 100;
						//				document.getElementById('txt1').value=getStyle(obj,att);
					} else {
						obj.style[att] = iCur + iSpeed + 'px';
					}

				}
				if (isOver) {
					clearInterval(obj.timer);
					if (fn) {
						fn();
					}
				}
			}, 30);
		}
	}
}