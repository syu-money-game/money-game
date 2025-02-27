document.addEventListener("DOMContentLoaded", () => {
    const observer = document.querySelector(".observer-img");
    const lever = document.querySelector(".lever");
    const probabilityControl = document.getElementById("probability-control"); // ✅ span 요소 가져오기

    let successCount = 0; // 레버 성공 횟수
    window.leverBoost = 0; // 같은 심볼 확률 증가 (0~100%)

    function getObserverDetectionRate() {
        if (stage_id === 1) return 0.10; // 10% 확률로 감지
        if (stage_id === 2) return 0.48; // 48% 확률로 감지
        if (stage_id === 3) return 0.60; // 60% 확률로 감지
        return 0.10; // 기본값 (Stage 1과 동일)
    }

    function updateProbabilityMessage(message, type = "default") {
        // 기존 클래스 제거 후 새로운 클래스 추가
        probabilityControl.classList.remove("max-boost", "danger");
        if (type === "danger") {
            probabilityControl.classList.add("danger"); // 감시자에게 걸렸을 때 (빨간색)
        } else if (type === "max-boost") {
            probabilityControl.classList.add("max-boost"); // 10번 성공했을 때 (주황색)
        }

        // console.log("색상 타입:", type); // 디버깅
        probabilityControl.innerHTML = message.replace(
            /(\d+%)/g, // 정규식으로 숫자% 찾기
            `<span class="probability-number">$1</span>` // ✅ 숫자는 항상 같은 스타일 유지
        );

    }


    function detectLeverActivation() {
        const observerDetectionRate = getObserverDetectionRate(); // 현재 Stage의 감시 확률 적용
        const randomChance = Math.random();

        if (randomChance < observerDetectionRate) {
            // ✅ 감시자에게 걸렸을 때 (빨간색)
            console.log(`Observer detected the lever! Detection Rate: ${observerDetectionRate * 100}%`);
            observer.src = "img/observer_active.png";
            playSoundEffect("HurtSFX");
            decreaseHealth(); // 체력 감소
            updateProbabilityMessage("⚠ 감시자에게 들켰습니다! 체력이 감소합니다.", "danger");
            setTimeout(() => {
                observer.src = "img/observer.png";
                probabilityControl.textContent = ""; // 2초 후 메시지 제거
            }, 2000);
        } else {
            // ✅ 감지되지 않음, 성공 카운트 증가
            successCount++;
            const prevBoost = window.leverBoost;
            window.leverBoost = Math.min(successCount * 10, 100); // 10%씩 증가, 최대 100%

            console.log(`Lever success! Boost: ${window.leverBoost}%, Success Count: ${successCount}`);

            // ✅ 확률 증가 메시지 표시 (10% 단위로 증가할 때만)
            if (window.leverBoost > prevBoost) {
                updateProbabilityMessage(`🎉 레버 성공! 확률 증가: ${window.leverBoost}%`, successCount >= 10 ? "max-boost" : "default");
                setTimeout(() => probabilityControl.textContent = "", 2000); // 2초 후 메시지 제거
            }

            // ✅ 10번 성공 시 강제 트리플 매치 (진한 오렌지색)
            if (successCount >= 10) {
                console.log("10 successes achieved! Forcing triple match.");
                window.forceTripleMatch = true;
                updateProbabilityMessage("🔥 10번 연속 성공! 강제 트리플 매치 활성화!", "max-boost");
                setTimeout(() => probabilityControl.textContent = "", 3000); // 3초 후 메시지 제거
            }
        }
    }

    lever.addEventListener('mousedown', () => {
        detectLeverActivation();
        playSoundEffect("LeverSFX");
    });
});
