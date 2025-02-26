// script.js
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
        if (isSpinning) return;
        isSpinning = true;

        // 버튼과 레버 비활성화
        toggle.disabled = true;
        lever.classList.add('disabled');

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
            // 버튼과 레버 다시 활성화
            toggle.disabled = false;
            lever.classList.remove('disabled');
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