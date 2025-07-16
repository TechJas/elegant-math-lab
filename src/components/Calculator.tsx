import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import * as calc from '@/utils/calculator';

type CalculatorMode = 'basic' | 'scientific' | 'conversion';

export function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [pendingFunction, setPendingFunction] = useState<string | null>(null);
  const [mode, setMode] = useState<CalculatorMode>('basic');
  const [memory, setMemory] = useState<number>(0);
  const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('deg');

  const inputNumber = useCallback((num: string) => {
    if (waitingForOperand || pendingFunction) {
      setDisplay(num);
      setWaitingForOperand(false);
      if (pendingFunction) {
        // Execute pending function with the new number
        const inputValue = parseFloat(num);
        let result: number | string = 0;
        
        switch (pendingFunction) {
          case 'sqrt':
            result = calc.squareRoot(inputValue);
            break;
          case 'cbrt':
            result = calc.cubicRoot(inputValue);
            break;
        }
        
        setDisplay(typeof result === 'string' ? result : String(result));
        setPendingFunction(null);
        setWaitingForOperand(true);
        return;
      }
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  }, [display, waitingForOperand, pendingFunction, angleMode]);

  const inputDot = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  }, [display, waitingForOperand]);

  const clear = useCallback(() => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    setPendingFunction(null);
  }, []);

  const performOperation = useCallback((nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      let result: number | string = 0;

      switch (operation) {
        case '+':
          result = calc.add(currentValue, inputValue);
          break;
        case '-':
          result = calc.subtract(currentValue, inputValue);
          break;
        case '*':
          result = calc.multiply(currentValue, inputValue);
          break;
        case '/':
          result = calc.divide(currentValue, inputValue);
          break;
        case '**':
          result = calc.power(currentValue, inputValue);
          break;
        default:
          return;
      }

      if (typeof result === 'string') {
        setDisplay(result);
        setPreviousValue(null);
        setOperation(null);
        setWaitingForOperand(true);
        return;
      }

      setDisplay(String(result));
      setPreviousValue(result);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  }, [display, previousValue, operation]);

  const calculate = useCallback(() => {
    performOperation('=');
    setOperation(null);
    setPreviousValue(null);
    setWaitingForOperand(true);
  }, [performOperation]);

  const performFunction = useCallback((func: string) => {
    // Handle constants immediately
    if (func === 'pi' || func === 'e') {
      const result = func === 'pi' ? Math.PI : Math.E;
      setDisplay(String(result));
      setWaitingForOperand(true);
      return;
    }

    // Handle trigonometric functions immediately (like previous version)
    if (['sin', 'cos', 'tan', 'sec', 'cosec', 'cot', 'ln', 'log', 'factorial', '1/x', 'x²', 'x³'].includes(func)) {
      const inputValue = parseFloat(display);
      let result: number | string = 0;

      switch (func) {
        case 'sin':
          if (angleMode === 'deg') {
            // Handle special angles for exact values
            const normalizedAngle = inputValue % 360;
            if (normalizedAngle === 0 || normalizedAngle === 180) result = 0;
            else if (normalizedAngle === 90) result = 1;
            else if (normalizedAngle === 270) result = -1;
            else if (normalizedAngle === 30) result = 0.5;
            else if (normalizedAngle === 150) result = 0.5;
            else if (normalizedAngle === 210) result = -0.5;
            else if (normalizedAngle === 330) result = -0.5;
            else result = calc.sinDeg(inputValue);
          } else {
            result = Math.sin(inputValue);
          }
          break;
        case 'cos':
          if (angleMode === 'deg') {
            // Handle special angles for exact values
            const normalizedAngle = inputValue % 360;
            if (normalizedAngle === 90 || normalizedAngle === 270) result = 0;
            else if (normalizedAngle === 0) result = 1;
            else if (normalizedAngle === 180) result = -1;
            else if (normalizedAngle === 60) result = 0.5;
            else if (normalizedAngle === 120) result = -0.5;
            else if (normalizedAngle === 240) result = -0.5;
            else if (normalizedAngle === 300) result = 0.5;
            else result = calc.cosDeg(inputValue);
          } else {
            result = Math.cos(inputValue);
          }
          break;
        case 'tan':
          if (angleMode === 'deg') {
            // Handle special angles for exact values
            const normalizedAngle = inputValue % 360;
            if (normalizedAngle === 90 || normalizedAngle === 270) result = 'Infinity';
            else if (normalizedAngle === 0 || normalizedAngle === 180) result = 0;
            else if (normalizedAngle === 45) result = 1;
            else if (normalizedAngle === 135) result = -1;
            else if (normalizedAngle === 225) result = 1;
            else if (normalizedAngle === 315) result = -1;
            else result = calc.tanDeg(inputValue);
          } else {
            result = Math.tan(inputValue);
          }
          break;
        case 'sec':
          if (angleMode === 'deg') {
            const normalizedAngle = inputValue % 360;
            if (normalizedAngle === 90 || normalizedAngle === 270) result = 'Infinity';
            else if (normalizedAngle === 0) result = 1;
            else if (normalizedAngle === 180) result = -1;
            else if (normalizedAngle === 60 || normalizedAngle === 300) result = 2;
            else if (normalizedAngle === 120 || normalizedAngle === 240) result = -2;
            else {
              const cosValue = calc.cosDeg(inputValue);
              result = Math.abs(cosValue) < 1e-10 ? 'Infinity' : 1 / cosValue;
            }
          } else {
            const cosValue = Math.cos(inputValue);
            result = Math.abs(cosValue) < 1e-10 ? 'Infinity' : 1 / cosValue;
          }
          break;
        case 'cosec':
          if (angleMode === 'deg') {
            const normalizedAngle = inputValue % 360;
            if (normalizedAngle === 0 || normalizedAngle === 180) result = 'Infinity';
            else if (normalizedAngle === 90) result = 1;
            else if (normalizedAngle === 270) result = -1;
            else if (normalizedAngle === 30 || normalizedAngle === 150) result = 2;
            else if (normalizedAngle === 210 || normalizedAngle === 330) result = -2;
            else {
              const sinValue = calc.sinDeg(inputValue);
              result = Math.abs(sinValue) < 1e-10 ? 'Infinity' : 1 / sinValue;
            }
          } else {
            const sinValue = Math.sin(inputValue);
            result = Math.abs(sinValue) < 1e-10 ? 'Infinity' : 1 / sinValue;
          }
          break;
        case 'cot':
          if (angleMode === 'deg') {
            const normalizedAngle = inputValue % 360;
            if (normalizedAngle === 90 || normalizedAngle === 270) result = 0;
            else if (normalizedAngle === 0 || normalizedAngle === 180) result = 'Infinity';
            else if (normalizedAngle === 45 || normalizedAngle === 225) result = 1;
            else if (normalizedAngle === 135 || normalizedAngle === 315) result = -1;
            else {
              const tanValue = calc.tanDeg(inputValue);
              result = Math.abs(tanValue) < 1e-10 ? 'Infinity' : 1 / tanValue;
            }
          } else {
            const tanValue = Math.tan(inputValue);
            result = Math.abs(tanValue) < 1e-10 ? 'Infinity' : 1 / tanValue;
          }
          break;
        case 'ln':
          result = inputValue > 0 ? Math.log(inputValue) : 'Error: Invalid input';
          break;
        case 'log':
          result = inputValue > 0 ? Math.log10(inputValue) : 'Error: Invalid input';
          break;
        case 'factorial':
          result = calc.factorial(inputValue);
          break;
        case '1/x':
          result = inputValue !== 0 ? 1 / inputValue : 'Error: Division by zero';
          break;
        case 'x²':
          result = calc.power(inputValue, 2);
          break;
        case 'x³':
          result = calc.power(inputValue, 3);
          break;
      }

      // Format result for better display
      if (typeof result === 'number') {
        // Round to 10 decimal places to avoid floating point precision issues
        result = Math.round(result * 10000000000) / 10000000000;
        // If result is effectively an integer, display as integer
        if (Math.abs(result - Math.round(result)) < 1e-10) {
          result = Math.round(result);
        }
      }

      setDisplay(typeof result === 'string' ? result : String(result));
      setWaitingForOperand(true);
      return;
    }

    // For functions that need input, show the symbol and wait for number
    const functionSymbols: { [key: string]: string } = {
      'sqrt': '√(',
      'cbrt': '∛(',
    };

    if (functionSymbols[func]) {
      setDisplay(functionSymbols[func]);
      setPendingFunction(func);
      setWaitingForOperand(true);
    }
  }, [display, angleMode]);

  const Button_Number = ({ children, onClick, className, ...props }: any) => (
    <Button
      variant="calcNumber"
      size="calc"
      className={cn(className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  );

  const Button_Operator = ({ children, onClick, className, ...props }: any) => (
    <Button
      variant="calcOperator"
      size="calc"
      className={cn(className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  );

  const Button_Function = ({ children, onClick, className, ...props }: any) => (
    <Button
      variant="calcFunction"
      size="calc"
      className={cn("text-sm", className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  );

  const Button_Special = ({ children, onClick, className, ...props }: any) => (
    <Button
      variant="calcSpecial"
      size="calc"
      className={cn(className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  );

  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gradient-card border-border shadow-card">
        <CardContent className="p-6">
          {/* Mode Selector */}
          <div className="flex gap-2 mb-6">
            {(['basic', 'scientific', 'conversion'] as const).map((m) => (
              <Button
                key={m}
                variant={mode === m ? "default" : "outline"}
                onClick={() => setMode(m)}
                className={cn(
                  "capitalize",
                  mode === m && "bg-gradient-primary text-primary-foreground shadow-glow"
                )}
              >
                {m}
              </Button>
            ))}
          </div>

          {/* Display */}
          <div className="bg-calc-display rounded-lg p-6 mb-6 shadow-inner">
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">
                {previousValue !== null && operation && `${previousValue} ${operation}`}
                {pendingFunction && 'Enter number...'}
              </div>
              <div className="text-4xl font-mono text-foreground break-all">
                {display}
              </div>
            </div>
          </div>

          {/* Basic Mode */}
          {mode === 'basic' && (
            <div className="grid grid-cols-4 gap-3">
              <Button_Special onClick={clear} className="col-span-2">AC</Button_Special>
              <Button_Operator onClick={() => performOperation('/')}>÷</Button_Operator>
              <Button_Operator onClick={() => performOperation('*')}>×</Button_Operator>

              <Button_Number onClick={() => inputNumber('7')}>7</Button_Number>
              <Button_Number onClick={() => inputNumber('8')}>8</Button_Number>
              <Button_Number onClick={() => inputNumber('9')}>9</Button_Number>
              <Button_Operator onClick={() => performOperation('-')}>−</Button_Operator>

              <Button_Number onClick={() => inputNumber('4')}>4</Button_Number>
              <Button_Number onClick={() => inputNumber('5')}>5</Button_Number>
              <Button_Number onClick={() => inputNumber('6')}>6</Button_Number>
              <Button_Operator onClick={() => performOperation('+')}>+</Button_Operator>

              <Button_Number onClick={() => inputNumber('1')}>1</Button_Number>
              <Button_Number onClick={() => inputNumber('2')}>2</Button_Number>
              <Button_Number onClick={() => inputNumber('3')}>3</Button_Number>
              <Button_Special onClick={calculate} className="row-span-2">=</Button_Special>

              <Button_Number onClick={() => inputNumber('0')} className="col-span-2">0</Button_Number>
              <Button_Number onClick={inputDot}>.</Button_Number>
            </div>
          )}

          {/* Scientific Mode */}
          {mode === 'scientific' && (
            <div className="space-y-3">
              <div className="flex gap-2 justify-center mb-4">
                <Button
                  variant={angleMode === 'deg' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAngleMode('deg')}
                >
                  DEG
                </Button>
                <Button
                  variant={angleMode === 'rad' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAngleMode('rad')}
                >
                  RAD
                </Button>
              </div>

              <div className="grid grid-cols-6 gap-2">
                <Button_Function onClick={() => performFunction('sin')}>sin</Button_Function>
                <Button_Function onClick={() => performFunction('cos')}>cos</Button_Function>
                <Button_Function onClick={() => performFunction('tan')}>tan</Button_Function>
                <Button_Function onClick={() => performFunction('sec')}>sec</Button_Function>
                <Button_Function onClick={() => performFunction('cosec')}>cosec</Button_Function>
                <Button_Function onClick={() => performFunction('cot')}>cot</Button_Function>

                <Button_Function onClick={() => performFunction('ln')}>ln</Button_Function>
                <Button_Function onClick={() => performFunction('log')}>log</Button_Function>
                <Button_Special onClick={clear} className="col-span-4">AC</Button_Special>

                <Button_Function onClick={() => performFunction('sqrt')}>√</Button_Function>
                <Button_Function onClick={() => performFunction('cbrt')}>∛</Button_Function>
                <Button_Function onClick={() => performFunction('x²')}>x²</Button_Function>
                <Button_Function onClick={() => performFunction('x³')}>x³</Button_Function>
                <Button_Function onClick={() => performOperation('**')}>xʸ</Button_Function>
                <Button_Operator onClick={() => performOperation('/')}>÷</Button_Operator>

                <Button_Function onClick={() => performFunction('pi')}>π</Button_Function>
                <Button_Function onClick={() => performFunction('e')}>e</Button_Function>
                <Button_Function onClick={() => performFunction('factorial')}>n!</Button_Function>
                <Button_Function onClick={() => performFunction('1/x')}>1/x</Button_Function>
                <Button_Number onClick={() => inputNumber('(')}>(</Button_Number>
                <Button_Operator onClick={() => performOperation('*')}>×</Button_Operator>

                <Button_Number onClick={() => inputNumber('7')}>7</Button_Number>
                <Button_Number onClick={() => inputNumber('8')}>8</Button_Number>
                <Button_Number onClick={() => inputNumber('9')}>9</Button_Number>
                <Button_Number onClick={() => inputNumber(')')}>)</Button_Number>
                <Button_Number onClick={() => inputNumber('%')}>%</Button_Number>
                <Button_Operator onClick={() => performOperation('-')}>−</Button_Operator>

                <Button_Number onClick={() => inputNumber('4')}>4</Button_Number>
                <Button_Number onClick={() => inputNumber('5')}>5</Button_Number>
                <Button_Number onClick={() => inputNumber('6')}>6</Button_Number>
                <Button_Operator onClick={() => performOperation('+')}>+</Button_Operator>
                <Button_Special onClick={calculate} className="col-span-2">=</Button_Special>

                <Button_Number onClick={() => inputNumber('1')}>1</Button_Number>
                <Button_Number onClick={() => inputNumber('2')}>2</Button_Number>
                <Button_Number onClick={() => inputNumber('3')}>3</Button_Number>
                <Button_Number onClick={() => inputNumber('0')} className="col-span-2">0</Button_Number>
                <Button_Number onClick={inputDot}>.</Button_Number>
              </div>
            </div>
          )}

          {/* Conversion Mode */}
          {mode === 'conversion' && (
            <div className="space-y-4">
              <div className="text-center text-lg font-semibold text-foreground mb-4">
                Unit Conversion
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-md font-medium text-foreground">Length</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <Button_Function onClick={() => {}}>m</Button_Function>
                    <Button_Function onClick={() => {}}>cm</Button_Function>
                    <Button_Function onClick={() => {}}>mm</Button_Function>
                    <Button_Function onClick={() => {}}>in</Button_Function>
                    <Button_Function onClick={() => {}}>ft</Button_Function>
                    <Button_Function onClick={() => {}}>km</Button_Function>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-md font-medium text-foreground">Temperature</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <Button_Function onClick={() => {}}>°C</Button_Function>
                    <Button_Function onClick={() => {}}>°F</Button_Function>
                    <Button_Function onClick={() => {}}>K</Button_Function>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-3 mt-6">
                <Button_Number onClick={() => inputNumber('7')}>7</Button_Number>
                <Button_Number onClick={() => inputNumber('8')}>8</Button_Number>
                <Button_Number onClick={() => inputNumber('9')}>9</Button_Number>
                <Button_Special onClick={clear}>AC</Button_Special>

                <Button_Number onClick={() => inputNumber('4')}>4</Button_Number>
                <Button_Number onClick={() => inputNumber('5')}>5</Button_Number>
                <Button_Number onClick={() => inputNumber('6')}>6</Button_Number>
                <Button_Special onClick={calculate}>=</Button_Special>

                <Button_Number onClick={() => inputNumber('1')}>1</Button_Number>
                <Button_Number onClick={() => inputNumber('2')}>2</Button_Number>
                <Button_Number onClick={() => inputNumber('3')}>3</Button_Number>
                <Button_Number onClick={inputDot}>.</Button_Number>

                <Button_Number onClick={() => inputNumber('0')} className="col-span-4">0</Button_Number>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}