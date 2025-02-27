// 이소영 : 체력 감소 & 감소 시 게임 오버 시작

let maxHealth = 3; // 최대 체력
let currentHealth = maxHealth; // 현재 체력

function decreaseHealth() {
    if (currentHealth > 0) {
        currentHealth--; // 체력 감소
        updateHealthBar();

    }

    if (currentHealth === 0) {
        gameOver(); // 체력이 0이면 게임 오버 처리
    }
}

function updateHealthBar() {
    const hearts = document.querySelectorAll('.heart');
    hearts.forEach((heart, index) => {
        if (index < currentHealth) {
            heart.classList.remove('empty'); // 체력이 있으면 full 하트 유지
        } else {
            heart.classList.add('empty'); // 체력이 없으면 빈 하트로 변경
        }
    });
}
// 이소영 : 체력 감소 & 감소 시 게임 오버 끝

let inGameBg;

document.addEventListener('DOMContentLoaded', function () {
    inGameBg = document.getElementById("inGameBg");
    let shouldPlayInGameBg = sessionStorage.getItem("playInGameBg") === "true";

    if (shouldPlayInGameBg) {
        inGameBg.volume = 1.0;
        inGameBg.play().then(() => {
            console.log("재생 성공");
        }).catch(error => {
            console.error("실패:", error);
        });

        sessionStorage.removeItem("playInGameBg");
    }
})

function gameOver() {
    inGameBg.pause();
    inGameBg.currentTime = 0;

    sessionStorage.setItem("playGameOverBg", "true");

    window.location.href = "../gameoverpage/gameover.html";
}
