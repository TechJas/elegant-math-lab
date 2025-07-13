// Mathematical functions based on the Python calculator code

// Arithmetic functions
export function add(x: number, y: number): number {
  const result = x + y;
  return Number.isInteger(result) ? Math.round(result) : result;
}

export function subtract(x: number, y: number): number {
  const result = x - y;
  return Number.isInteger(result) ? Math.round(result) : result;
}

export function multiply(x: number, y: number): number {
  const result = x * y;
  return Number.isInteger(result) ? Math.round(result) : result;
}

export function divide(x: number, y: number): number | string {
  if (y === 0) {
    return "Error: Division by zero";
  }
  const result = x / y;
  return Number.isInteger(result) ? Math.round(result) : result;
}

export function floorDivide(x: number, y: number): number | string {
  if (y === 0) {
    return "Error: Division by zero";
  }
  return Math.floor(x / y);
}

export function power(x: number, y: number): number {
  const result = Math.pow(x, y);
  return Number.isInteger(result) ? Math.round(result) : result;
}

// Trigonometric functions
export function sinDeg(x: number): number {
  return Math.sin((x * Math.PI) / 180);
}

export function cosDeg(x: number): number {
  return Math.cos((x * Math.PI) / 180);
}

export function tanDeg(x: number): number {
  return Math.tan((x * Math.PI) / 180);
}

export function asinDeg(x: number): number | string {
  if (x < -1 || x > 1) {
    return "Error: Domain error";
  }
  return (Math.asin(x) * 180) / Math.PI;
}

export function acosDeg(x: number): number | string {
  if (x < -1 || x > 1) {
    return "Error: Domain error";
  }
  return (Math.acos(x) * 180) / Math.PI;
}

export function atanDeg(x: number): number {
  return (Math.atan(x) * 180) / Math.PI;
}

export function sinhVal(x: number): number {
  return Math.sinh(x);
}

export function coshVal(x: number): number {
  return Math.cosh(x);
}

export function tanhVal(x: number): number {
  return Math.tanh(x);
}

export function degToRad(x: number): number {
  return (x * Math.PI) / 180;
}

export function radToDeg(x: number): number {
  return (x * 180) / Math.PI;
}

// Root functions
export function squareRoot(x: number): number | string {
  if (x < 0) {
    return "Error: Cannot calculate square root of a negative number";
  }
  return Math.sqrt(x);
}

export function cubicRoot(x: number): number {
  return Math.cbrt(x);
}

export function nthRoot(x: number, n: number): number | string {
  if (n === 0) {
    return "Error: Root cannot be zero";
  }
  if (x < 0 && n % 2 === 0) {
    return "Error: Cannot calculate even root of a negative number";
  }
  return Math.pow(x, 1 / n);
}

export function factorial(x: number): number | string {
  if (!Number.isInteger(x) || x < 0) {
    return "Error: Factorial is only defined for non-negative integers";
  }
  if (x === 0 || x === 1) return 1;
  let result = 1;
  for (let i = 2; i <= x; i++) {
    result *= i;
  }
  return result;
}

// Logarithm functions
export function productRule(x: number, y: number): number | string {
  if (x <= 0 || y <= 0) {
    return "Error: Logarithm of a non-positive number is undefined";
  }
  return Math.log10(x) + Math.log10(y);
}

export function quotientRule(x: number, y: number): number | string {
  if (x <= 0 || y <= 0) {
    return "Error: Logarithm of a non-positive number is undefined";
  }
  return Math.log10(x) - Math.log10(y);
}

export function powerRule(x: number, power: number): number | string {
  if (x <= 0) {
    return "Error: Logarithm of a non-positive number is undefined";
  }
  return power * Math.log10(x);
}

export function changeOfBase(x: number, base: number): number | string {
  if (x <= 0 || base <= 0 || base === 1) {
    return "Error: Invalid input for logarithm";
  }
  return Math.log10(x) / Math.log10(base);
}

export function baseIdentity(base: number): number | string {
  if (base <= 0 || base === 1) {
    return "Error: Invalid base for logarithm";
  }
  return 1;
}

export function logOfOne(base: number): number | string {
  if (base <= 0 || base === 1) {
    return "Error: Invalid base for logarithm";
  }
  return 0;
}

// Common log values
export const commonLogValues: Record<number, number> = {
  2: 0.3010,
  3: 0.4771,
  4: 0.6021,
  5: 0.6990,
  6: 0.7781,
  7: 0.8451,
  8: 0.9031,
  9: 0.9542,
  10: 1.0000
};

// Unit conversion functions
export function metersToOther(meters: number, unit: string): number {
  const conversions: Record<string, number> = {
    cm: 100,
    mm: 1000,
    in: 39.3701,
    km: 0.001,
    ft: 3.28084
  };
  return meters * (conversions[unit] || 1);
}

export function toMeters(value: number, unit: string): number {
  const conversions: Record<string, number> = {
    cm: 0.01,
    mm: 0.001,
    in: 0.0254,
    km: 1000,
    ft: 0.3048
  };
  return value * (conversions[unit] || 1);
}

// Temperature conversions
export function celsiusToFahrenheit(c: number): number {
  return (c * 9) / 5 + 32;
}

export function celsiusToKelvin(c: number): number {
  return c + 273.15;
}

export function fahrenheitToCelsius(f: number): number {
  return ((f - 32) * 5) / 9;
}

export function kelvinToCelsius(k: number): number {
  return k - 273.15;
}

export function fahrenheitToKelvin(f: number): number {
  return celsiusToKelvin(fahrenheitToCelsius(f));
}

export function kelvinToFahrenheit(k: number): number {
  return celsiusToFahrenheit(kelvinToCelsius(k));
}

// Utility functions
export function formatResult(value: number | string, decimalPlaces?: number): string {
  if (typeof value === "string") return value;
  if (decimalPlaces !== undefined) {
    return value.toFixed(decimalPlaces);
  }
  return Number.isInteger(value) ? value.toString() : value.toPrecision(10);
}