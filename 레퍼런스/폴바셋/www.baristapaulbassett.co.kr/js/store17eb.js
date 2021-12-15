/**
*	Store Map API
*	by cspark
*/

var surDistance 	= "10";		//zoomlevel distance default
var map;	//GOOGLE MAP ELEMENT
var marker;	//MARKER EL
var markers = [];			//	MARKER ARRAY 	
var infoWindow;	 	//map window
var StoreDataList;	//store json type list
var searchType	=	"storeName";	

/**
 * 초기 설정값 상수.
 */
var MAP_CONSTANTS	=	{
	POSI_LATI	:	"",	//내 위치 - 위도
	POSI_LONGI	:	"",	//내 위치 - 경도
	ZOOM_LEVEL	: 	"1.2",
	SERVICE_TITLE : ""
};

/**
 * 지역별 구/군 리스트를 가져온다
 * @param areaCode : 지역코드	
 * @returns 구/군 리스트 ( json )
 */
function getCityList(areaCd){
	if ( areaCd == ""){ 
		alert("지역을 선택해주세요.");
		return;
	}
	
	$("#areaCd").val(areaCd);
	
	$.getJSON("/store/getCityList.pb?areaCd=" + areaCd, function(result) {
		var cityListHtml	=	"";
		cityListHtml += "<li><a href=\"#\" onclick=\"setCity();return false;\">전체</a></li>";
		
		$.each(result, function (key, entry) {			
			if (Number(entry.shopCnt) > 0 ){
				cityListHtml += "<li><a href=\"#\" onclick=\"setCity('"+entry.cityCd+"');return false;\">"+entry.cityName+"</a></li>";				
			} else {
				cityListHtml += "<li class='deactivate'>"+entry.cityName+"</li>";
			}			
		});										

		$("#countyList").empty().append(cityListHtml);
		$("#areaListLayer").hide();
		$("#cityListLayer").show();	
	
	});				
}

function setCity(cityCd){
	$("#cityCd").val(cityCd);
	getStoreList();
}

/**
 * 신규 매장 정보 가져온다.
 * @returns html
 */
function getNewStoreList(){
	var params = {
		
	}
	$.post('/store/getNewStoreList.pb', params, function(data){
		$("#newStoreLayer").html(data);
		//NEW STORE
		$(".newStoreList div.slide").bind("mouseenter focusin", function(){
			$(this).addClass("on");
			return false;
		})
		.bind("mouseleave focusout" , function(){
			$(this).removeClass("on");
			return false;
		});

		//coming soon
		$('.listWrap .comingSoon').slick({
			dots: true,
			autoplay: true,
			autoplaySpeed: 2000,
			slidesToShow: 1,
			slidesToScroll: 1
		});		
		
		var newStoreSize = $(".newStoreList .slide").length;

		if(newStoreSize >= 3){
			$('.listWrap .newStoreList').slick({
				dots: false,
				autoplay: false,
				infinite: false,
				slidesToShow: 3,
				slidesToScroll: 1,
				vertical:true,
				verticalSwiping:true
			});	
		}	
	});
}

function initSearch(){
	$("#areaCd").val("");
	$("#cityCd").val("");
	$("#shopName").val("");
	$(":checkbox[name=serviceList]").each(function(){
		$(this).prop("checked", false);					
	});	
	$("#listSort").val("D");
//	$("#initBtn").hide();
	getStoreList();	
}

/**
 * 매장 리스트를 가져온다.
 * @returns json
 */
function getStoreList(){
	loadingAdd("#searchLayer");
	
	if (MAP_CONSTANTS.POSI_LATI == "" || MAP_CONSTANTS.POSI_LONGI == ""){
		getLocation(getStoreList);
		return;
	}
	MAP_CONSTANTS.ZOOM_LEVEL = map.getZoom();
	if (MAP_CONSTANTS.ZOOM_LEVEL > 8) {
		surDistance = "1.2";
	}

	var	params	=	$("#searchFrm").serialize();
	
	$.post('/store/getStoreList.pb', params, function(data){
		StoreDataList = JSON.parse(data || '[]');
		
		var storeListHTML = "";
		var isNew	=	false;
		
		if (StoreDataList.length > 0) {
			for (var i = 0, item; item = StoreDataList[i]; i++) {
				isNew	=	false;
				var driveThru	=	"N";
				if ( item.openReadyYn == "Y" && item.isNewYn == "Y"){
					isNew	=	true;
				}				
				
				var driveThru = $.nvl(item.serviceCd).indexOf("13") >= 0;					

				storeListHTML += "<li id=\"shopSeq_"+item.shopSeq+"\" data=\""+ i +"\">";
				storeListHTML += "	<input type=\"hidden\" id=\"driveThru_"+ i +"\" value=\""+driveThru+"\" >";
				storeListHTML += "	<a href=\"#\" onclick=\"$.popMarker('"+i+"');return false;\"><strong>" + $.nvl(item.shopName);			
				if ( isNew ){
					storeListHTML += "		<span class=\"new\">NEW</span>";	
				}			
				storeListHTML += "	</strong></a>";					
				storeListHTML += "	<address>" +$.nvl(item.address) + "</address>";
				storeListHTML += "	<dl>";
				storeListHTML += "		<dt>tel</dt>";
				storeListHTML += "		<dd>" +$.nvl(item.tel) +"</dd>";
//				storeListHTML += "		<dd><a href=\"tel:"+$.nvl(item.tel) +"\">" +$.nvl(item.tel) +"</a></dd>";
				storeListHTML += "	</dl>";
				storeListHTML += "</li>	";
				
				if ( i == 0 ){
					$.moveToCenter ( $.nvl(item.locLati), $.nvl(item.locLongi) );
				}
			}	
		} else {
			storeListHTML += "<li class=\"none\">검색 결과가 없습니다.</li>";
		}
	
		if ( searchType == "storeName"){
			$("#resultListDiv").removeClass("storeName").addClass("storeName");	
		} else {
			$(".storeCont1").hide();
			$("#resultListDiv").removeClass("storeName");
		}
		
		$("#totalCnt").html(StoreDataList.length);
		$("#shopList").html(storeListHTML);
		$("#resultListDiv").show();		
		$("#resultListDiv li:not(.none)")
			.mouseover(function(){
				var eleIdx	=	$(this).attr("data");
				$.activeMakerImage(eleIdx);
				
			}).mouseout(function(){				
				var eleIdx	=	$(this).attr("data");
				if ( eleIdx != activeMarkerIdx){
					$.inActiveMakerImage(eleIdx);	
				}				
			});
		
		loadingRemove();
		$.clearMarkers();
		addMarker();
		if ( $("#areaCd").val() != "" 
			|| $("#cityCd").val() != "" 
			|| $("#shopName").val() != "" 
			|| $(":checkbox[name=serviceList]:checked").length > 0){
			$("#initBtn").show();
		}
	});
}

/**
 * init geolocation
 */
function getLocation ( callbackFnc ) {
	if (navigator.geolocation) { // support geolocation
		navigator.geolocation.getCurrentPosition(function(position) {
			MAP_CONSTANTS.POSI_LATI 	= position.coords.latitude;
			MAP_CONSTANTS.POSI_LONGI 	= position.coords.longitude;
			
			$("#myLocLati").val(MAP_CONSTANTS.POSI_LATI);		//my position
			$("#myLocLongi").val(MAP_CONSTANTS.POSI_LONGI);	//my position
			
			if ( typeof callbackFnc  === 'function'){
				callbackFnc();
			}
	    }, function(error) {	    	
	    //	alert("위치정보를 찾을수 없습니다.["+ error.code+"]");
	    	MAP_CONSTANTS.POSI_LATI  	=	"37.5668";
	    	MAP_CONSTANTS.POSI_LONGI	=	"126.9786";
	    	
			$("#myLocLati").val(MAP_CONSTANTS.POSI_LATI);		//my position
			$("#myLocLongi").val(MAP_CONSTANTS.POSI_LONGI);	//my position

			if ( typeof callbackFnc  === 'function'){
				callbackFnc();
			}
	    }, {	//option
	      enableHighAccuracy: false,
	      maximumAge: 0,
	      timeout: Infinity
	    });
	} else {
    	alert("위치정보를 지원하지 않는 브라우져입니다.");
    	MAP_CONSTANTS.POSI_LATI  	=	"37.5668";
    	MAP_CONSTANTS.POSI_LONGI	=	"126.9786";

    	$("#myLocLati").val(MAP_CONSTANTS.POSI_LATI);		//my position
		$("#myLocLongi").val(MAP_CONSTANTS.POSI_LONGI);	//my position
    	
		if ( typeof callbackFnc  === 'function'){
			callbackFnc();
		}
	}		
}

$.extend({
	scrollMove : function (shopSeq) {
		var D_center = $("#shopSeq_" + shopSeq);
		if(!D_center.hasClass("focus")){
			$('#shopList li.focus').removeClass("focus");
			D_center.addClass("focus");
			var D_centerPos = D_center.position();
			var scrollTop = parseInt($("#shopList").scrollTop());
			var D_centerOff = D_center.offset();
			$('#shopList').animate({scrollTop : parseInt(D_centerPos.top - 57) + scrollTop}, 400);
		}
	},
	clearMarkers : function () {
		if (typeof marker !== "undefined") {
			for (var i = 0; i < markers.length; i++) {
		          markers[i].setMap(null);
		    }
			markers = [];
		}
	},
	moveToCenter : function(lat, lng) {
		if ( lat > 0 && lng > 0) {
			var position = new google.maps.LatLng(lat, lng);
		    map.setCenter(position);			
		}
	},
	infoWindowClose : function ( ){
		if (typeof markers[activeMarkerIdx] !== "undefined") {
			this.inActiveMakerImage(activeMarkerIdx);
			infoWindow.close();
			activeMarkerIdx	=	"";
		}
	},
	activeMakerImage : function (markIdx){
		var isDriveThru = $("#driveThru_"+markIdx).val();
		if (isDriveThru =="true"){
			markers[markIdx].setIcon("/images/store/mapIcon02_dt.png");
		} else {
			markers[markIdx].setIcon("/images/store/mapIcon02.png");	
		}		
	},
	inActiveMakerImage : function (markIdx){
		var isDriveThru = $("#driveThru_"+markIdx).val();
		
		if (isDriveThru =="true"){
			markers[markIdx].setIcon("/images/store/mapIcon01_dt.png");
		} else {
			markers[markIdx].setIcon("/images/store/mapIcon01.png");	
		}
	},
	popMarker : function ( markersIdx ){
		this.infoWindowClose();
		new google.maps.event.trigger( markers[markersIdx], 'click' );
	}
}); 

/**
 * GOOGLE INIT MAP
 */
var initMap = function () {			
	if (MAP_CONSTANTS.POSI_LATI == "" || MAP_CONSTANTS.POSI_LONGI == ""){
		getLocation(initMap);
		return;
	}			
    var mapLocation = new google.maps.LatLng(MAP_CONSTANTS.POSI_LATI, MAP_CONSTANTS.POSI_LONGI); // center position		    
    var zoomCtrl = 17;
    
    var geocoder = new google.maps.Geocoder();
    
    var mapOptions = {
	      center: mapLocation, 
	      zoom: zoomCtrl, 		
	      //gestureHandling: 'greedy',
	      mapTypeControl : false,
	      //zoomControl:true,
	      //streetViewControl:true,
	      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("mapLayer"), mapOptions);
    
    if ($("#myLocLati").val() != "0") {
	    var homeControlDiv = document.createElement('div');
	    var homeControl = new setLocationBtn(homeControlDiv, map);
	    map.controls[google.maps.ControlPosition.TOP_LEFT].push(homeControlDiv);
    }
    
    google.maps.event.addListener(map, 'click', function() {
    //선택된 marker 비활성.
    	$.infoWindowClose();
    });    
    
    //현재 내 위치.	--
    var myLocation = new google.maps.Circle({
	    center: mapLocation,
	    radius: 100,
	    strokeColor: "#66FF66",
	    strokeOpacity: 0.8,
	    strokeWeight: 2,
	    fillColor: "#66FF66",
	    fillOpacity: 0.4
	});
    myLocation.setMap(map);		    	
    //list
    getStoreList();       
}



// marker
var activeMarkerIdx;
var addMarker = function (){
    var i, item;
    var shopInfo;
	var shopSeq;
	var infoWindowContents;
	
    for (i = 0, item; item=StoreDataList[i]; i++) {    
		infoWindow	= new google.maps.InfoWindow();
		
		
		marker = new google.maps.Marker({
			  position: new google.maps.LatLng(item.locLati, item.locLongi),
			  icon: '/images/store/mapIcon01.png', 
			  title : item.shopName,
			  //animation: google.maps.Animation.DROP,
			  map: map
		});			
			
		var driveThru = $.nvl(item.serviceCd).indexOf("13") >= 0;	
		
		if (driveThru){
			marker.setIcon("/images/store/mapIcon01_dt.png");
		}
		
		markers.push(marker); //
		
		google.maps.event.addListener(marker, 'click', (function(marker, i) {
			return function() {
				if ( i === activeMarkerIdx ) { return false;}
				//active marker -> inactive
				$.infoWindowClose();
				
				activeMarkerIdx	=	i;
				shopInfo	=	StoreDataList[i];				
		    	
				var	serviceList		=	$.nvl(shopInfo.serviceCd).split(",").sort();
				var serviceTitle	=	"";
				var isDriveThruShop	=	false;
				
				infoWindowContents	=	"";
				infoWindowContents	+=	"<div class=\"locationLayer\">";
				infoWindowContents	+=	"	<a href=\"/store/StoreView.pb?shopSeq="+shopInfo.shopSeq+"\" class=\"tit\">"+$.nvl(shopInfo.shopName)+"</a>";
				infoWindowContents	+=	"	<div class=\"txtCont\">";				
				for (var j = 0, serviceCd ; serviceCd = serviceList[j]; j++ ){
					if ( serviceCd != ""){
						serviceTitle		=	$("#storeOption li.option"+serviceCd ).prop("title");
						infoWindowContents	+=	"		<span class=\"icon"+ serviceCd +" icon\" title=\""+serviceTitle+"\"></span>";
						
						if ( serviceCd == "13"){
							isDriveThruShop = true;
						}
					}
				}					
				infoWindowContents	+=	"		<span class=\"txt\">"+$.nvl(shopInfo.address)+"</span>";
				infoWindowContents	+=	"		<dl>";
				infoWindowContents	+=	"			<dt>tel</dt>";
				infoWindowContents	+=	"			<dd>"+$.nvl(shopInfo.tel)+"</dd>";
				infoWindowContents	+=	"		</dl>";
				infoWindowContents	+=	"	</div>";
				infoWindowContents	+=	"	<a href=\"/store/StoreView.pb?shopSeq="+shopInfo.shopSeq+"\" class=\"btnDetail\">자세히보기</a>";
				infoWindowContents	+=	"	<a href=\"#\" onclick=\"$.infoWindowClose();return false;\" class=\"btnClose\">닫기</a>";
				infoWindowContents	+=	"</div>";

				if ( isDriveThruShop ){
					marker.setIcon("/images/store/mapIcon02_dt.png");
				} else {
					marker.setIcon("/images/store/mapIcon02.png");	
				}				 
				  				 
				infoWindow.setContent(infoWindowContents);				  
				infoWindow.open(map,marker);		
				
				mapLocation = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
				map.panTo(mapLocation);
				$.scrollMove(StoreDataList[i].shopSeq);
			  }
		})(marker, i));
		
	    google.maps.event.addListener(infoWindow, 'domready', function() {
	    	var iwOuter = $('.gm-style-iw-d');
	    	var iwCloseBtn = $(iwOuter).next(":button");
	    	iwCloseBtn.css({'display': 'none'});
	    });	    
    }   
}

/**
 * 내 위치 찾기 버튼 설정
 */
var setLocationBtn = function (controlDiv, map) {
	  controlDiv.style.padding = '20px';
	  var controlUI = document.createElement('div');
		  controlUI.style.cursor = 'pointer';
		  controlUI.title = '현재 내 위치';
	  controlDiv.appendChild(controlUI);
	  
	  var controlText = document.createElement('div');
	  	  controlText.innerHTML = "<img src=\"/images/store/mylocation.png\" alt=\"MY LOCATION\" onmouseover=\"setLocationBtnChangeImage(this, '/images/store/mylocation_on.png')\" onmouseout=\"setLocationBtnChangeImage(this, '/images/store/mylocation.png')\">"	  		
	  controlUI.appendChild(controlText);
	 
	  google.maps.event.addDomListener(controlUI, 'click', function() {
		  MAP_CONSTANTS.POSI_LATI = "0";
		  MAP_CONSTANTS.POSI_LONGI = "0";
	  
		  if (navigator.geolocation) { // 
			navigator.geolocation.getCurrentPosition(function(position) {
				$.moveToCenter(position.coords.latitude, position.coords.longitude);
			});
		  }  
	  });
}

function setLocationBtnChangeImage ( imgObj, imgSrc) {
	imgObj.src=imgSrc;
}