import { littleEndianToDecimal, intToLittleEndian } from "./byteUtils";

export const parseVarInt = (hex: HexStreamReader): number => {
    const firstByte = parseInt(hex.read(1),16);
    
    if (firstByte === 0xfd) {
        // Read next 2 bytes
        return hex.readLE2D(2);
    } else if (firstByte === 0xfe) {
        // Read next 4 bytes
        return hex.readLE2D(4);
    } else if (firstByte === 0xff) {
        // Read next 8 bytes
        return hex.readLE2D(8);
    } else {
        // Return the byte as the integer
        return firstByte;
    }
}

export const encodeVarint = (i: number): Uint8Array => {
    if (i < 0xfd) {
        return new Uint8Array([i]);
    } else if (i <= 0xffff) {
        const result = new Uint8Array(3);
        result[0] = 0xfd;
        result.set(intToLittleEndian(i, 2), 1);
        return result;
    } else if (i <= 0xffffffff) {
        const result = new Uint8Array(5);
        result[0] = 0xfe;
        result.set(intToLittleEndian(i, 4), 1);
        return result;
    } else if (i <= 0xffffffffffffffff) {
        const result = new Uint8Array(9);
        result[0] = 0xff;
        result.set(intToLittleEndian(i, 8), 1);
        return result;
    } else {
        throw new Error(`integer too large: ${i}`);
    }
}

export const concatUint8Arrays = (a: Uint8Array, b: Uint8Array): Uint8Array => {
    const result = new Uint8Array(a.length + b.length);
    result.set(a, 0);
    result.set(b, a.length);
    return result;
}

export const reverseUint8Array = (array: Uint8Array): Uint8Array => {
    return new Uint8Array(array).reverse();
}

export const hexStringToUint8Array = (hex: string): Uint8Array => {
    if (hex.length % 2 !== 0) {
      throw new Error('Hex string must have an even length');
    }
  
    const length = hex.length / 2;
    const uint8Array = new Uint8Array(length);
  
    for (let i = 0; i < length; i++) {
      const hexPair = hex.slice(i * 2, i * 2 + 2);
      uint8Array[i] = parseInt(hexPair, 16);
    }
  
    return uint8Array;
  }

export class HexStreamReader {
    _hex: string

    constructor(hex:string){
        this._hex = hex;
    }

    read(numBytes:number):string {
        const charLength = numBytes * 2 // 2 chars = 1 byte
        const value = this._hex.slice(0,charLength);
        this._hex = this._hex.slice(charLength);
        return value;
    }

    readLE2D(numByptes:number):number {
        const hexBytes = this.read(numByptes);
        return littleEndianToDecimal(hexBytes);
    }

    // doesnt consume any chars, they will be read next time when read is called
    peek(numBytes:number,startIndex:number = 0):Uint8Array {
        const charLength = numBytes * 2 // 2 chars = 1 byte
        return hexStringToUint8Array(this._hex.slice(startIndex,charLength));
    }
}