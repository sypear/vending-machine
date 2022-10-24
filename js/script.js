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
        for (const beverage of beverageList) {
            choiceCount.push(0);

            const liEl = document.createElement("li");
            liEl.classList.add("item");
        
            const imgEl = document.createElement("img");
            imgEl.setAttribute("src", `./assets/images/${beverage.photo}`);
            liEl.appendChild(imgEl);
        
            const h3El = document.createElement("h3");
            h3El.textContent = beverage.title;
            h3El.ariaLabel = "음료 명"
            liEl.appendChild(h3El);
        
            const strongEl = document.createElement("strong");
            strongEl.classList.add("item-price");
            strongEl.ariaLabel = "가격"
            strongEl.textContent = `${beverage.price}원`
            liEl.appendChild(strongEl);
        
            boxList.appendChild(liEl);
        }

        return beverageList;
    })
    .then(beverageList => {
        const items = document.querySelectorAll(".box-list .item");

        beverageList.forEach((beverage, index) => {
            // 클릭 이벤트 추가
            items[index].addEventListener("click", () => {
                // 매진된 상품 클릭 체크
                if (beverage.stock <= 0) {
                    alert("매진된 상품입니다.");
                    return;
                }

                // 잔액 체크
                if (beverage.price > balance) {
                    alert("잔액이 부족합니다.");
                    return;
                }

                // 잔액 있음 & 매진이 아니라면
                items[index].classList.add("select");

                if (beverage.stock === 1) {
                    items[index].classList.remove("select");
                    items[index].classList.add("sold-out");
                    items[index].ariaLabel = "품절 상품";
                }
                
                beverage.stock--;

                // 잔액 감소
                balance -= beverage.price;
                balanceText.textContent = balance;

                // 선택 수량 추가
                choiceCount[index] += 1;

                if (choiceCount[index] === 1) {
                    const liEl = document.createElement("li");
                    liEl.classList.add("scroll-list__item");
                
                    const imgEl = document.createElement("img");
                    imgEl.setAttribute("src", `./assets/images/${beverage.photo}`);
                    liEl.appendChild(imgEl);
    
                    const strongEl = document.createElement("strong");
                    strongEl.classList.add("scroll-list__item-name");
                    strongEl.ariaLabel = "음료 명"
                    strongEl.textContent = beverage.title;
                    liEl.appendChild(strongEl);
    
                    const divEl = document.createElement("div");
                    divEl.classList.add("scroll-list__item-count");
                    divEl.ariaLabel = "선택 수량";
                    divEl.textContent = choiceCount[index];
                    liEl.appendChild(divEl);
    
                    choiceList.appendChild(liEl);
                } else if (choiceCount[index] > 1) {
                    const choiceItems = document.querySelectorAll(".buy__choice > .scroll-list > li");
                    
                    choiceItems.forEach(choiceItem => {
                        if (choiceItem.childNodes[1].textContent === items[index].childNodes[1].textContent) {
                            choiceItem.childNodes[2].textContent = choiceCount[index];
                        }
                    });
                }
            })
        })
    })
    .catch(error => {
        console.error(error);
        alert("페이지에 문제가 발생했습니다.");
    });

// 획득버튼 기능 추가
buyButton.addEventListener("click", () => {
    const choiceItems = document.querySelectorAll(".buy__choice > .scroll-list > li");
    const items = document.querySelectorAll(".item");
    
    if (choiceItems.length === 0) {
        alert("선택한 음료가 없습니다.");
        return;
    };

    items.forEach(item => {
        item.classList.remove("select");
    });
});

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