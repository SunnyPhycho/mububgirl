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

// 별가루 생성 함수
function createStarDust(cardElement) {
    const particleCount = 30; // 한 번에 터지는 입자 수
    const colors = ['#ffb7d5', '#fff0f5', '#ffd700', '#ffffff']; // 핑크, 연핑크, 골드, 화이트

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('star-particle');

        // 30% 확률로 별 모양, 나머지는 원형
        if (Math.random() > 0.7) {
            particle.classList.add('shape-star');
        }

        // 랜덤 변수 설정
        const x = (Math.random() - 0.5) * 400; // X축 퍼짐 범위 (px)
        const y = (Math.random() - 0.5) * 400; // Y축 퍼짐 범위 (px)
        const size = Math.random() * 8 + 4; // 크기 4~12px
        const color = colors[Math.floor(Math.random() * colors.length)];

        // CSS 변수로 주입
        particle.style.setProperty('--tx', `${x}px`);
        particle.style.setProperty('--ty', `${y}px`);
        particle.style.setProperty('--size', `${size}px`);
        particle.style.setProperty('--color', color);

        // 카드 안에 추가
        cardElement.appendChild(particle);

        // 애니메이션(0.8초) 끝나면 태그 삭제 (메모리 관리)
        setTimeout(() => {
            particle.remove();
        }, 800);
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
