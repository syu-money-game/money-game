// hand_handling.js
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('toggle');
    const reel1 = document.querySelector('.reel1');
    const reel2 = document.querySelector('.reel2');
    const reel3 = document.querySelector('.reel3');
    const lever = document.querySelector('.lever');
    const rightHand = document.querySelector('.right-hand-img');
    const button = document.querySelector('.button-label');

    // 요소가 없으면 에러 로그 출력 후 종료
    if (!toggle || !rightHand || !button || !lever || !reel1 || !reel2 || !reel3) {
        console.error('Missing elements:', {
            toggle, rightHand, button, lever, reel1, reel2, reel3
        });
        return;
    }

    let isSpinning = false;

    function spinReels() {
        // 배팅 시도 관련 코드
        // placeBet 함수가 false(or return) 반환 시 스핀 취소
        if(typeof placeBet === 'function') {
            // TODO : amount 함수에 상수가 아닌 플레이어 입력값 넣어야함
            const betSuccuss = placeBet(10000); // 예시 : 10000
            if (!betSuccuss) {
                 // 배팅 실패시 스핀 중단(배팅 금액 부족 등)
                return;
            }
        }

        // 이미 스핀 중일 경우 취소
        if (isSpinning) return;
        isSpinning = true;

        // 릴 관련 애니메이션
        reel1.classList.add('spinning');
        reel2.classList.add('spinning');
        reel3.classList.add('spinning');

        const stopTime1 = Math.random() * 2000 + 2000;
        const stopTime2 = Math.random() * 2000 + 2500;
        const stopTime3 = Math.random() * 2000 + 3000;

        setTimeout(() => reel1.classList.remove('spinning'), stopTime1);
        setTimeout(() => reel2.classList.remove('spinning'), stopTime2);
        setTimeout(() => {
            reel3.classList.remove('spinning');
            isSpinning = false;

            // 스핀 결과 처리
            if (typeof spinResult === 'function') {
                // TODO : slot_db.js 의 spinResult 함수 확률에 따른 가중치 추가 필요
                spinResult();
            }
        }, stopTime3);
    }

    function animateButtonAndHand() {
        button.classList.add('button-pressed');
        rightHand.classList.add('hand-moved');

        setTimeout(() => {
            button.classList.remove('button-pressed');
            rightHand.classList.remove('hand-moved');
        }, 500);
    }

    toggle.addEventListener('click', () => {
        animateButtonAndHand();
        spinReels();
    });

    lever.addEventListener('click', () => {
        animateButtonAndHand();
        spinReels();
    });
});