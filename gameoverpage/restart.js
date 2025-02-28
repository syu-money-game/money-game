let gameOverBg;

document.addEventListener("DOMContentLoaded", function () {
    gameOverBg = document.getElementById("gameOverBg");
    let shouldPlayGameOverBg = sessionStorage.getItem("playGameOverBg") === "true";

    if (shouldPlayGameOverBg) {
        gameOverBg.volume = 1.0;
        gameOverBg.play().then(() => {
            // console.log("배경 재생 성공");
        }).catch(error => {
            // console.error("실패:", error);
        });
    }

    sessionStorage.removeItem("playGameOverBg");
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        gameOverBg.pause();
        gameOverBg.currentTime = 0;

        window.location.href = '../startpage/title.html';
    }
}, { once: true }); // 한번만 실행되도록 설정

