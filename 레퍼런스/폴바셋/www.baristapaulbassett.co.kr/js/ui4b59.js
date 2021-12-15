//휠이벤트
$.fn.scrollEvent = function(opt){
    var defaultOpt = {
        id : null,
        func : null,
        preventDefault : true
    };
    $.extend(defaultOpt, opt);
    
    var elem = document.getElementById(defaultOpt.id);
   /* if (elem.addEventListener) {    // all browsers except IE before version 9
        // Internet Explorer, Opera, Google Chrome and Safari
        elem.addEventListener ("mousewheel", MouseWheelHandler, false);
        // Firefox
        elem.addEventListener ("DOMMouseScroll", MouseWheelHandler, false);
    }else{
        if (elem.attachEvent) { // IE before version 9
            elem.attachEvent ("onmousewheel", MouseWheelHandler);
        }
    }   */
    
    function MouseWheelHandler() {
        var nDelta = 0;
        if (!event) { event = window.event; }
        // cross-bowser handling of eventdata to boil-down delta (+1 or -1)
        if ( event.wheelDelta ) { // IE and Opera
            nDelta= event.wheelDelta;
            if ( window.opera ) {  // Opera has the values reversed
                nDelta= -nDelta;
            }
        }
        else if (event.detail) { // Mozilla FireFox
            nDelta= -event.detail;
        }
        if (nDelta > 0) {
        	defaultOpt.func('up');
        }
        if (nDelta < 0) {
        	defaultOpt.func('down');
        }
        if(defaultOpt.preventDefault){
        	if ( event.preventDefault ) {  // Mozilla FireFox
        		event.preventDefault();
        	}
        	event.returnValue = false;  // cancel default action
        }
   }
}

function loadingAdd(obj) {
	if(obj == "full"){
		$("body").prepend("<div id=\"loadingArea\" class=\"fullLoad\" style=\"z-index:100010\"><img src=\"/images/common/loading.gif\" alt=\"loading...\"></div>");
	} else {
		if($(obj).css("position") != "relative" && $(obj).css("position") != "absolute"){
			$(obj).css("position", "relative");
		}
		$(obj).prepend("<div id=\"loadingArea\"><img src=\"/images/common/loading.gif\" alt=\"loading...\"></div>");
	}
} 


function loadingRemove(obj) {	
	if(obj != undefined) {
		$(obj).find("#loadingArea").remove();
	} else {		
		$("#loadingArea").remove();
	}
}



var Layer = {
	open : function open(src, height, width, btnClose) {
		if($("#blockArea").length > 0){
			$("#blockArea").remove();
		}
		
		var marginTop = ($(window).height() > height) ? - (height / 2) : 0 ;	
		var marginLeft = - (width / 2);
		
		$("#wrapper").append('<div id="blockArea"><div id="frameArea" style="width:'+ width +'px; height:'+ height +'px; margin-left:'+ marginLeft +'px; margin-top:'+ marginTop +'px;"></div></div>');
		var temp = '<iframe src="' + src + '" width="100%" height="100%" frameborder="0" allowTransparency="true" name="iframetPopLayer1" id="iframetPopLayer1" scrolling="no"></iframe>';
						//+ '<a href="#" class="btnLayerClose" onclick="Layer.close(); return false;"><img src="/images/btn/btn_close3.png" alt="닫기" width="30" class="imgVm"></a>';
		wrapFix('on');
		$("#frameArea").html(temp);
		if(btnClose){
			$("#frameArea").append('<a href="#" onclick="top.Layer.close(); return false;" class="btnLayerClose closeTypeB">닫기</a>');
		}
		
		/*if(height != null && height != undefined && height != "") {
			top.$("#frameArea").height(height);
			top.$("#frameArea").css("opacity", "1");
		}
		if(width != null && width!= undefined && width != "") {
			top.$("#frameArea").width(width); 
			top.$("#frameArea").css("opacity", "1");
		}*/
	},
	close : function close() {
		top.$("#blockArea").remove();
		wrapFix('off');
	} 
};

function wrapFix(txt){ 
	//console.log("wrapFix : " + txt);
	if(txt == "on"){
		$("body").css({
			"overflow" : "hidden"
		});
	} else if(txt == "off"){
		$("body").css({
			"overflow" : "visible"     
		});
	}
}

//오늘 하루 레이어팝업
function setCookie( name, value, expiredays ) {
	var todayDate = new Date();
	todayDate.setDate( todayDate.getDate() + expiredays );
	document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + todayDate.toGMTString() + ";"
}
function getCookie(name){
	var nameOfCookie = name + "=";
	var x = 0;
	while (x <= document.cookie.length){
		var y = (x+nameOfCookie.length);
		if (document.cookie.substring(x, y) == nameOfCookie) {
			if ((endOfCookie=document.cookie.indexOf( ";", y )) == -1) endOfCookie = document.cookie.length;
			return unescape(document.cookie.substring(y, endOfCookie ));
		}
		x = document.cookie.indexOf(" ", x) + 1;
		if (x == 0) break;
	}
	return "";
}

function showTab(obj, siblings){
	var target = $(obj).attr("href");
	$("." + siblings).hide();
	$(target).show();
	$(obj).parents("li").addClass("on").siblings().removeClass("on");
}