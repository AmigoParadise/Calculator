// Select all necessary elements from the DOM
const display = document.querySelector('.display');
const buttons = document.querySelectorAll('button');

// State variables for the calculator
let firstOperand = null;
let secondOperand = null;
let currentOperator = null;
let shouldResetDisplay = false;

// Function to round numbers to a specific number of decimal places
function roundNumber(num) {
    return Math.round(num * 1000) / 1000;
}

// Main operation function that performs the calculation
function operate(a, b, operator) {
    a = Number(a);
    b = Number(b);
    if (operator === '+') return a + b;
    if (operator === '-') return a - b;
    if (operator === '*') return a * b;
    if (operator === '/') {
        if (b === 0) return 'Error'; // Handle division by zero
        return a / b;
    }
    return null;
}

// Function to handle number button clicks
function handleNumber(number) {
    if (display.textContent === '0' || shouldResetDisplay) {
        display.textContent = number;
        shouldResetDisplay = false;
    } else {
        display.textContent += number;
    }
}

// Function to handle operator button clicks
function handleOperator(operator) {
    if (currentOperator && !shouldResetDisplay) {
        secondOperand = display.textContent;
        let result = operate(firstOperand, secondOperand, currentOperator);
        if (result === 'Error') {
            display.textContent = result;
            resetCalculator(); // Reset the calculator after an error
            return;
        }
        display.textContent = roundNumber(result);
        firstOperand = display.textContent;
        secondOperand = null;
    } else {
        firstOperand = display.textContent;
    }
    currentOperator = operator;
    shouldResetDisplay = true;
}

// Function to handle the equals button
function handleEquals() {
    if (currentOperator === null || shouldResetDisplay) return;
    secondOperand = display.textContent;
    let result = operate(firstOperand, secondOperand, currentOperator);
    if (result === 'Error') {
        display.textContent = result;
        resetCalculator(); // Reset after an error
        return;
    }
    display.textContent = roundNumber(result);
    firstOperand = display.textContent;
    currentOperator = null;
    shouldResetDisplay = true;
}

// Function to handle the decimal point
function handleDecimal() {
    if (shouldResetDisplay) {
        display.textContent = '0.';
        shouldResetDisplay = false;
        return;
    }
    if (!display.textContent.includes('.')) {
        display.textContent += '.';
    }
}

// Function to clear all calculator state
function clearCalculator() {
    display.textContent = '0';
    resetCalculator();
}

// Helper function to reset the internal state without clearing the display
function resetCalculator() {
    firstOperand = null;
    secondOperand = null;
    currentOperator = null;
    shouldResetDisplay = false;
}

// Function to handle the delete/backspace button
function deleteLast() {
    if (display.textContent.length > 1) {
        display.textContent = display.textContent.slice(0, -1);
    } else {
        display.textContent = '0';
    }
}

// Add event listeners to all buttons
buttons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.hasAttribute('data-number')) {
            handleNumber(button.textContent);
        } else if (button.hasAttribute('data-operator')) {
            handleOperator(button.getAttribute('data-operator'));
        } else if (button.hasAttribute('data-decimal')) {
            handleDecimal();
        } else if (button.getAttribute('data-action') === 'clear') {
            clearCalculator();
        } else if (button.getAttribute('data-action') === 'delete') {
            deleteLast();
        } else if (button.getAttribute('data-action') === 'calculate') {
            handleEquals();
        }
    });
});
