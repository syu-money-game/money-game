// 심볼 선언과 동시에 이미지와 가중치(슬롯에 나올 확률)를 부여
const symbols = [
    { name: 'grape', weight: 60, image: './img/grape.png' },
    { name: 'orange', weight: 60, image: './img/orange.png' },
    { name: 'apple', weight: 60, image: './img/apple.png' },
    { name: 'bar', weight: 30, image: './img/bar.png' },
    { name: 'seven', weight: 10, image: './img/seven.png' },
];

// 심볼 확률조작 함수
function getRandomSymbol() {
    if (window.forceTripleMatch) {
        const forcedSymbols = ['grape', 'orange', 'apple', 'bar', 'seven'];
        const randomSymbol = forcedSymbols[Math.floor(Math.random() * forcedSymbols.length)];
        return randomSymbol;
    }

    const boost = window.leverBoost || 0;
    const sameSymbolChance = boost / 100 * 5;
    if (Math.random() < Math.min(sameSymbolChance, 1)) {
        const randomIndex = Math.floor(Math.random() * symbols.length);
        console.log(`Boost triggered: ${boost}% -> Same symbol ${symbols[randomIndex].name}`);
        return symbols[randomIndex].name;
    }

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

// 조작한 심볼을 적용하는 함수
function updateReelSymbols(reel) {
    const symbolElements = reel.querySelectorAll('.symbol');
    symbolElements.forEach(element => {
        element.className = 'symbol ' + getRandomSymbol();
    });
}

// 이벤트에 따른 애니메이션 동작 제어
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
        playSoundEffect("SlotSFX");
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
            const boost = window.leverBoost || 0;
            const sameSymbolChance = boost / 100 * 5;
            if (Math.random() < Math.min(sameSymbolChance, 1)) {
                // 부스트 적용 시 동일 심볼로 강제 설정
                const randomIndex = Math.floor(Math.random() * symbols.length);
                finalResult1 = finalResult2 = finalResult3 = symbols[randomIndex].name;
                console.log(`Boost ${boost}% triggered: All set to ${finalResult1}`);
            } else {
                finalResult1 = getRandomSymbol();
                finalResult2 = getRandomSymbol();
                finalResult3 = getRandomSymbol();
            }
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
            stopSoundEffect("SlotSFX");
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
            playSoundEffect("BtnSFX");
            animateButtonAndHand();
            spinReels();
        }
    });
});