function gameOver() {
    window.location.href = "../gameoverpage/gameover.html";
}

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
