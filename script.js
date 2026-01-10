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

/* --- [캐릭터 페이지 기능: 필터 & 플립] --- */
// 1. 카드 뒤집기 & 별가루 이펙트
const cards = document.querySelectorAll('.char-card');

cards.forEach(card => {
    card.addEventListener('click', (e) => {
        const inner = card.querySelector('.card-inner');
        
        // 뒤집기 불가능한 카드(no-flip)가 아닐 때만 실행
        if (inner && !inner.classList.contains('no-flip')) {
            
            // 1) 카드 뒤집기
            card.classList.toggle('flipped');

            // 2) 별가루 뿌리기 (createStarDust 함수 호출)
            createStarDust(card);
        }
    });
});

// [script.js 하단 createStarDust 함수 교체]

function createStarDust(cardElement) {
    // 1. 입자 개수 대폭 증가 (30개 -> 60~80개)
    const particleCount = 80; 
    
    // 2. 색상: 앞면/뒷면 테마에 맞춰 랜덤
    const colors = ['#ffb7d5', '#fff0f5', '#ffd700', '#ffffff', '#8a1c1c']; 

    // 카드의 중심 좌표 계산 (화면 기준)
    const rect = cardElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('star-particle');

        // 모양 랜덤 (별, 원, 다이아몬드)
        const shapeType = Math.random();
        if (shapeType > 0.6) particle.classList.add('shape-star');
        else if (shapeType > 0.3) particle.classList.add('shape-diamond');

        // 3. 폭발 범위 대폭 증가 (400px -> 800px 이상)
        // Math.pow를 써서 중심엔 많이, 외곽엔 적게 퍼지도록 자연스럽게
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 600 + 200; // 날아가는 거리
        
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        // 크기 다양화 (작은건 4px, 큰건 20px)
        const size = Math.random() * 16 + 4; 
        const color = colors[Math.floor(Math.random() * colors.length)];

        // CSS 변수 주입
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        particle.style.setProperty('--size', `${size}px`);
        particle.style.setProperty('--color', color);
        
        // 회전 각도 랜덤
        particle.style.setProperty('--rot', `${Math.random() * 720 - 360}deg`);

        // 입자를 body에 직접 붙임 (카드 밖으로 튀어나가게 하기 위함)
        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;
        document.body.appendChild(particle);

        // 애니메이션 후 삭제
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

// 2. 필터링 (Filtering)
const checkboxes = document.querySelectorAll('.filter-group input[type="checkbox"]');
const charCards = document.querySelectorAll('.char-card');

function filterCards() {
    // 현재 체크된 값들을 수집
    const checkedValues = {
        gender: [],
        role: [],
        contract: []
    };

    checkboxes.forEach(box => {
        if (box.checked) {
            checkedValues[box.name].push(box.value);
        }
    });

    // 모든 카드 순회하며 검사
    charCards.forEach(card => {
        const gender = card.getAttribute('data-gender');
        const role = card.getAttribute('data-role');
        const contract = card.getAttribute('data-contract');

        // 3가지 조건(성별, 신분, 계약) 중 하나라도 체크 리스트에 없으면 숨김
        const matchGender = checkedValues.gender.includes(gender);
        const matchRole = checkedValues.role.includes(role);
        const matchContract = checkedValues.contract.includes(contract);

        if (matchGender && matchRole && matchContract) {
            card.style.display = 'block'; // 혹은 flex
        } else {
            card.style.display = 'none';
        }
    });
}

// 체크박스 변경 시마다 필터 함수 실행
checkboxes.forEach(box => {
    box.addEventListener('change', filterCards);
});
