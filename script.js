document.addEventListener('DOMContentLoaded', () => {
    // 1. 모바일 메뉴 제어
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            // 버튼 모양 X로 변경
            mobileMenuBtn.classList.toggle('active');
            // 메뉴 오버레이 슬라이드
            mobileNavOverlay.classList.toggle('open');
        });
    }

    // 2. 데스크탑 메뉴 제어 (호버 시 X 변경 및 메뉴 확장)
    const desktopWrapper = document.getElementById('desktop-menu-wrapper');
    const desktopBtn = document.getElementById('desktop-menu-btn');

    if (desktopWrapper && desktopBtn) {
        // 마우스가 영역(버튼+메뉴박스)에 들어오면
        desktopWrapper.addEventListener('mouseenter', () => {
            desktopBtn.classList.add('active'); // 버튼 X로 변신
        });

        // 마우스가 영역 밖으로 나가면
        desktopWrapper.addEventListener('mouseleave', () => {
            desktopBtn.classList.remove('active'); // 버튼 원복
        });
    }
});
