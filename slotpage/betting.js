// 배팅 버튼 클릭 시 이벤트 처리
document.getElementById('battingConfirm').addEventListener('click', () => {
    const bettingAmount = parseInt(document.getElementById('battingInput').value); // 배팅 입력 값
    if (isNaN(bettingAmount) || bettingAmount <= 0) {
        alert("올바른 배팅 금액을 입력하세요.");
    } else {
        placeBet(bettingAmount); // placeBet 함수 호출
    }
});
