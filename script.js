const inputSlider = document.querySelector("[data-lengthSlider]"); // syntax for using custom attributes.
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = ""; // initially the password is empty
let passwordLength = 10; // intially the length of password
let checkCount = 0; // initially the uppercase checkbox is selected

// set strength-circle to grey
setIndicator("#ccc");

handleSlider(); // basically the use of this function is to reflect the password length on the UI.

// set password-length
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min)) + "% 100%"    // width and height of slider.
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRndInteger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);     // it is a statement that uses the clipboard API to write the generated password to the clipboard. The writeText() method of the clipboard interface writes the provided text to the clipboard, it returns a promise that resolves when the text has been succesfully written to the clipboard. By using await, the code waits until the promise resolves before movin on to the next line of code.
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }
    
    // to make the copy-span visible.
    copyMsg.classList.add("active");
    // to hide the copy-span after 2 seconds.
    setTimeout(() => {
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array) {
    //Fisher Yates Method --> used for shuffling an array.
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange(){
    checkCount = 0; // initiated it as 0, as we dont know how many are already checked or not, so whenever the status of a checkbox is changed, we call this function to calc the number of checkboxes checked.
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    })

    // special case --> when the password length is smaller than the check count, then we will set the password length to be equal to the checkCount ans will call the handleSlider func so that it reflects on the UI too.
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox)=>{                               // through this we applied event listeners to all the checkboxes, that checkboxes mein koi bhi type ka change(tick or untick) ho, go and check count again of the number of checkboxes checked.
    checkbox.addEventListener('change',handleCheckBoxChange)
})

inputSlider.addEventListener('input', (e)=>{
    passwordLength = e.target.value;    // Get the element value where the event occurred
    handleSlider();
})

copyBtn.addEventListener('click', ()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})

generateBtn.addEventListener('click',()=>{
    // if none of the checkboxes are selected
    if(checkCount<=0){
        return;
    }

    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // to find the new password.

    // at first remove the old password
    password = "";

    // to insert what all is defined in the checkboxes.
    // if(uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked) {
    //     password += generateSymbol();
    // }

    let funcArr = [];   // initially it is empty

    // we will be pushing the functions checked in the checkboxes into the funcArr.
    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    // now for loop to add all the compulsory additions to the password.
    for(let i=0;i<funcArr.length;i++){
        password += funcArr[i]();
    }
    // for remaining addition.
    for(let i=0;i<(passwordLength-funcArr.length);i++){
        let randIndex = getRndInteger(0,funcArr.length);
        password += funcArr[randIndex]();
    }

    // shuffle the password
    password = shufflePassword(Array.from(password));   // sent password as an array to the shufflePassword function.

    // show in UI
    passwordDisplay.value = password;

    // calculate password strength
    calcStrength();
});