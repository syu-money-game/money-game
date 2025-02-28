document.addEventListener("DOMContentLoaded", () => {
    const observer = document.querySelector(".observer-img");
    const lever = document.querySelector(".lever");
    const probabilityControl = document.getElementById("probability-control");

    window.successCount = 0; // 전역 변수
    window.leverBoost = 0; // 전역 변수

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
            /\(\d+%\)/g,
            '<span class="probability-number">$1</span>'
        );
    }

    function detectLeverActivation() {
        const observerDetectionRate = getObserverDetectionRate();
        const randomChance = Math.random();

        if (randomChance < observerDetectionRate) {
            observer.src = "img/observer_active.png";
            playSoundEffect("HurtSFX");
            decreaseHealth();
            updateProbabilityMessage("⚠ 감시자에게 들켰습니다! 체력이 감소합니다.", "danger");
            setTimeout(() => {
                observer.src = "img/observer.png";
                probabilityControl.textContent = "";
            }, 2000);
        } else {
            window.successCount++;
            const prevBoost = window.leverBoost;
            window.leverBoost = Math.min(window.successCount * 10, 100);

            if (window.leverBoost > prevBoost) {
                updateProbabilityMessage(`🎉 레버 성공! 확률 증가: ${window.leverBoost}%`, window.successCount >= 10 ? "max-boost" : "default");
                setTimeout(() => probabilityControl.textContent = "", 2000);
            }

            if (window.successCount >= 10) {
                window.forceTripleMatch = true;
                updateProbabilityMessage("🔥 10번 연속 성공! 강제 트리플 매치 활성화!", "max-boost");
                setTimeout(() => probabilityControl.textContent = "", 3000);
            }
        }
    }

    lever.addEventListener('mousedown', () => {
        detectLeverActivation();
        playSoundEffect("LeverSFX");
    });
});