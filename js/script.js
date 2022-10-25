const moneyText = document.querySelector("#money-text");
const balanceText = document.querySelector("#balance-text");
const returnButton = document.querySelector("#return-button");
const depositButton = document.querySelector("#deposit-button");
const depositInput = document.querySelector("#deposit-input");
const boxList = document.querySelector(".box-list");
const choiceList = document.querySelector(".buy__choice > .scroll-list");
const buyButton = document.querySelector("#buy-button");
const buyList = document.querySelector(".inventory .scroll-list");
const sumMoneyText = document.querySelector("#sum-money-text");

let originalBeverageList = [];
let beverageList = [];
let choiceCount = [];

let money = 5000;
let balance = 10000;
let deposit = undefined;
let sumMoney = 0;

moneyText.textContent = money;
balanceText.textContent = balance;
sumMoneyText.textContent = sumMoney;

// 상품 리스트 가져와서 화면에 출력
async function getBeverageList() {
    let response = await fetch("./assets/json/beverage.json");
    originalBeverageList = await response.json();
    beverageList = [...originalBeverageList];

    return beverageList;
};

getBeverageList()
    .then(beverageList => {
        beverageList.forEach(beverage => {
            let beverageHTML = showBeverageItem(beverage);
            boxList.insertAdjacentHTML('beforeend', beverageHTML);
        });
    })
    .catch(error => {
        console.error(error);
        alert("페이지에 문제가 발생했습니다.");
    });

function showBeverageItem(beverage) {
    return `<li class="item" data-id="${beverage.id}">
                <img src="./assets/images/${beverage.photo}" alt="">
                <h3 aria-label="음료 명">${beverage.title}</h3>
                <strong class="item-price" aria-label="가격">${beverage.price}원</strong>
            </li>
            `;
};

function returnBalance() {
    if (balance === 0) {
        alert("잔액이 0원입니다!");
        return;
    };

    money += balance;
    balance = 0;

    moneyText.textContent = money;
    balanceText.textContent = balance;
};

function depositBalance() {
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
}

function resetdepositInput() {
    depositInput.value = "";
    depositInput.focus();
}

returnButton.addEventListener("click", returnBalance);
depositButton.addEventListener("click", depositBalance);