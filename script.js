document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. 공통: 네비게이션 메뉴 (모바일/데스크탑)
    // ==========================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            mobileNavOverlay.classList.toggle('open');
        });
    }

    const desktopWrapper = document.getElementById('desktop-menu-wrapper');
    const desktopBtn = document.getElementById('desktop-menu-btn');

    if (desktopWrapper && desktopBtn) {
        desktopWrapper.addEventListener('mouseenter', () => {
            desktopBtn.classList.add('active');
        });
        desktopWrapper.addEventListener('mouseleave', () => {
            desktopBtn.classList.remove('active');
        });
    }

    // ==========================================
    // 2. 캐릭터 페이지 전용 로직
    // ==========================================
    
    // 'char-card'가 있는 페이지에서만 실행 (에러 방지)
    const cards = document.querySelectorAll('.char-card');
    const container = document.querySelector('.char-list-container');

    if (cards.length > 0 && container) {

        // 2-1. 카드 뒤집기 & 별가루 이벤트
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                const inner = card.querySelector('.card-inner');
                // 뒤집기 불가능한 카드(no-flip)가 아닐 때만 실행
                if (inner && !inner.classList.contains('no-flip')) {
                    card.classList.toggle('flipped');
                    createStarDust(card); // 별가루 생성
                }
            });
        });

        // 2-2. 슬라이더 포커스 연출 (가운데 오면 .active 추가)
        const focusObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                } else {
                    entry.target.classList.remove('active');
                    // 포커스 나가면 뒤집힌거 원상복구 (선택사항)
                    entry.target.classList.remove('flipped'); 
                }
            });
        }, {
            root: container, // 컨테이너 안에서 감지
            threshold: 0.6   // 60% 이상 보여야 활성화
        });

        cards.forEach(card => focusObserver.observe(card));

        // 2-3. 등장 애니메이션용 옵저버 (.show 클래스 제어)
        // (필터링 시 부드럽게 나타나게 하기 위해 필요)
        const entranceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                }
            });
        }, {
            root: null,
            threshold: 0.1
        });
        
        cards.forEach(card => entranceObserver.observe(card));


        // 2-4. 필터링 로직
        const checkboxes = document.querySelectorAll('.filter-btn input[type="checkbox"]');

        function filterCards() {
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

            cards.forEach(card => {
                const gender = card.getAttribute('data-gender');
                const role = card.getAttribute('data-role');
                const contract = card.getAttribute('data-contract');

                const matchGender = checkedValues.gender.includes(gender);
                const matchRole = checkedValues.role.includes(role);
                const matchContract = checkedValues.contract.includes(contract);

                if (matchGender && matchRole && matchContract) {
                    // 조건 맞으면 보임
                    card.style.display = 'block'; 
                    
                    // 애니메이션 리셋 (잠깐 껐다 켜기)
                    card.classList.remove('show');
                    setTimeout(() => {
                         entranceObserver.observe(card);
                    }, 50);

                    // 포커스 옵저버도 다시 연결
                    focusObserver.observe(card);

                } else {
                    // 조건 안 맞으면 숨김
                    card.style.display = 'none';
                    card.classList.remove('active');
                    card.classList.remove('show');
                }
            });

            // 필터 적용 후 스크롤 맨 앞으로 이동
            resetScroll();
        }

        // 체크박스 변경 시 실행
        checkboxes.forEach(box => {
            box.addEventListener('change', filterCards);
        });

        // 스크롤 초기화 함수
        function resetScroll() {
            if (container) {
                container.scrollTop = 0;
                container.scrollLeft = 0;
            }
        }
    }
});

// ==========================================
// 3. 별가루 이펙트 함수 (전역 함수)
// ==========================================
function createStarDust(cardElement) {
    const particleCount = 80; 
    const colors = ['#ffb7d5', '#fff0f5', '#ffd700', '#ffffff', '#8a1c1c']; 

    const rect = cardElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('star-particle');

        const shapeType = Math.random();
        if (shapeType > 0.6) particle.classList.add('shape-star');
        else if (shapeType > 0.3) particle.classList.add('shape-diamond');

        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 600 + 200; 
        
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        const size = Math.random() * 16 + 4; 
        const color = colors[Math.floor(Math.random() * colors.length)];

        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        particle.style.setProperty('--size', `${size}px`);
        particle.style.setProperty('--color', color);
        
        particle.style.setProperty('--rot', `${Math.random() * 720 - 360}deg`);

        particle.style.left = `${centerX}px`;
        particle.style.top = `${centerY}px`;
        document.body.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}
