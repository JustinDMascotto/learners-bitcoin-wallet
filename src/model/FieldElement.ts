class FieldElement {
    num: bigint;
    prime: bigint;
  
    constructor(num: bigint, prime: bigint) {
      if (num < 0 || num >= prime) {
        throw new Error("Num not in field range 0 to prime - 1");
      }
      this.num = num;
      this.prime = prime;
    }
  
    equals(other: FieldElement): boolean {
      return this.prime === other.prime && this.num === other.num;
    }
  
    add(other: FieldElement): FieldElement {
      if (this.prime !== other.prime) {
        throw new Error("Cannot add two numbers in different Fields");
      }
      const num = (this.num + other.num) % this.prime;
      return new FieldElement(num, this.prime);
    }
  
    subtract(other: FieldElement): FieldElement {
      if (this.prime !== other.prime) {
        throw new Error("Cannot subtract two numbers in different Fields");
      }
      const num = (this.num - other.num + this.prime) % this.prime;
      return new FieldElement(num, this.prime);
    }
  
    multiply(other: FieldElement): FieldElement {
      if (this.prime !== other.prime) {
        throw new Error("Cannot multiply two numbers in different Fields");
      }
      const num = (this.num * other.num) % this.prime;
      return new FieldElement(num, this.prime);
    }
  
    pow(exponent: bigint): FieldElement {
      // Note: Using the modulo property of powers: (a^b) % p = ((a % p)^b) % p
      let n = exponent % (this.prime - BigInt(1)); // Ensure exponent is positive for Fermat's Little Theorem
      if (n < 0) n += this.prime - BigInt(1); // Correct if n is negative
      const num = BigInt(powMod(this.num, n, this.prime)); // Custom powMod function to handle big numbers
      return new FieldElement(num, this.prime);
    }
  
    divide(other: FieldElement): FieldElement {
      if (this.prime !== other.prime) {
        throw new Error("Cannot divide two numbers in different Fields");
      }
      // Use Fermat's Little Theorem for division in a finite field: a/b = a * b^(p-2) % p
      const num = (this.num * powMod(other.num, this.prime - BigInt(2), this.prime)) % this.prime;
      return new FieldElement(num, this.prime);
    }

    toString():string{
        return `FieldElement_${this.prime}(${this.num})`
    }
}
  
// Helper function: Performs modular exponentiation (base^exponent % modulus) efficiently
function powMod(base: bigint, exponent: bigint, modulus: bigint): bigint {
    if (modulus === BigInt(1)) return BigInt(0);
    let result = BigInt(1);
    base = base % modulus;
    while (exponent > 0) {
        if (exponent % BigInt(2) === BigInt(1)) {
        result = (result * base) % modulus;
        }
        exponent = exponent >> BigInt(1); // Equivalent to dividing by 2
        base = (base * base) % modulus;
    }
    return result;
}
  
export default FieldElement