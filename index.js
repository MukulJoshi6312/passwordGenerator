Jconst inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

// initially 
let password = "";
let passwrodLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");
// set passwordLength

function handleSlider() {
    inputSlider.value = passwrodLength;
    lengthDisplay.innerText = passwrodLength;

    //or kuch bhi karne chahiye ?

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwrodLength - min) * 100 / (max - min)) + "% 100%"
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function generateRandomNumber() {
    return getRandomInteger(0, 9);
}

function generateUpperCase() {
    return String.fromCharCode(getRandomInteger(65, 91));
}

function generateLowerCase() {
    return String.fromCharCode(getRandomInteger(97, 123));
}

function generateSymbol() {
    const randNum = getRandomInteger(0, symbols.length);
    return symbols.charAt(randNum);

}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numberCheck.checked) hasNumber = true;
    if (symbolsCheck.checked) hasSymbol = true;


    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwrodLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNumber || hasSymbol) &&
        passwrodLength >= 6
    ) {
        setIndicator("ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    } catch (e) {
        copyMsg.innerText = "Failed";
    }

    // to make a copy wala span visible
    copyMsg.classList.add("active")
    setTimeout(() => {
        console.log("remove class")
        copyMsg.classList.remove("active");
    }, 2000)
}

function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((element) => (str += element));
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;
    });

    // special condition 
    if (passwrodLength < checkCount) {
        passwrodLength = checkCount;
        handleSlider();
    }

}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwrodLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click', () => {
    if (checkCount == 0)
        return;
    if (passwrodLength < checkCount) {
        passwrodLength = checkCount;
        handleSlider();
    }

    //  let's start the jounery to find teh new password
    console.log('Strating the jouenry');
    password = "";

    let funcArr = [];
    if (uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if (lowercaseCheck.checked)
        funcArr.push(generateLowerCase)

    if (numberCheck.checked)
        funcArr.push(generateRandomNumber);

    if (symbolsCheck.checked)
        funcArr.push(generateSymbol);

    // compulsory addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    console.log("Compulsory addition done");

    // remaning addition
    for (let i = 0; i < passwrodLength - funcArr.length; i++) {
        let randIndex = getRandomInteger(0, funcArr.length);
        console.log('randIndex ' + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining addition done");
    password = shufflePassword(Array.from(password));
    console.log('shuffling done');
    // show in UI
    passwordDisplay.value = password;
    console.log('Ui addition done');
    // calculate strength
    calcStrength();
})
