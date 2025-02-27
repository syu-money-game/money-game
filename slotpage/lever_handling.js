document.addEventListener("DOMContentLoaded", () => {
    const observer = document.querySelector(".observer-img");
    const lever = document.querySelector(".lever");

    let successCount = 0; // 레버 성공 횟수
    window.leverBoost = 0; // 같은 심볼 확률 증가 (0~100%)

    function detectLeverActivation() {
        const randomChance = Math.random();

        // 60% 확률로 감시자가 감지하지만, 성공 시 카운트 증가
        if (randomChance < 0) {
            console.log("Observer detected the lever!");
            observer.src = "img/observer_active.png";
            playSoundEffect("HurtSFX")
            decreaseHealth(); // 체력 감소
            setTimeout(() => {
                observer.src = "img/observer.png";
            }, 2000);
        } else {
            // 감시자에게 안 걸리면 성공
            successCount++;
            window.leverBoost = Math.min(successCount * 10, 100); // 10%씩 증가, 최대 100%
            console.log(`Lever success! Boost: ${window.leverBoost}%, Success Count: ${successCount}`);

            // 10번 성공 시 알림
            if (successCount >= 10) {
                console.log("10 successes achieved! Forcing triple match.");
                window.forceTripleMatch = true; // 강제 트리플 매치 플래그
            }
        }
    }

    lever.addEventListener('mousedown', () => {
        detectLeverActivation();
        playSoundEffect("LeverSFX")

    });
});