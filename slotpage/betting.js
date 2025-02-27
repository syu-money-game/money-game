// betting.js
document.addEventListener('DOMContentLoaded', () => {
    const bettingConfirmButton = document.getElementById('bettingConfirm');
    const bettingInput = document.getElementById('bettingInput');

    bettingConfirmButton.addEventListener('click', () => {
        const bettingAmount = parseInt(bettingInput.value);
        if (isNaN(bettingAmount) || bettingAmount <= 0) {
            alert("올바른 배팅 금액을 입력하세요.");
        } else {
            window.placeBet(bettingAmount);
            bettingInput.value = '';
        }
    });
});
