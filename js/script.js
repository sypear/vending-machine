const moneyText = document.querySelector("#money-text");
const balanceText = document.querySelector("#balance-text");
const returnButton = document.querySelector("#return-button");
const depositButton = document.querySelector("#deposit-button");
const depositInput = document.querySelector("#deposit-input");
const boxList = document.querySelector(".box-list");
const cartList = document.querySelector(".buy__cart > .scroll-list");
const buyButton = document.querySelector("#buy-button");
const buyList = document.querySelector(".inventory .scroll-list");
const sumMoneyText = document.querySelector("#sum-money-text");

let originalBeverageList = [];
let beverageList = [];
let choiceCount = [];

let money = 10000;
let balance = 30000;
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
            const liEl = document.createElement("li");
            liEl.classList.add("item");
            liEl.setAttribute("data-id", beverage.id);

            const imgEl = document.createElement("img");
            imgEl.setAttribute("src", `./assets/images/${beverage.photo}`);
            liEl.appendChild(imgEl);

            const h3El = document.createElement("h3");
            h3El.ariaLabel = "음료 명";
            h3El.textContent = beverage.title;
            liEl.appendChild(h3El);

            const strongEl = document.createElement("strong");
            strongEl.classList.add("item-price");
            strongEl.ariaLabel = "가격";
            strongEl.textContent = `${beverage.price}원`;
            liEl.appendChild(strongEl);

            boxList.appendChild(liEl);
        });

        console.log("자판기", beverageList);
    })
    .catch(error => {
        console.error(error);
        alert("페이지에 문제가 발생했습니다.");
    });

function selectBeverage() {
    let target = checkTarget(event.target);
    if (!target) return;

    const targetId = target.getAttribute("data-id");

    // 재고 검사
    if (beverageList[targetId].stock === 0) {
        alert("품절된 상품입니다!");
        return;
    };

    // 잔액 검사
    if (beverageList[targetId].price > balance) {
        alert("잔액이 부족합니다.");
        return;
    }

    // 재고가 있다면 재고 -1. 재고 -1 후 재고가 0이 되면 품절 이미지 띄우기
    selectItem(target, targetId);

    // 잔액 감소
    reduceBalance(targetId);

    // 장바구니 목록에 추가하기
    addCartList(targetId);
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

function selectItem(target, targetId) {
    beverageList[targetId].stock--;
    beverageList[targetId].count++;

    if (beverageList[targetId].stock === 0) {
        target.classList.add("sold-out");
        target.classList.remove("select");
    } else {
        target.classList.add("select");
    };
};

function reduceBalance(targetId) {
    balance -= beverageList[targetId].price;
    balanceText.textContent = balance;
};

let cart = [];

function addCartList(targetId) {
    const cartIndex = cart.findIndex(item => item.id === targetId);

    if (cartIndex === -1) {
        // 처음 선택한 경우
        cart.push({
            "id": targetId,
            "title": beverageList[targetId].title,
            "photo": beverageList[targetId].photo,
            "price": beverageList[targetId].price,
            "count": 1,
        });

        // 화면에 추가
        const liEl = document.createElement("li");
        liEl.classList.add("scroll-list__item");
        liEl.setAttribute("data-id", targetId);

        const imgEl = document.createElement("img");
        imgEl.setAttribute("src", `./assets/images/${beverageList[targetId].photo}`);
        liEl.appendChild(imgEl);

        const h3El = document.createElement("h3");
        h3El.classList.add("scroll-list__item-name");
        h3El.ariaLabel = "음료 명";
        h3El.textContent = beverageList[targetId].title;
        liEl.appendChild(h3El);

        const divEl = document.createElement("div");
        divEl.classList.add("scroll-list__item-count");
        divEl.ariaLabel = "선택 수량";
        divEl.textContent = 1;
        liEl.appendChild(divEl);

        cartList.appendChild(liEl);

        return;
    }

    // 이미 선택된 경우 카운트 증가
    cart[cartIndex].count++;

    // 화면에 갱신
    const cartItems = cartList.querySelectorAll(".scroll-list__item");

    cartItems.forEach(item => {
        if (item.getAttribute("data-id") === targetId) {
            item.querySelector(".scroll-list__item-count").textContent = cart[cartIndex].count;
        };
    });
};

const buyBeverageMap = new Map();

function buyBeverage() {
    cart.forEach(item => {
        sumMoney += (item.price * item.count);

        if (!buyBeverageMap.has(item.id)) {
            buyBeverageMap.set(item.id, item);

            // 화면에 획득한 음료 뿌려주기
            const liEl = document.createElement("li");
            liEl.classList.add("scroll-list__item");
            liEl.setAttribute("data-id", item.id);

            const imgEl = document.createElement("img");
            imgEl.setAttribute("src", `./assets/images/${item.photo}`);
            liEl.appendChild(imgEl);

            const h3El = document.createElement("h3");
            h3El.classList.add("scroll-list__item-name");
            h3El.ariaLabel = "음료 명";
            h3El.textContent = item.title;
            liEl.appendChild(h3El);

            const divEl = document.createElement("div");
            divEl.classList.add("scroll-list__item-count");
            divEl.ariaLabel = "구매 수량";
            divEl.textContent = item.count;
            liEl.appendChild(divEl);

            buyList.appendChild(liEl);

            return;
        };

        // 이미 있는 음료면 카운트 증가하고 화면에 뿌려주기
        buyBeverageMap.get(item.id).count += item.count;
        const targetItem = buyList.querySelector(`.scroll-list__item[data-id='${item.id}']`);
        targetItem.childNodes[2].textContent = buyBeverageMap.get(item.id).count;
    });

    // 카트에 있는 애들 비우고 화면도 비우기
    cart = [];
    cartList.innerHTML = '';

    boxList.querySelectorAll("li").forEach(item => {
        item.classList.remove("select");
    });

    // 총 금액 갱신
    sumMoneyText.textContent = sumMoney;
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

boxList.addEventListener("click", selectBeverage);
buyButton.addEventListener("click", buyBeverage);
returnButton.addEventListener("click", returnBalance);
depositButton.addEventListener("click", depositBalance);