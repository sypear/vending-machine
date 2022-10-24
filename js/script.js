const moneyText = document.querySelector("#money-text");
const balanceText = document.querySelector("#balance-text");
const returnButton = document.querySelector("#return-button");
const depositButton = document.querySelector("#deposit-button");
const depositInput = document.querySelector("#deposit-input");

let money = 5000;
let balance = 10000;
let deposit = undefined;

moneyText.textContent = money;
balanceText.textContent = balance;

returnButton.addEventListener("click", () => {
    if (balance === 0) {
        alert("잔액이 0원입니다!");
        return;
    };

    money += balance;
    balance = 0;

    moneyText.textContent = money;
    balanceText.textContent = balance;
});

depositButton.addEventListener("click", () => {
    deposit = parseInt(depositInput.value);

    if (isNaN(deposit) || deposit <= 0) {
        alert("1원 이상의 금액을 숫자로 입력해주세요.");
        resetdepositInput();
        return;
    };

    if (deposit > money) {
        alert("입금 금액이 소지금보다 많습니다.");
        resetdepositInput();
        return;
    };

    money -= deposit;
    balance += deposit;

    moneyText.textContent = money;
    balanceText.textContent = balance;

    resetdepositInput();
});

function resetdepositInput() {
    depositInput.value = "";
    depositInput.focus();
}