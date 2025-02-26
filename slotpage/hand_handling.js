// hand_handling.js
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('toggle');
    const reel1 = document.querySelector('.reel1');
    const reel2 = document.querySelector('.reel2');
    const reel3 = document.querySelector('.reel3');
    const lever = document.querySelector('.lever');
    const rightHand = document.querySelector('.right-hand-img');
    const button = document.querySelector('.button-label');

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
      
// 상혁 : 배당금 및 릴 확률 , 디비에 머니 로직 잘되는지 확인
// <<<<<<< feature/db/_main
//         // 릴 관련 애니메이션
// =======
//         // 버튼과 레버 비활성화
//         toggle.disabled = true;
//         lever.classList.add('disabled');

// >>>>>>> feature/slotmachine/_sanghyeok
        reel1.classList.add('spinning');
        reel2.classList.add('spinning');
        reel3.classList.add('spinning');

        const stopTime1 = 3000;
        const stopTime2 = 4000;
        const stopTime3 = 5000;

        setTimeout(() => reel1.classList.remove('spinning'), stopTime1);
        setTimeout(() => reel2.classList.remove('spinning'), stopTime2);
        setTimeout(() => {
            reel3.classList.remove('spinning');
            isSpinning = false;
// <<<<<<< feature/db/_main

//             // 스핀 결과 처리
//             if (typeof spinResult === 'function') {
//                 // TODO : slot_db.js 의 spinResult 함수 확률에 따른 가중치 추가 필요
//                 spinResult();
//             }
// =======
//             // 버튼과 레버 다시 활성화
//             toggle.disabled = false;
//             lever.classList.remove('disabled');
// >>>>>>> feature/slotmachine/_sanghyeok
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
        if (!isSpinning) {
            animateButtonAndHand();
            spinReels();
        }
    });
});