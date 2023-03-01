
let estimated = document.querySelector("#estimated");
let hoursspent = document.querySelector("#spent");
let rangeLine = document.querySelector(".rangeslider .range .line");
let spent = document.querySelector(".rangeslider .spent span");
let remaining = document.querySelector(".rangeslider .remaining span");
hoursspent.addEventListener("input", function (e) {
    spent.textContent = e.target.value;
    let total = (e.target.value / estimated.value) * 100;
    rangeLine.style.width = total.toFixed(2) + "0%";
    remaining.textContent = estimated.value - e.target.value;
    if (total > 100) {
        rangeLine.style.width = "100%";
    }
});

estimated.addEventListener("input", function (e) {
    let total = (hoursspent.value / e.target.value) * 100;
    rangeLine.style.width = total.toFixed(2) + "0%";
    remaining.textContent = e.target.value - hoursspent.value;
    if (total > 100) {
        rangeLine.style.width = "100%";
    }
});

function showMenu() {
    let menu = document.querySelector(".menu-mobile ul");
    menu.classList.toggle("active");
}
