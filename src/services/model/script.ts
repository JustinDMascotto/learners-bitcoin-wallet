import { HexStreamReader, parseVarInt, encodeVarint, concatUint8Arrays, hexStringToUint8Array } from "../../utils/parseUtils";
import { intToLittleEndian } from "../../utils/byteUtils";

export class Script {

    cmds: (number | Uint8Array)[]

    constructor(cmds: (number | Uint8Array)[] | undefined) {
        if(cmds == undefined){
            this.cmds = [];
        } else {
            this.cmds = cmds;
        }
    }

    add(cmd: number | Uint8Array) {
        return new Script([...this.cmds, cmd])
    }

    rawSerialize(): Uint8Array {
        let result: Uint8Array = new Uint8Array(0);

        for (const cmd of this.cmds) {
            if (typeof cmd === 'number') {
                // cmd is an opcode
                result = concatUint8Arrays(result, intToLittleEndian(cmd, 1));
            } else {
                // cmd is an element
                const length = cmd.length;

                if (length < 75) {
                    result = concatUint8Arrays(result, intToLittleEndian(length, 1));
                } else if (length >= 75 && length < 0x100) {
                    result = concatUint8Arrays(result, intToLittleEndian(76, 1));
                    result = concatUint8Arrays(result, intToLittleEndian(length, 1));
                } else if (length >= 0x100 && length <= 520) {
                    result = concatUint8Arrays(result, intToLittleEndian(77, 1));
                    result = concatUint8Arrays(result, intToLittleEndian(length, 2));
                } else {
                    throw new Error('too long an cmd');
                }

                result = concatUint8Arrays(result, cmd);
            }
        }

        return result;
    }

    serialize(): Uint8Array {
        // Get the raw serialization (no prepended length)
        const result = this.rawSerialize();
        // Get the length of the whole thing
        const total = result.length;
        // Encode the total length of the result and prepend it
        return concatUint8Arrays(encodeVarint(total), result);
    }
    

    static parse(hex: HexStreamReader): Script {
        const length = parseVarInt(hex);
        const cmds: any[] = []
        let count = 0
        while(count<length) {
            let value = hex.read(1);
            count += 1;
            let currentByte = parseInt(value,16);
            if (currentByte >= 1 && currentByte <= 75){
                let n = currentByte;
                let nextCmd = hexStringToUint8Array(hex.read(n));
                cmds.push(nextCmd);
                count += n;
            } else if(currentByte == 76) {
                let dataLength = hex.readLE2D(1);
                let data = hexStringToUint8Array(hex.read(dataLength));
                cmds.push(data);
                count += dataLength + 1;
            } else if(currentByte == 77) {
                let dataLength = hex.readLE2D(2);
                let data = hexStringToUint8Array(hex.read(dataLength));
                cmds.push(data);
                count += dataLength + 2;
            } else {
                let opCode = currentByte;
                cmds.push(opCode);
            }
        }
        if (count!=length){
            console.error("could not parse script")
        }
        return new Script(cmds);
    }
}