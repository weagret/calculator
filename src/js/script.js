let lastOperationDisplay = document.getElementById(
    "last-operation-display"
);
let currentOperationDisplay = document.getElementById(
    "current-operation-display"
);

const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const operators = ["+", "-", "/", "*"];
const specialMethods = ["AC", "DE", ".", "=", "A", "D", "ENTER"];

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
    if (!/[0-9]/.test(number)) { return Infinity; }
    let reversedArrayNumber = number.split("").reverse();
    let minus = "";

    if (reversedArrayNumber[reversedArrayNumber.length-1] === "-") {
        minus = "-"
        reversedArrayNumber.pop();
    }

    reversedArrayNumber.forEach((elem, index) => {
        if ((index + 1) % 3 === 0 && (index + 1 !== reversedArrayNumber.length)) {
            reversedArrayNumber[index] = "," + elem;
        }
    });

    let finalNumber = reversedArrayNumber.reverse().join("");
    return minus + finalNumber;
};

const convertNumberToUserNumber = (number) => {
    let wholePart = number;
    let fractionalPart = "";

    let indexOfPoint = number.indexOf(".");
    if (indexOfPoint > -1) {
        wholePart = number.slice(0, indexOfPoint);
        fractionalPart = "." + number.slice(indexOfPoint+1);
    }
    wholePart = addNumberDelimeters(wholePart);
    return wholePart + fractionalPart;
};

const convertUserNumberToNumber = (userNumber) => {
    return userNumber
           .split("")
           .filter((value) => /[0-9]/.test(value) || value === "." || value === "-")
           .join("");
};

const checkPossibleToAddNumber = () => {
    return currentOperationDisplay.value.length + 1 < 12;
};

const addNumber = (number) => {
    if (!checkPossibleToAddNumber()) {
        return;
    }
    if (currentOperationDisplay.value === "0") {
        currentOperationDisplay.value = number;
    } else {
        let currentNumber = convertUserNumberToNumber(
            currentOperationDisplay.value
        );
        currentNumber += number;
        currentNumber = convertNumberToUserNumber(currentNumber);
        currentOperationDisplay.value = currentNumber;
    }
};
const addOperator = (operator) => {
    if (lastOperationDisplay.value.length === 0) {
        lastOperationDisplay.value =
                    currentOperationDisplay.value + " " + operator;
    } else {
        return;
    }
    currentOperationDisplay.value = "0";
};
const processAC = () => {
    currentOperationDisplay.value = "";
    lastOperationDisplay.value = "";
    
    currentOperationDisplay.value = "0";
};
const processDE = () => {
    if (currentOperationDisplay.value.length > 1) {
        let currentNumber = convertUserNumberToNumber(
            currentOperationDisplay.value
        );
        currentNumber = convertNumberToUserNumber(
            currentNumber.slice(0, -1)
        );
        currentOperationDisplay.value = currentNumber;
    } else {
        if (lastOperationDisplay.value.length > 0) {
            currentOperationDisplay.value =
                        lastOperationDisplay.value;
        } else {
            currentOperationDisplay.value = "0";
        }
        lastOperationDisplay.value = "";
    }
};
const processPoint = () => {
    if (currentOperationDisplay.value.includes(".")) {
        return;
    }
    currentOperationDisplay.value += ".";
};
const processEqual = () => {
    console.log(currentOperationDisplay.value);
    console.log(lastOperationDisplay.value);
    currentOperationDisplay.value = calculate(
        lastOperationDisplay.value + " " + currentOperationDisplay.value
    );
    lastOperationDisplay.value = "";
};
const processSpecialMethod = (method) => {
    switch (method) {
        case "A":
        case "AC": processAC(); break;

        case "D":
        case "DE": processDE(); break;

        case ".": processPoint(); break;

        case "ENTER":
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
    document.addEventListener("keydown", (event) => {
        updateCalculatorDisplay(event.key.toUpperCase());
    });
});