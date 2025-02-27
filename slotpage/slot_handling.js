// script.js
const symbols = [
    { name: 'grape', weight: 60, image: './img/grape.png' },
    { name: 'orange', weight: 60, image: './img/orange.png' },
    { name: 'apple', weight: 60, image: './img/apple.png' },
    { name: 'bar', weight: 30, image: './img/bar.png' },
    { name: 'seven', weight: 10, image: './img/seven.png' },
];

function getRandomSymbol() {
    // 10번 성공 시 강제로 같은 심볼 3개 반환
    if (window.forceTripleMatch) {
        const forcedSymbols = ['grape', 'orange', 'apple', 'bar', 'seven'];
        const randomSymbol = forcedSymbols[Math.floor(Math.random() * forcedSymbols.length)];
        // window.forceTripleMatch = false; // 한 번 사용 후 초기화
        // window.leverBoost = 0; // 확률 증가 초기화
        return randomSymbol;
    }

    const boost = window.leverBoost || 0; // 레버 부스트 적용
    const sameSymbolChance = boost / 100; // 0~1 사이 확률
    if (Math.random() < sameSymbolChance) {
        // 부스트 확률에 따라 같은 심볼 반환 (랜덤 선택)
        const randomIndex = Math.floor(Math.random() * symbols.length);
        return symbols[randomIndex].name;
    }

    // 기본 가중치 기반 랜덤 심볼 선택
    const totalWeight = symbols.reduce((sum, symbol) => sum + symbol.weight, 0);
    const randomNum = Math.random() * totalWeight;
    let cumulativeWeight = 0;

    for (const symbol of symbols) {
        cumulativeWeight += symbol.weight;
        if (randomNum < cumulativeWeight) {
            return symbol.name;
        }
    }
}

function updateReelSymbols(reel) {
    const symbolElements = reel.querySelectorAll('.symbol');
    symbolElements.forEach(element => {
        element.className = 'symbol ' + getRandomSymbol();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const reel1 = document.querySelector('.reel1');
    const reel2 = document.querySelector('.reel2');
    const reel3 = document.querySelector('.reel3');
    const lever = document.querySelector('.lever');
    const rightHand = document.querySelector('.right-hand-img');
    const button = document.querySelector('.button-img');

    let isSpinning = false;
    let spinInterval1, spinInterval2, spinInterval3;

    function spinReels() {
        if (isSpinning) return;
        if (parseInt(document.getElementById('bettingMoney').textContent) === 0) {
            alert("배팅 금액을 설정해주세요!");
            return;
        }

        isSpinning = true;
        button.classList.add('disabled');
        lever.classList.add('disabled');

        reel1.classList.add('spinning');
        reel2.classList.add('spinning');
        reel3.classList.add('spinning');

        spinInterval1 = setInterval(() => updateReelSymbols(reel1), 3000);
        spinInterval2 = setInterval(() => updateReelSymbols(reel2), 3000);
        spinInterval3 = setInterval(() => updateReelSymbols(reel3), 3000);

        const stopTime1 = 3000;
        const stopTime2 = 4000;
        const stopTime3 = 5000;

        // 최종 결과 생성
        let finalResult1, finalResult2, finalResult3;
        if (window.forceTripleMatch) {
            finalResult1 = finalResult2 = finalResult3 = getRandomSymbol(); // 강제 동일 심볼
        } else {
            finalResult1 = getRandomSymbol();
            finalResult2 = getRandomSymbol();
            finalResult3 = getRandomSymbol();
        }

        setTimeout(() => {
            clearInterval(spinInterval1);
            reel1.classList.remove('spinning');
            const symbols1 = reel1.querySelectorAll('.symbol');
            symbols1[1].className = 'symbol ' + finalResult1;
        }, stopTime1);

        setTimeout(() => {
            clearInterval(spinInterval2);
            reel2.classList.remove('spinning');
            const symbols2 = reel2.querySelectorAll('.symbol');
            symbols2[1].className = 'symbol ' + finalResult2;
        }, stopTime2);

        setTimeout(() => {
            clearInterval(spinInterval3);
            reel3.classList.remove('spinning');
            const symbols3 = reel3.querySelectorAll('.symbol');
            symbols3[1].className = 'symbol ' + finalResult3;
            isSpinning = false;
            button.classList.remove('disabled');
            lever.classList.remove('disabled');
        }, stopTime3);

        setTimeout(() => {
            if (typeof window.spinResult === 'function') {
                window.spinResult(finalResult1, finalResult2, finalResult3);
            }
        }, 5300);
    }

    function animateButtonAndHand() {
        button.src = './img/after_click.png';
        rightHand.classList.add('hand-moved');
        setTimeout(() => {
            button.src = './img/before_click.png';
            rightHand.classList.remove('hand-moved');
        }, 500);
    }

    button.addEventListener('click', () => {
        if (!isSpinning && !button.classList.contains('disabled')) {
            animateButtonAndHand();
            console.log(1);
            spinReels();
        }
    });

});