document.addEventListener("DOMContentLoaded", function() {
    let bgMusic = document.getElementById("bgMusic");
    let playButton = document.getElementById("playButton");

    // 버튼 클릭 시 음악 재생
    playButton.addEventListener("click", function() {
        if (bgMusic.paused) {
            bgMusic.volume = 1.0; // 볼륨 조절
            bgMusic.play().then(() => {
                playButton.style.backgroundImage = "url('img/musicStopBtn.png')";
                console.log("재생 성공");
            }).catch(error => {
                console.error("실패:", error);
            });
        } else  {
            bgMusic.pause();
            playButton.style.backgroundImage = "url('img/musicPlayBtn.png')"; // 재생 버튼 이미지로 변경
        }
    });

    // Enter 키를 누르면 페이지 이동
    document.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            bgMusic.pause();
            bgMusic.currentTime = 0;

            sessionStorage.setItem("playInGameBg", "true");
            window.location.href = "../slotpage/slot.html";  // slot.html로 이동
        }
    });
});
