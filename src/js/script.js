let lastOperationDisplay = document.getElementById(
    "last-operation-display"
);
let currentOperationDisplay = document.getElementById(
    "current-operation-display"
);

const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const operators = ["+", "-", "/", "*"];
const specialMethods = ["AC", "DE", ".", "="];

const calculate = (expression) => {
    let expressionAsArray = expression
                            .split(" ")
                            .filter((value) => value.length > 0);

    let convertedNumbers = expressionAsArray
                           .filter((value) => /[0-9]/.test(value))
                           .map((elem) => convertUserNumberToNumber(elem));

    let calculatedNumber = convertNumberToUserNumber(
        String(eval(convertedNumbers[0] +
                    expressionAsArray[1] +
                    convertedNumbers[1]))
    );
    return calculatedNumber;
};

const addNumberDelimeters = (number) => {
    let reversedArrayNumber = number.split("").reverse();

    reversedArrayNumber.forEach((elem, index) => {
        if ((index + 1) % 3 === 0 && (index + 1 !== number.length)) {
            reversedArrayNumber[index] = "," + elem;
        }
    });

    let finalNumber = reversedArrayNumber.reverse().join("");
    return finalNumber;
};

const convertNumberToUserNumber = (number) => {
    let wholePart = number;
    let fractionalPart = "";

    let indexOfPoint = number.indexOf(".");
    if (indexOfPoint > -1) {
        wholeNumberEnds = number.slice(0, indexOfPoint);
        fractionalPart = "." + number.slice(indexOfPoint+1);
    }
    wholePart = addNumberDelimeters(wholePart);
    return wholePart + fractionalPart;
};

const convertUserNumberToNumber = (userNumber) => {
    return userNumber
           .split("")
           .filter((value) => /[0-9]/.test(value) || value === ".")
           .join("");
};

const checkPossibleToAddNumber = () => {
    return currentOperationDisplay.innerText.length + 1 < 12;
};

const addNumber = (number) => {
    if (!checkPossibleToAddNumber()) {
        return;
    }
    if (currentOperationDisplay.innerText === "0") {
        currentOperationDisplay.innerText = number;
    } else {
        let currentNumber = convertUserNumberToNumber(
            currentOperationDisplay.innerText
        );
        currentNumber += number;
        currentNumber = convertNumberToUserNumber(currentNumber);
        currentOperationDisplay.innerText = currentNumber;
    }
};
const addOperator = (operator) => {
    lastOperationDisplay.innerText =
                currentOperationDisplay.innerText + " " + operator;
    currentOperationDisplay.innerText = "";
};
const processAC = () => {
    currentOperationDisplay.innerText = "";
    lastOperationDisplay.innerText = "";
    
    currentOperationDisplay.innerText = "0";
};
const processDE = () => {
    if (currentOperationDisplay.innerText.length > 1) {
        currentOperationDisplay.innerText =
                    currentOperationDisplay.innerText.slice(0, -1);
    } else {
        currentOperationDisplay.innerText =
                    lastOperationDisplay.innerText;
        lastOperationDisplay.innerText = "";
    }
};
const processPoint = () => {
    if (currentOperationDisplay.innerText.includes(".")) {
        return;
    }
    currentOperationDisplay.innerText += ".";
};
const processEqual = () => {
    currentOperationDisplay.innerText = calculate(
        lastOperationDisplay.innerText + " " + currentOperationDisplay.innerText
    );
    lastOperationDisplay.innerText = "";
};
const processSpecialMethod = (method) => {
    switch (method) {
        case "AC": processAC(); break;
        case "DE": processDE(); break;
        case ".": processPoint(); break;
        case "=": processEqual(); break;
    }
};

const updateCalculatorDisplay = (pressedButton) => {
    if (numbers.includes(pressedButton)) {
        addNumber(pressedButton);
    } else if (operators.includes(pressedButton)) {
        addOperator(pressedButton);
    } else if (specialMethods.includes(pressedButton)) {
        processSpecialMethod(pressedButton);
    }
};

window.addEventListener("load", (event) => {
    document.querySelectorAll("td").forEach((elem) => {
        elem.addEventListener("click", () => {
            updateCalculatorDisplay(elem.innerText);
        });
    });
});