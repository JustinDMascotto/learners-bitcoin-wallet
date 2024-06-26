import { littleEndianToDecimal } from "./byteUtils";

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
    peek(numBytes:number):string {
        const charLength = numBytes * 2 // 2 chars = 1 byte
        return this._hex.slice(0,charLength);
    }
}