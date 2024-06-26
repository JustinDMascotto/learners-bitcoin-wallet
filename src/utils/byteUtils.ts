export function littleEndianToDecimal(littleEndian:string):number {
    // Ensure the hex string is an even length
    if (littleEndian.length % 2 !== 0) {
        throw new Error("Invalid hex string");
    }

    // Split the hex string into an array of bytes
    const bytes = littleEndian.match(/.{2}/g)!;

    // Reverse the array of bytes to convert from little-endian to big-endian
    const reversedBytes = bytes.reverse();

    // Join the reversed array back into a string
    const bigEndianHexString = reversedBytes.join('');

    // Convert the big-endian hex string to a decimal number
    const decimalNumber = parseInt(bigEndianHexString, 16);

    return decimalNumber;
}