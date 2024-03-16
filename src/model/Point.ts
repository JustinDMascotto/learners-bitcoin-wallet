import FieldElement from "./FieldElement";

class Point {
    x: FieldElement | null;
    y: FieldElement | null;
    a: FieldElement;
    b: FieldElement;

    constructor(x: FieldElement | null, y: FieldElement | null, a: FieldElement, b: FieldElement) {
        this.a = a;
        this.b = b;
        this.x = x;
        this.y = y;

        if (this.x === null && this.y === null) {
            return; // Represents the point at infinity
        }

        if (!this.y!.pow(BigInt(2)).equals(this.x!.pow(BigInt(3)).add(a.multiply(this.x!)).add(b))) {
            throw Error(`Point (${x}, ${y}) is not on the curve`);
        }
    }

    equals(other: Point): boolean {
        return (this.x === null && other.x === null) ||
               (this.x !== null && other.x !== null && this.y !== null && other.y !== null &&
                this.x.equals(other.x) && this.y.equals(other.y) &&
                this.a.equals(other.a) && this.b.equals(other.b));
    }

    add(other: Point): Point {
        if (!this.a.equals(other.a) || !this.b.equals(other.b)) {
            throw new TypeError("Points are not on the same curve");
        }

        // Point at infinity cases
        if (this.x === null || this.y === null) return other;
        if (other.x === null || other.y === null) return this;

        // Case 1: self.x == other.x, self.y != other.y
        if (this.x.equals(other.x) && !this.y.equals(other.y)) {
            return new Point(null, null, this.a, this.b); // Point at infinity
        }

        // Case 2: self.x != other.x
        if (!this.x.equals(other.x)) {
            const s = (other.y.subtract(this.y)).divide(other.x.subtract(this.x));
            const x = s.pow(BigInt(2)).subtract(this.x).subtract(other.x);
            const y = s.multiply(this.x.subtract(x)).subtract(this.y);
            return new Point(x, y, this.a, this.b);
        }

        // Case 3: self == other
        if (this.equals(other) && !this.y.equals(new FieldElement(BigInt(0), this.y.prime))) {
            const s = (this.x.pow(BigInt(2)).multiply(new FieldElement(BigInt(3), this.a.prime)).add(this.a))
                      .divide(this.y.multiply(new FieldElement(BigInt(2), this.b.prime)));
            const x = s.pow(BigInt(2)).subtract(this.x.multiply(new FieldElement(BigInt(2), this.x.prime)));
            const y = s.multiply(this.x.subtract(x)).multiply(this.y);
            return new Point(x, y, this.a, this.b);
        }

        // Case 4: self == other and tangent is vertical
        return new Point(null, null, this.a, this.b); // Point at infinity
    }

    multiply(coefficient: bigint): Point {
        let coef = coefficient;
        let current: Point = this;
        let result: Point = new Point(null, null, this.a, this.b); // Start with point at infinity

        while (coef > BigInt(0)) {
            if (coef & BigInt(1)) {
                result = result.add(current);
            }
            current = current.add(current);
            coef >>= BigInt(1);
        }

        return result;
    }

    toString(): string {
        if (this.x === null || this.y === null) {
            return "Point(infinity)";
        }
        return `Point(${this.x.toString()}, ${this.y.toString()}) FieldElement(${this.x.prime})`;
    }
}

export default Point