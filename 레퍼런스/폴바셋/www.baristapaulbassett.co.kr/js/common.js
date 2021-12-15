$(function(){
	if($("#gnb").length > 0){
		gnb.initGnb();
		gnb.overEvent();
	}
	
	if ($.datepicker != null) {
		jQuery(function($){
			$.datepicker.regional['ko'] = {
				closeText: "닫기",
				prevText: "이전달",
				nextText: "다음달",
				currentText: "오늘",
				monthNames: [ "1월","2월","3월","4월","5월","6월",
				"7월","8월","9월","10월","11월","12월" ],
				monthNamesShort: [ "1월","2월","3월","4월","5월","6월",
				"7월","8월","9월","10월","11월","12월" ],
				dayNames: [ "일요일","월요일","화요일","수요일","목요일","금요일","토요일" ],
				dayNamesShort: [ "일","월","화","수","목","금","토" ],
				dayNamesMin: [ "일","월","화","수","목","금","토" ],
				weekHeader: "주",
				dateFormat: 'yy.mm.dd',
				firstDay: 0,
//				changeMonth: true,
//			    changeYear: true,
				isRTL: false,
				showMonthAfterYear: true,
				yearSuffix: '년 '};
			
			$.datepicker.setDefaults($.datepicker.regional['ko']);			
		});			
	}	
})
var gnb = {
		
		initGnb : function initGnb(){
			var $depth1_on = $("#gnb > ul > li.on");
			var gnbDefault_pos = $("#gnb > ul > li:first-child > a").position().left +35;
			var gnbSize = $("#gnb > ul").width();
			if(gnbSize<1000){
				var gnbDefault_pos = $("#gnb > ul > li:first-child > a").position().left +23;
			}
			$("#gnbOverBar").css({
				"left" : gnbDefault_pos + "px"  
			});
			//$("#gnb > ul > li > ul").hide();
			$("#gnbOverBar").fadeIn(function(){
				if($depth1_on.length > 0) {
					var depth1_w = $depth1_on.find("> a").width(); 
					var depth1_pos = $depth1_on.find("> a").position().left +35;
					var gnbSize = $("#gnb > ul").width();
					if(gnbSize<1000){
						var depth1_pos = $depth1_on.find("> a").position().left +23;
					}
					$("#gnbOverBar").css({ 
						"width" : depth1_w + "px",
						"left" : depth1_pos + "px"
					});
					$(window).resize(function(){
						depth1_w = $depth1_on.find("> a").width(); 
						depth1_pos = $depth1_on.find("> a").position().left +35;
						var gnbSize = $("#gnb > ul").width();
						if(gnbSize<1000){
							depth1_pos = $depth1_on.find("> a").position().left +23;
						}
						$("#gnbOverBar").css({ 
							"width" : depth1_w + "px",
							"left" : depth1_pos + "px"
						}); 
					});
				} else {
					$("#gnbOverBar").removeAttr("style");
					$("#gnbOverBar").css({
						"left" : gnbDefault_pos + "px"  
					});
					$("#gnbOverBar").show();
				}
			}); 
		}, 
		overEvent : function overEvent(){
			var $depth1 = $("#gnb > ul > li > a");
			$depth1.on("mouseenter", function(){
				if($("body").hasClass("main")){
					$("#header").addClass("on");
				}
				var depth1_w = $(this).width(); 
				var depth1_pos = $(this).position().left +35;
				var gnbSize = $("#gnb > ul").width();
				if(gnbSize<1000){
					var depth1_pos = $(this).position().left +23;
				}
				$("#gnbOverBar").css({
					"width" : depth1_w + "px",
					"left" : depth1_pos + "px"
				});
				//$("#gnb > ul > li > ul").stop().removeAttr("style");
				//$(this).siblings("ul").fadeIn(500);
			});
			
			$("#gnb").on("mouseleave", function(){
				if($("body").hasClass("main") && $(window).scrollTop() <= 0){
					$("#header").removeClass("on");
				} 
				gnb.initGnb();
			}) 
		} 
}

$(function() {
	$("#gnb>ul>li.subDeth>ul").bind("mouseenter focusin", function(){
		$(this).css("display", "block");
			return false;
		})
	
});

/**
 * NVL 함수플러그인 생성
 */
(function($) {	
	$.nvl = function (str, sDefault) {
		if (str == null || str == undefined || str.trim() == ""  || str == "undefined" || typeof str === "undefined") {
			if ( typeof sDefault === "undefined" ){
				sDefault = "";
			}
			return sDefault;
		}
		else {
			return str;
		}		
	};
}(jQuery));


function onlyNumber(event){
	event = event || window.event;
	var keyID = (event.which) ? event.which : event.keyCode;
	if ( (keyID >= 48 && keyID <= 57) || (keyID >= 96 && keyID <= 105) || keyID == 8 || keyID == 46 || keyID == 37 || keyID == 39 ) 
		return;
	else
		return false;
}

function removeChar(event){
	event = event || window.event;
	var keyID = (event.which) ? event.which : event.keyCode;
	if ( keyID == 8 || keyID == 46 || keyID == 37 || keyID == 39 ) 
		return;
	else
		event.target.value = event.target.value.replace(/[^0-9]/g, "");
}

String.prototype.isNumeric = function() {
    var format = /^[0-9]+$/;
    return (this.search(format) > -1);
};


//숫자를 money포맷으로 3자리씩 끊어 표현한다.
String.prototype.formatMoney = function() {
	if (!this.isNumeric()) return null;

	var start = 0;
	var distance =  parseInt(this.length % 3);
	var nComma =  parseInt(this.length / 3);

	if (distance == 0){
		distance = 3;
		nComma -= 1;
	}

	var arr = new Array();
	for (var i=0; i<nComma + 1; i++) {
		arr[i] = this.substring(start, start + distance);	

		start += distance;
		distance = 3;
	}

	var sReturn = "";
	var isFirst = true;
	for (var i=0; i<arr.length; i++) {
		sReturn += (isFirst ? "" : ",") + arr[i];
		isFirst = false;
	}

	return sReturn;
};

//숫자를 money포맷으로 3자리씩 끊어 표현한다.
Number.prototype.formatMoney = function() {
	return this.toString().formatMoney();
};

$.postJSON = function(url, data, type, func) { 
	$.post(url+(url.indexOf("?") == -1 ? "?" : "&")+"callback=?", data, func, type); 
};  

function appCallIos(func) {
	var data = '';
	var message = {
            'scheme': func,
            'query': data
        };
 	window.webkit.messageHandlers.pbs.postMessage(message); 
}

Date.prototype.yyyymmdd = function() {
	  var mm = this.getMonth() + 1; // getMonth() is zero-based
	  var dd = this.getDate();

	  return [this.getFullYear(),
	          (mm>9 ? '' : '0') + mm,
	          (dd>9 ? '' : '0') + dd
	         ].join('.');
	};
	
function getSpecificDate(dateType, duration, separator){
	var currDate = new Date();
	var today	 = new Date();
	if ( dateType =="M"){
		currDate.setMonth(today.getMonth() + duration);
	} else if ( dateType =="W"){
		currDate.setDate(today.getDate() + (7 *duration));
	} else if ( dateType =="D"){
		currDate.setDate(today.getDate() + duration);
	} else if ( dateType =="Y"){
		currDate.setYear(today.getFullYear() + duration);
	}
	
	var mm = currDate.getMonth() + 1; // getMonth() is zero-based
	var dd = currDate.getDate();

	return [currDate.getFullYear(),
				(mm>9 ? '' : '0') + mm,
				(dd>9 ? '' : '0') + dd
			].join(separator);		
}