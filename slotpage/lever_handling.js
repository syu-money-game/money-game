document.addEventListener("DOMContentLoaded", () => {
    const observer = document.querySelector(".observer-img");
    const lever = document.querySelector(".lever");
    const probabilityControl = document.getElementById("probability-control");

    let successCount = 0; // 레버 성공 횟수
    window.leverBoost = 0; // 같은 심볼 확률 증가 (0~100%)
    let stage_id = 1; // 현재 스테이지 ID
    let timeoutId = null;

    function getObserverDetectionRate() {
        if (stage_id === 1) return 0.10;
        if (stage_id === 2) return 0.48;
        if (stage_id === 3) return 0.60;
        return 0.10;
    }

    function updateProbabilityMessage(message, type = "default") {
        probabilityControl.classList.remove("max-boost", "danger");
        if (type === "danger") {
            probabilityControl.classList.add("danger");
        } else if (type === "max-boost") {
            probabilityControl.classList.add("max-boost");
        }
    
        probabilityControl.innerHTML = message.replace(
            /(\d+%)/g,
            `<span class="probability-number">$1</span>`
        );
    }

    function detectLeverActivation() {
        const observerDetectionRate = getObserverDetectionRate();
        const randomChance = Math.random();

        if (randomChance < observerDetectionRate) {
            console.log(`Observer detected the lever! Detection Rate: ${observerDetectionRate * 100}%`);
            observer.src = "img/observer_active.png";
            playSoundEffect("HurtSFX");
            decreaseHealth();
            updateProbabilityMessage("⚠ 감시자에게 들켰습니다! 체력이 감소합니다.", "danger");

            setTimeout(() => {
                observer.src = "img/observer.png";
                probabilityControl.textContent = "";
            }, 2000);
        } else {
            successCount++;
            const prevBoost = window.leverBoost;
            window.leverBoost = Math.min(successCount * 10, 100);

            console.log(`Lever success! Boost: ${window.leverBoost}%, Success Count: ${successCount}`);

            if (window.leverBoost > prevBoost) {
                updateProbabilityMessage(`🎉 레버 성공! 확률 증가: ${window.leverBoost}%`, successCount >= 10 ? "max-boost" : "default");

                if (timeoutId !== null) clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    probabilityControl.textContent = "";
                }, 2000);
            }

            if (successCount >= 10) {
                window.forceTripleMatch = true;
                updateProbabilityMessage("🔥 10번 연속 성공! 강제 트리플 매치 활성화!");

                setTimeout(() => {
                    probabilityControl.textContent = "";
                }, 3000);
            }
        }
    }

    lever.addEventListener('mousedown', () => {
        detectLeverActivation();
        playSoundEffect("LeverSFX");
    });

    // ✅ 전역 함수로 등록하여 다른 파일에서 호출 가능하도록 함
    window.resetLeverProbability = function() {
        console.log(`Stage ${stage_id} 시작! 레버 확률 초기화.`);
        successCount = 0;
        window.leverBoost = 0;
        probabilityControl.textContent = ""; // UI 초기화
        window.forceTripleMatch = false;
    };
});
