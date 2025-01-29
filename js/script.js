const display = document.getElementById('display');

function appendToDisplay(input) {
  display.value += input;
}

function clearDisplay() {
  display.value = '';
}

function calculate() {
  try {
    const result = evaluateExpression(display.value);
    display.value = result;
  } catch (error) {
    display.value = 'Error';
  }
}

function evaluateExpression(expression) {
  const tokens = expression.match(/(\d+(\.\d+)?|[-+*/()])/g);
  if (!tokens) throw new Error('Invalid Expression');

  const operatorPrecedence = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
  };

  const values = [];
  const operators = [];

  const applyOperator = () => {
    const b = values.pop();
    const a = values.pop();
    const op = operators.pop();

    switch (op) {
      case '+': values.push(a + b); break;
      case '-': values.push(a - b); break;
      case '*': values.push(a * b); break;
      case '/': 
        if (b === 0) throw new Error('Division by zero');
        values.push(a / b);
        break;
    }
  };

  for (const token of tokens) {
    if (!isNaN(token)) {
      values.push(parseFloat(token));
    } else if (token === '(') {
      operators.push(token);
    } else if (token === ')') {
      while (operators.length && operators[operators.length - 1] !== '(') {
        applyOperator();
      }
      operators.pop(); 
    } else {
      while (
        operators.length &&
        operatorPrecedence[operators[operators.length - 1]] >= operatorPrecedence[token]
      ) {
        applyOperator();
      }
      operators.push(token);
    }
  }

  while (operators.length) {
    applyOperator();
  }

  return values[0];
}
