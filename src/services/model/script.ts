import { HexStreamReader, parseVarInt } from "../../utils/parseUtils";

export class Script {

    cmds: any[]

    constructor(cmds: any[] | undefined) {
        if(cmds == undefined){
            this.cmds = [];
        } else {
            this.cmds = cmds;
        }
    }

    add(cmd: any) {
        return new Script([...this.cmds, cmd])
    }

    parse(hex: HexStreamReader): Script {
        const length = parseVarInt(hex);
        const cmds: any[] = []
        let count = 0
        while(count<length) {
            let value = hex.read(1);
            count += 1;
            let currentByte = parseInt(value,16);
            if (currentByte >= 1 && currentByte <= 75){
                let n = currentByte;
                let nextCmd = hex.read(n);
                cmds.push(nextCmd);
                count += n;
            } else if(currentByte == 76) {
                let dataLength = hex.readLE2D(1);
                let data = hex.read(dataLength);
                cmds.push(data);
                count += dataLength + 1;
            } else if(currentByte == 77) {
                let dataLength = hex.readLE2D(2);
                let data = hex.read(dataLength);
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