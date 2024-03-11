import FieldElement from "./FieldElement";


test('Can add', () => {
    var a = new FieldElement(BigInt(7), BigInt(13));
    var b = new FieldElement(BigInt(12), BigInt(13));
    var c = new FieldElement(BigInt(6), BigInt(13));
    expect(a.add(b)).toEqual(c);
});

test('Can subtract', () => {
    var a = new FieldElement(BigInt(29), BigInt(31));
    var b = new FieldElement(BigInt(4), BigInt(31));
    var c = new FieldElement(BigInt(25), BigInt(31));
    expect(a.subtract(b)).toEqual(c);
});

test('Can multiply', () => {
    var a = new FieldElement(BigInt(3), BigInt(13));
    var b = new FieldElement(BigInt(12), BigInt(13));
    var c = new FieldElement(BigInt(10), BigInt(13));
    expect(a.multiply(b)).toEqual(c);
});

test('Can exponential', () => {
    var a = new FieldElement(BigInt(17), BigInt(31));
    expect(a.pow(BigInt(3))).toStrictEqual(new FieldElement(BigInt(15), BigInt(31)));

    a = new FieldElement(BigInt(5), BigInt(31));
    var b = new FieldElement(BigInt(18), BigInt(31));
    expect(a.pow(BigInt(5)).multiply(b)).toEqual(new FieldElement(BigInt(16), BigInt(31)));

    a = new FieldElement(BigInt(7), BigInt(13));
    b = new FieldElement(BigInt(8), BigInt(13));
    expect(a.pow(BigInt(-3))).toEqual(b);
});

test('Can divide', () => {
    var a = new FieldElement(BigInt(3), BigInt(31));
    var b = new FieldElement(BigInt(24), BigInt(31));
    expect(a.divide(b)).toEqual(new FieldElement(BigInt(4), BigInt(31)));
    
    a = new FieldElement(BigInt(17), BigInt(31));
    expect(a.pow(BigInt(-3))).toEqual(new FieldElement(BigInt(29), BigInt(31)));
    
    a = new FieldElement(BigInt(4), BigInt(31));
    b = new FieldElement(BigInt(11), BigInt(31));
    expect(a.pow(BigInt(-4)).multiply(b)).toEqual(new FieldElement(BigInt(13), BigInt(31)));
});