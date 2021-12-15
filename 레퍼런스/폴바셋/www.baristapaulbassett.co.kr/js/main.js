var setNum = 1; // 휠이벤트를 위한 변수
var sectionMoveState = true;

function mainWheel(isTablet){
	//console.log(isTablet);
	if(!isTablet){
		// 휠이벤트
		$("#wrapper").on("wheel", function(e){
			var wheelDelta = e.originalEvent.deltaY;
			var D_target = $(e.target);
			var targetVisual = D_target.parents("#mainVisualWrap").length > 0 ? true : false;
			var targetSection2 = D_target.parents("#mainSection2").length > 0 ? true : false;
			var wheelDown = wheelDelta > 0 ? true : false;
			if(sectionMoveState){
				sectionMoveState = false;
				if(targetVisual && wheelDown && setNum == 1){
					sectionSet(2);
				}
				else if((targetVisual || targetSection2) && wheelDown && setNum == 2){
					sectionSet(3);
				}
				else if((targetVisual || targetSection2) && !wheelDown && setNum == 2){
					sectionSet(1); 
				}
				else if(targetSection2 && !wheelDown && setNum == 3){
					var bannerLeft = parseInt($("#mainBanner").css("left"));
					if(Math.abs(bannerLeft) <= 50 || $("#mainBanner").hasClass("sortCenter")) {
						sectionSet(2); 
					}
				} else {
					sectionMoveState = true;
				}
				setTimeout(function(){
					sectionMoveState = true;
				},1000)
			}		
		});
	} else {
		mainEventBanner.hover();
	}
}

//휠이벤트 일때 단락별 이벤트
function sectionSet(num){
	if(num == 1){
		setNum = 1;
		$("#mainSection1").removeClass("smallSection");
		wrapSize($('#mainVisualWrap .mainVisualSlide .visualBg'), '1880', '1000', true);
		wrapSize($('#mainVisualWrap .mainVisualSlide .smallThum img'), '1880', '414');
	} else if(num == 2){
		setNum = 2;
		mainEventBanner.destroy();
		$("#mainSection2").removeClass("sectionUp");
		$("#mainSection1").addClass("smallSection");
		visualSlide.auto();
	} else if(num == 3){
		setNum = 3;
		$("#mainSection2").addClass("sectionUp");
		mainEventBanner.event();
		mainEventBanner.hover();
		visualSlide.destroy();
	}
}


var getProposeMenuStat = false;
// 페이지 첫 세팅
function mainPageInit(){
	wrapSizeSet($('#mainVisualWrap .mainVisualSlide .visualBg'), '1880', '1000', true);
	wrapSizeSet($('#mainVisualWrap .mainVisualSlide .smallThum img'), '1880', '414');
	visualSlide.init();
	//notice	
	$('.mainNoticeSlide').slick({
        slidesToShow:1,
        slidesToScroll:1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows:true,
        adaptiveHeight: true,
        infinite: true,
        dots: false,
        vertical:true,
        verticalSwiping:true
    });
	if(!getProposeMenuStat){
		setTimeout(getProposeMenu, 0);
	}
	mainEventBanner.init();
} 
// 메인 비쥬얼
var visualSlide = {
	state : false,
	autoSlide : true, 
	autoSpeed : 5000,
	autoInterval : false,
	D_slideConts : $("#mainVisualWrap .mainVisualSlide .slideCont"),
	D_firstChid : function D_firstChid() {
		return $("#mainVisualWrap .mainVisualSlide .slideCont:first-of-type")
	},
	D_lastChid : function D_firstChid() {
		return $("#mainVisualWrap .mainVisualSlide .slideCont:last-of-type")
	},
	init : function init(){
		var D_slideCont = $("#mainVisualWrap .mainVisualSlide .slideCont");
		var D_firstChild = visualSlide.D_firstChid();
		var totalCnt = D_slideCont.length;
		$("#mainVisualWrap").css("opacity", "1");
		$("#allVisualNum").html("0" + totalCnt);
		if(totalCnt > 1){
			D_slideCont.css("opacity", "0");
			D_firstChild.css("opacity", "1");
			D_firstChild.addClass("active");
			$("#nowVisualNum").html("01");
			$("#mainVisualWrap .slideNum").fadeIn(1000);
			$("#mainVisualWrap .controller").fadeIn(1000);
			setTimeout(function(){
				D_slideCont.css("opacity", "1");
				visualSlide.state = true;
			},2000);
		}
		if(D_firstChild.find("video").length > 0) {
			D_firstChild.find("video")[0].play();
		}
		visualSlide.auto();
		visualSlide.event();
		$(window).on("focusout", function(){
			visualSlide.autoStop()
		})
		$(window).on("focusin", function(){
			visualSlide.auto()
		})
	},
	auto : function auto(){
		//console.log("start")
		if(visualSlide.autoSlide && !visualSlide.autoInterval){
			visualSlide.autoInterval = setInterval(function(){
				visualSlide.move('next');
			}, visualSlide.autoSpeed); 
		}
	},
	autoStop : function auto(){
		//console.log("autostop")
		if(visualSlide.autoSlide){
			clearInterval(visualSlide.autoInterval);
			visualSlide.autoInterval = false;
		}
	},
	btnMove : function btnMove(txt){
		if(visualSlide.state){
			if(visualSlide.autoSlide){
				visualSlide.autoStop();
			}
			visualSlide.move(txt);
			setTimeout(function(){
				if(visualSlide.autoSlide){
					visualSlide.auto();
				}
			},2000); 
		}
	},
	move : function move(txt){
		//console.log("move");
		var D_nowActive = $("#mainVisualWrap .mainVisualSlide .slideCont.active");
		var D_nextActive = D_nowActive.next(".slideCont");
		var D_prevActive = D_nowActive.prev(".slideCont");
		var D_newActive;
		if(D_nextActive.length <= 0){
			D_nextActive = visualSlide.D_firstChid();
		}
		if(D_prevActive.length <= 0){
			D_prevActive = visualSlide.D_lastChid();
		}
		if(txt == "next"){
			D_newActive = D_nextActive;
		} else {
			D_newActive = D_prevActive; 
		}
		if(visualSlide.state){
			visualSlide.state = false;
			D_nowActive.addClass("ended").removeClass("active");
			D_newActive.addClass("active");
			if(D_newActive.find("video").length > 0) {
				D_newActive.find("video")[0].play();
			}
			$("#nowVisualNum").html(D_newActive.attr("data"));
			setTimeout(function(){
				D_nowActive.removeClass("ended");
				if(D_nowActive.find("video").length > 0) {
					D_nowActive.find("video")[0].load();
				}
				visualSlide.state = true;
			},2000);
		}
	},
	event : function event(){
		var D_target = $("#mainVisualWrap");
		D_target.on("mousedown touchstart", function(e) {
	 		var ae ,angle;
	 		ae = e.originalEvent.targetTouches ? e.originalEvent.changedTouches[0] : e.originalEvent;
			startX = ae.pageX;
			startY = ae.pageY;
		  
			$(document).on("mousemove touchmove", function(e) {
				ae = e.originalEvent.targetTouches ? e.originalEvent.changedTouches[0] : e.originalEvent;
		 		endX = ae.pageX;
				endY = ae.pageY;
		 		moveX = endX - startX;
				moveY = endY - startY;
				angle = Math.atan2(moveY, moveX) * 180 / Math.PI;
		 	});
		  
			$(document).on("mouseup touchend", function(e) {
				ae = e.originalEvent.targetTouches ? e.originalEvent.changedTouches[0] : e.originalEvent;
				endX = ae.pageX;
				endY = ae.pageY;
				$(document).off("mousemove touchmove");
				$(document).off("mouseup touchend");
				
				if((Math.abs(angle) < 45) || (Math.abs(angle) > 135)) {
					if(startX < endX){
						visualSlide.btnMove('next');
					} else if (startX > endX) {
						visualSlide.btnMove('prev'); 
					}
				}
			}); 
		});
	},
	destroy : function destroy(){
		var D_slideCont = $("#mainVisualWrap .mainVisualSlide .slideCont");
		//D_slideCont.css("opacity", "0");
		D_slideCont.each(function(){
			//$(this).find("video")[0].load();
			$(this).removeClass("active");
			$(this).removeClass("ended");
		});
		visualSlide.autoStop();
	}
}

function getProposeMenu(){
	$.post('/main/getRecommProductList.pb', function(data){		
		$("#recommProductList").html(data);
		getProposeMenuStat =  true;
		$("#menuBoxWrap").addClass("ready");
		proposeMenu.init();
		//proposeMenuOpen();
	});
}

function proposeMenuOpen(){
	$("#menuBoxWrap").addClass("open");
	$("body").addClass("on");
	visualSlide.autoStop();
}

function proposeMenuClose(){
	$(".menuBoxWrap").removeClass("open");
	$("body").removeClass("on");
	visualSlide.auto();
} 

function wrapSizeSet(obj, w, h, full){
	wrapSize(obj, w, h, full);
	$(window).resize(function(){
		wrapSize(obj, w, h, full);
	});
}
function wrapSize(obj, w, h, full){
	var wrapW = obj.parent().width();
	var wrapH = obj.parent().height();
	if(full){
		wrapW = $(window).width();
		wrapH = $(window).height();
	}
	var content_w = Math.floor(wrapH*w / h);
	var content_h = Math.floor(wrapW*h / w);
	var asdfab = wrapW - content_w;
	if (wrapH > content_h ){
		obj.css({
			"position" : "absolute",
			"height" : wrapH + "px",
			"width" : content_w + "px",
			"top" : "0",
			"left" : (asdfab/2) + "px",
			"margin-top" : "0",
			"margin-left" : "0"
		})
	} else if  (wrapW > content_w ) {
		obj.css({
			"position" : "absolute",
			"height" : content_h + "px", 
			"width" : wrapW + "px",
			"top" : "50%",
			"left" : "0",
			"margin-top" : -(content_h/2) + "px",
			"margin-left" : "0",
		})
	}
}
// 추천메뉴
var proposeMenu = {
	setWidth : false,
	init : function init(){
		proposeMenu.setWidth();
		if(proposeMenu.setWidth){
			proposeMenu.event();
		}
		if(isTablet){
			proposeMenu.touchMove();
		}
	},
	setWidth : function setWidth(){
		var totalWidth = 0;
		$('#recommProductList').find(".menuSlide").each(function(){
			totalWidth = Math.ceil(totalWidth + Math.ceil($(this).width()) + parseInt($(this).css("margin-left")) + parseInt($(this).css("margin-right")));
		});
		$('#recommProductList').css("width", totalWidth);
		proposeMenu.setWidth = true;
	},
	event : function event(){
		var moveNum = 0;
		var nowLeft = 0
		var gab = 150;
		var stat = "first"; 
		$('#recommProductList').on("mousewheel", function(e){
			var wheelNum = e.deltaY;
			var maxMove = parseInt($("#recommProductList").width()) - parseInt($("#menuBoxListWrap").width());
			var stat = "";
			nowLeft = $('#recommProductList').attr("data") ? $('#recommProductList').attr("data") : 0;
			if(maxMove > 0){
				if(wheelNum < 0) {
					moveNum = parseInt(moveNum - gab);
					if(maxMove <= -parseInt(nowLeft)){
						moveNum = -maxMove;
						state = "end";
					}
				} else {
					moveNum = parseInt(moveNum + gab);
					if(moveNum >= 0){
						moveNum = 0;
						stat = "first"
					}
				}
				$('#recommProductList').attr("data", moveNum);
				$(this).css({
					"left" : moveNum + "px"
				});
			}
		});
	},
	touchMove : function touchMove(){
		var moveNum = 0;
		var nowLeft = 0
		var gab = 100;
		var stat = "first"; 
		var maxMove = parseInt($("#recommProductList").width()) - parseInt($("#menuBoxListWrap").width());
		$('#recommProductList').on("mousedown touchstart", function(e) {
	 		var ae ,angle;
			var stat = "";
			nowLeft = $('#recommProductList').attr("data") ? parseInt($('#recommProductList').attr("data")) : 0;
	 		ae = e.originalEvent.targetTouches ? e.originalEvent.changedTouches[0] : e.originalEvent;
			startX = ae.pageX;
			startY = ae.pageY;
		  
			$(document).on("mousemove touchmove", function(e) {
				ae = e.originalEvent.targetTouches ? e.originalEvent.changedTouches[0] : e.originalEvent;
		 		endX = ae.pageX;
				endY = ae.pageY;
		 		moveX = endX - startX;
				moveY = endY - startY;
				angle = Math.atan2(moveY, moveX) * 180 / Math.PI;
				//console.log("startX",startX, "endX",endX);
				//console.log("moveX",moveX);
				//console.log("nowLeft", nowLeft)
				moveNum = parseInt(nowLeft + moveX);
				if(maxMove <= -parseInt(moveNum)){
					moveNum = -maxMove;
					state = "end";
				}
				if(moveNum >= 0){
					moveNum = 0;
					stat = "first"
				}
				
				$('#recommProductList').attr("data", moveNum);
				$('#recommProductList').css({
					"left" : moveNum + "px"
				});
		 	});
		  
			$(document).on("mouseup touchend", function(e) {
				ae = e.originalEvent.targetTouches ? e.originalEvent.changedTouches[0] : e.originalEvent;
				endX = ae.pageX;
				endY = ae.pageY;
				$(document).off("mousemove touchmove");
				$(document).off("mouseup touchend");
				
			}); 
		});
	}
}


//이벤트 배너
var mainEventBanner = {
	setWidth : false,
	init : function init(){
		$(".mainBanner .bannerSlide").addClass("on");
		mainEventBanner.setWidth();
		if(mainEventBanner.setWidth){
			mainEventBanner.hover();
			mainEventBanner.wrapSort();
			if(isTablet){
				mainEventBanner.touchMove();
			}
		} 
		
		$(window).resize(function(){
			var totalWidth = 0;
			$('#mainBanner').find(".bannerSlide").each(function(){
				totalWidth = Math.ceil(totalWidth + Math.ceil($(this).width()) + parseInt($(this).css("margin-left")) + parseInt($(this).css("margin-right")));
			});
			$('#mainBanner').css("width", totalWidth);
			var nowLeft = parseInt($("#mainBanner").css("left"));
			if(nowLeft < 0){
				$('#mainBanner').css("left", "50px");
			}
			var maxMove = totalWidth - parseInt($(window).width());
			if(Math.abs(maxMove) < Math.abs(nowLeft)){
				$('#mainBanner').css("left", -maxMove +"px");
			}
			mainEventBanner.wrapSort();
		});
	},
	setWidth : function setWidth(){
		var totalWidth = 0;
		$("#mainBanner").imagesLoaded( function() { 
			$('#mainBanner').find(".bannerSlide").each(function(){
				totalWidth = Math.ceil(totalWidth + Math.ceil($(this).width()) + parseInt($(this).css("margin-left")) + parseInt($(this).css("margin-right")));
			});
			$('#mainBanner').css("width", totalWidth);
			mainEventBanner.setWidth = true;
		}); 
	},
	event : function event(){
		var moveNum = 0;
		var nowLeft = 50;
		var gab = 150;
		var stat = "first";
		$('#mainBanner').on("mousewheel", function(e){
			var wheelNum = e.deltaY;
			var maxMove = parseInt($("#mainBanner").width()) - parseInt($(window).width());
			var stat = "";
			nowLeft = $('#mainBanner').attr("data") ? $('#mainBanner').attr("data") : 50;
			if(maxMove > 0){
				if(wheelNum < 0) {
					moveNum = parseInt(moveNum - gab);
					if(maxMove <= -parseInt(nowLeft)){
						moveNum = -maxMove;
						state = "end";
					}
				} else {
					moveNum = parseInt(moveNum + gab);
					if(moveNum >= 50){
						moveNum = 50;
						stat = "first"
					}
				}
				$('#mainBanner').attr("data", moveNum);
				$(this).css({
					"left" : moveNum + "px"
				});
				if(parseInt($(this).css("left")) == 0 && stat == "first") {
					//console.log("휠 이벤트 위로");
				}
			}
		});
	}, 
	touchMove : function touchMove(){
		var moveNum = 0;
		var nowLeft = 0
		var gab = 100;
		var stat = "first"; 
		$('#mainBanner').on("mousedown touchstart", function(e) {
	 		var ae ,angle;
			var stat = "";
			var maxMove = parseInt($("#mainBanner").width()) - parseInt($("#mainBannerWrap").width());
			nowLeft = $('#mainBanner').attr("data") ? parseInt($('#mainBanner').attr("data")) : 0;
	 		ae = e.originalEvent.targetTouches ? e.originalEvent.changedTouches[0] : e.originalEvent;
			startX = ae.pageX;
			startY = ae.pageY;
			$(document).on("mousemove touchmove", function(e) {
				ae = e.originalEvent.targetTouches ? e.originalEvent.changedTouches[0] : e.originalEvent;
		 		endX = ae.pageX;
				endY = ae.pageY;
		 		moveX = endX - startX;
				moveY = endY - startY;
				angle = Math.atan2(moveY, moveX) * 180 / Math.PI;
				moveNum = parseInt(nowLeft + moveX);
				if(maxMove <= -parseInt(moveNum)){
					moveNum = -maxMove;
					state = "end";
				}
				if(moveNum >= 0){
					moveNum = 0;
					stat = "first"
				}
				$('#mainBanner').attr("data", moveNum);
				$('#mainBanner').css({
					"left" : moveNum + "px"
				});
		 	});
		  
			$(document).on("mouseup touchend", function(e) {
				ae = e.originalEvent.targetTouches ? e.originalEvent.changedTouches[0] : e.originalEvent;
				endX = ae.pageX;
				endY = ae.pageY;
				$(document).off("mousemove touchmove");
				$(document).off("mouseup touchend");
				
			}); 
		});
	},
	hover : function hover(){
		$(".mainBanner .bannerSlide").removeClass("on")
		$(".mainBanner .bannerSlide")
		.on("mouseenter focusin", function(){
			$(this).addClass("on");
		})
		.on("mouseleave focusout", function(){
			$(this).removeClass("on");
		});
	},
	destroy : function destroy(){
		$('#mainBanner').off("mousewheel");
		$('#mainBanner').attr("data", "50"); 
		//$(".mainBanner .bannerSlide").addClass("on");
		$(".mainBanner .bannerSlide").off("mouseenter focusin mouseleave focusout")
		mainEventBanner.wrapSort();
	},
	wrapSort : function wrapSort(){
		var maxMove = parseInt($("#mainBanner").width()) - parseInt($(window).width());
		if(maxMove < 0){
			$("#mainBanner").css({
				"left" : "50%",
				"transform" : "translate(-50%, -50%)" 
			});
			$("#mainBanner").addClass("sortCenter")
		} else {
			$(".mainBanner").css({
				"left" : "50px",
				"transform" : "translate(0, -50%)" 
			});
			$("#mainBanner").removeClass("sortCenter")
		}
	} 
}

function bannerClose(){
	$('.eStampBtn').hide();
}