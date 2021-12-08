$(function(){
    // 스크롤 애니메이션
    $('.animate').scrolla({
        mobile:true, // 모바일 버전 활성화
        once:false //true :한 번만, false : 계속
    })

    // 슬라이드 
    $('.visual .slide').slick({
        arrows: false,      // 화살표 사용여부
        dots: true,         // 네비게이션 사용여부
        autoplay: true,     // 자동재생
        fade: true,         // 페이드인 효과
        autoplaySpeed: 5000,// 재생시간 5000ms = 5초
        pauseOnHover: false,// 마우스 오버 시 멈춤 여부
        pauseOnFocus: false // 포커스 시 멈춤 여부


    })
})