document.addEventListener("DOMContentLoaded", () => {
    const observer = document.querySelector(".observer-img");
    const lever = document.querySelector(".lever");

    function detectLeverActivation() {
        const randomChance = Math.random();

        // 60% 확률로 감시자가 확률 조작 버튼을 감지함.
        if (randomChance < 0.6) {
            console.log("Observer detected the lever!");
            observer.src = "img/observer_active.png";

            // 체력 감소 함수 호출
            decreaseHealth();

            setTimeout(() => {
                observer.src = "img/observer.png";
            }, 2000);
        }
    }

    lever.addEventListener('mousedown', () => {
        detectLeverActivation();
    });
});
