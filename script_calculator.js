let runningTotal = 0;
let buffer = "0";
let previousOperator = null;
let calculateHistory = [];
let lastNumber = "";
let isNewNumber = true;

const screen = document.querySelector(".current-operation");
const history = document.querySelector(".history");

function addToHistory(firstNum, operator, secondNum, result) {
    const calculation = `${firstNum} ${operator} ${secondNum} = ${result}`;
    calculateHistory.unshift(calculation);
    if (calculateHistory.length > 4) {
        calculateHistory.pop();
    }
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    if (history) { 
        history.innerHTML = calculateHistory.map(value => `<div class="history-item">${value}</div>`).join("");
    }
}


function buttonClick(value) {
    if (isNaN(value) && value !== ",") {
        handleSymbol(value);
    } else {
        handleNumber(value);
    }
    screen.innerText = buffer;
}

function handleSymbol(symbol) {
    switch (symbol) {
        case "C":
            buffer = "0";
            runningTotal = 0;
            previousOperator = null;
            lastNumber = "";
            isNewNumber = true;
            break;
        case "=":
            if (previousOperator === null || isNewNumber) {
                return;
            }
            
            const floatBuffer = parseFloat(buffer.replace(",", "."));
            
            flushOperation(floatBuffer);  // Perform the operation
            
            addToHistory(lastNumber, previousOperator, floatBuffer, runningTotal); // Add to history
            
            buffer = ("" + runningTotal).replace(".", ","); // Update display buffer
            screen.innerText = buffer;  // Update screen
            
            previousOperator = null;
            runningTotal = 0;
            isNewNumber = true;
            break;  
        case "←":
            if (buffer.length === 1) {
                buffer = "0";
            } else {
                buffer = buffer.substring(0, buffer.length - 1);
            }
            break;
        case "+":
        case "−":
        case "×":
        case "÷":
            handleMath(symbol);
            break;
    }
}

function handleMath(symbol) {
    if (buffer === "0") {
        return;
    }

    const floatBuffer = parseFloat(buffer.replace(",", "."));

    if (runningTotal === 0) {
        runningTotal = floatBuffer;
    } else {
        flushOperation(floatBuffer);
    }

    previousOperator = symbol;
    lastNumber = buffer;
    isNewNumber = true;
}

function flushOperation(floatBuffer) {
    if (previousOperator === "+") {
        runningTotal += floatBuffer;
    } else if (previousOperator === "−") {
        runningTotal -= floatBuffer;
    } else if (previousOperator === "×") {
        runningTotal *= floatBuffer;
    } else if (previousOperator === "÷") {
        if (floatBuffer === 0) {
            buffer = "Error";
            return;
        }
        runningTotal /= floatBuffer;
    }
}

function handleNumber(numberString) {
    if (numberString === ",") {
        if (buffer.includes(",")) {
            return;
        }
        buffer += numberString;
    } else {
        if (buffer === "0" || isNewNumber) {
            buffer = numberString;
            isNewNumber = false;
        } else {
            buffer += numberString;
        }
    }
}

function init() {
    document.querySelector(".calc-buttons").addEventListener("click", function(event) {
        if (event.target.tagName === "BUTTON") {
            buttonClick(event.target.innerText);
        }
    });
}

init();