import { createHash } from "crypto";

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

export function intToLittleEndian(value: number, length: number): Uint8Array {
    const result = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      result[i] = value & 0xff;
      value >>= 8;
    }
    return result;
}

export function uint8ArrayToHexString(uint8Array: Uint8Array): string {
    return Array.from(uint8Array)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
}

export function littleEndianToBigEndian(littleEndianHex: string): string {
    // Ensure the hex string has an even length
    if (littleEndianHex.length % 2 !== 0) {
      throw new Error('Hex string must have an even length');
    }
  
    // Split the hex string into byte pairs
    const bytePairs = [];
    for (let i = 0; i < littleEndianHex.length; i += 2) {
      bytePairs.push(littleEndianHex.slice(i, i + 2));
    }
  
    // Reverse the order of the byte pairs
    bytePairs.reverse();
  
    // Join the reversed byte pairs back into a string
    return bytePairs.join('');
  }

  /**
 * Hashes the input data using SHA-256 twice.
 * @param data - The data to hash.
 * @returns A Uint8Array containing the double SHA-256 hash.
 */
export function hash256(data: Uint8Array): Uint8Array {
  const sha256 = (data: Uint8Array): Uint8Array => {
    return createHash('sha256').update(data).digest();
  };
  return sha256(sha256(data));
}