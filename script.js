document.addEventListener('DOMContentLoaded', () => {
    const calculator = {
        displayValue: '0',
        firstOperand: null,
        waitingForSecondOperand: false,
        operator: null,
    };

    const display = document.getElementById('display');

    function updateDisplay() {
        display.textContent = calculator.displayValue;
    }

    function inputDigit(digit) {
        const { displayValue, waitingForSecondOperand } = calculator;

        if (waitingForSecondOperand) {
            calculator.displayValue = digit;
            calculator.waitingForSecondOperand = false;
        } else {
            calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
        }
    }

    function inputDecimal(dot) {
        // If we're waiting for a second operand, start with '0.'
        if (calculator.waitingForSecondOperand) {
            calculator.displayValue = '0.';
            calculator.waitingForSecondOperand = false;
            return;
        }

        // If the display value doesn't contain a decimal point
        if (!calculator.displayValue.includes(dot)) {
            calculator.displayValue += dot;
        }
    }

    function handleOperator(nextOperator) {
        const { firstOperand, displayValue, operator } = calculator;
        const inputValue = parseFloat(displayValue);

        // Verify that firstOperand is null and that the inputValue
        // is not NaN
        if (firstOperand === null && !isNaN(inputValue)) {
            calculator.firstOperand = inputValue;
        } else if (operator) {
            const result = calculate(firstOperand, inputValue, operator);

            calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
            calculator.firstOperand = result;
        }

        calculator.waitingForSecondOperand = true;
        calculator.operator = nextOperator;
    }

    function calculate(firstOperand, secondOperand, operator) {
        if (operator === 'add') {
            return firstOperand + secondOperand;
        } else if (operator === 'subtract') {
            return firstOperand - secondOperand;
        } else if (operator === 'multiply') {
            return firstOperand * secondOperand;
        } else if (operator === 'divide') {
            if (secondOperand === 0) {
                alert('Cannot divide by zero!');
                return firstOperand;
            }
            return firstOperand / secondOperand;
        } else if (operator === 'percent') {
            return firstOperand * (secondOperand / 100);
        }

        return secondOperand;
    }

    function resetCalculator() {
        calculator.displayValue = '0';
        calculator.firstOperand = null;
        calculator.waitingForSecondOperand = false;
        calculator.operator = null;
    }

    function deleteLastDigit() {
        if (calculator.waitingForSecondOperand) return;
        
        calculator.displayValue = calculator.displayValue.length > 1 ? 
            calculator.displayValue.slice(0, -1) : '0';
    }

    // Add event listeners to calculator buttons
    document.querySelector('.calculator-keys').addEventListener('click', (event) => {
        const { target } = event;
        
        // Check if the clicked element is a button
        if (!target.matches('button')) {
            return;
        }

        if (target.classList.contains('operator')) {
            const action = target.dataset.action;
            
            if (action === 'clear') {
                resetCalculator();
            } else if (action === 'delete') {
                deleteLastDigit();
            } else if (action === 'calculate') {
                handleOperator('calculate');
            } else {
                handleOperator(action);
            }
            
            updateDisplay();
            return;
        }

        if (target.classList.contains('decimal')) {
            inputDecimal('.');
            updateDisplay();
            return;
        }

        if (target.classList.contains('number')) {
            inputDigit(target.textContent);
            updateDisplay();
        }
    });

    // Add keyboard support
    document.addEventListener('keydown', (event) => {
        const { key } = event;
        
        // Handle number keys
        if (/\d/.test(key)) {
            event.preventDefault();
            inputDigit(key);
            updateDisplay();
        }
        
        // Handle operators
        if (key === '+') {
            event.preventDefault();
            handleOperator('add');
            updateDisplay();
        } else if (key === '-') {
            event.preventDefault();
            handleOperator('subtract');
            updateDisplay();
        } else if (key === '*') {
            event.preventDefault();
            handleOperator('multiply');
            updateDisplay();
        } else if (key === '/') {
            event.preventDefault();
            handleOperator('divide');
            updateDisplay();
        } else if (key === '%') {
            event.preventDefault();
            handleOperator('percent');
            updateDisplay();
        }
        
        // Handle decimal point
        if (key === '.') {
            event.preventDefault();
            inputDecimal('.');
            updateDisplay();
        }
        
        // Handle Enter key (equals)
        if (key === 'Enter') {
            event.preventDefault();
            handleOperator('calculate');
            updateDisplay();
        }
        
        // Handle Escape key (clear)
        if (key === 'Escape') {
            event.preventDefault();
            resetCalculator();
            updateDisplay();
        }
        
        // Handle Backspace key (delete)
        if (key === 'Backspace') {
            event.preventDefault();
            deleteLastDigit();
            updateDisplay();
        }
    });

    // Initialize display
    updateDisplay();
});