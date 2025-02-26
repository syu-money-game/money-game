// script.js
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
        if (isSpinning) return;
        isSpinning = true;

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
        }, stopTime3);
    }


    // 버튼 입력시 console에 계속찍힘 -> 로직 개선바람.
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

});