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
    beverageList = [...originalBeverageList]; // 복사본 생성

    return beverageList;
};

getBeverageList()
    .then(beverageList => {
        for (const beverage of beverageList) { // 복사본에 count 프로퍼티 추가
            beverage['count'] = 0;
        };

        return beverageList;
    })
    .then(beverageList => {
        beverageList.forEach(beverage => {
            const beverageHTML = showBeverageItem(beverage);
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
            </li>`;
};

function selectBeverage() {
    let target = checkTarget(event.target);

    if (!target) {
        return;
    }

    const targetId = target.getAttribute("data-id");

    // 재고 검사
    if (beverageList[targetId].stock === 0) {
        alert("품절된 상품입니다!");
        return;
    };

    // 재고가 있다면 재고 -1. 재고 -1 후 재고가 0이 되면 품절 이미지 띄우기
    selectTargetItem(target, targetId);

    // 선택 목록에 추가하기
    addChoiceList(target, targetId);
};

function checkTarget(target) {
    if (target.nodeName === "LI") {
        return target;
    } else if (target.parentNode.nodeName === "LI") {
        return target.parentNode;
    } else {
        return;
    };
};

function selectTargetItem(target, targetId) {
    beverageList[targetId].stock--;
    beverageList[targetId].count++;

    if (beverageList[targetId].stock === 0) {
        target.classList.add("sold-out");
        target.classList.remove("select");
    } else {
        target.classList.add("select");
    };
};

function addChoiceList(target, targetId) {
    if (beverageList[targetId].count === 1) {
        const choiceBeverageHTML = `<li class="scroll-list__item" data-id="${targetId}">
                                        <img src="./assets/images/${beverageList[targetId].photo}" alt="">
                                        <strong class="scroll-list__item-name" aria-label="음료 명">${beverageList[targetId].title}</strong>
                                        <div class="scroll-list__item-count" aria-label="선택 수량">1<span class="ir_pm">개</span>
                                        </div>
                                    </li>`;
        choiceList.insertAdjacentHTML('beforeend', choiceBeverageHTML);
    } else {
        const choiceItems = document.querySelectorAll(".buy__choice .scroll-list__item");
        
        for (const item of choiceItems) {
            if (item.getAttribute("data-id") === targetId) {
                const itemCountText = item.querySelector(".scroll-list__item-count");
                itemCountText.innerHTML = `${beverageList[targetId].count}<span class="ir_pm">개</span>`;
            }
        }
    }
};

function buyBeverage() {

}


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

boxList.addEventListener("click", selectBeverage);
buyButton.addEventListener("click", buyBeverage);
returnButton.addEventListener("click", returnBalance);
depositButton.addEventListener("click", depositBalance);