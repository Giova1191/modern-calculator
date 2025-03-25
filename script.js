class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
        this.updateDisplay();
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand = this.currentOperand.toString() + number;
        }
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = `${this.currentOperand} ${operation}`;
        this.currentOperand = '';
        this.updateDisplay();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand.split(' ')[0]);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert('Non puoi dividere per zero!');
                    return;
                }
                computation = prev / current;
                break;
            case '%':
                computation = (prev * current) / 100;
                break;
            default:
                return;
        }

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    formatNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('it', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.formatNumber(this.currentOperand);
        this.previousOperandElement.innerText = this.previousOperand;
    }
}

// Inizializzazione Calculator
const calculator = new Calculator(
    document.querySelector('[data-previous-operand]'),
    document.querySelector('[data-current-operand]')
);

// Event Listeners
document.querySelectorAll('[data-number]').forEach(button => {
    button.addEventListener('click', () => calculator.appendNumber(button.innerText));
});

document.querySelectorAll('[data-operation]').forEach(button => {
    button.addEventListener('click', () => calculator.chooseOperation(button.innerText));
});

document.querySelector('[data-equals]').addEventListener('click', () => calculator.compute());
document.querySelector('[data-all-clear]').addEventListener('click', () => calculator.clear());
document.querySelector('[data-delete]').addEventListener('click', () => calculator.delete());

// Supporto Tastiera
document.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        calculator.appendNumber(e.key);
        return;
    }
    
    if (['+', '-', '*', '/'].includes(e.key)) {
        calculator.chooseOperation(
            e.key === '*' ? '×' : e.key === '/' ? '÷' : e.key
        );
        return;
    }
    
    switch (e.key) {
        case 'Enter':
        case '=':
            calculator.compute();
            break;
        case 'Escape':
            calculator.clear();
            break;
        case 'Backspace':
            calculator.delete();
            break;
    }
});