import { RawTransaction } from "../../services/model/raw-transaction";
import { parseVarInt, HexStreamReader } from "../parseUtils";
import { Script } from "../../services/model/script";

export const parseTransaction = async (hex: string): Promise<Record<string,any>> => {
    if (hex.length % 2 !== 0) {
        throw new Error('Hex string must have an even length');
    }
    
    let record: Record<string,any> = {}

    const reader = new HexStreamReader(hex);
    const version = reader.readLE2D(4);
    record['version'] = version
    let isSegwit = false

    // segwit marker
    if(reader.peek(1) === "00" ) {
        isSegwit = true
        // remove the marker
        const segwitMarker = reader.read(1);
        // segwit flag, dont know what it does yet
        const segwitFlag = reader.read(1);
    }
    
    let numInputs = parseVarInt(reader);
    record['numInputs'] = numInputs

    const inputs = [];
    if(!isSegwit){
        for(let i=0;i<numInputs;i++){
            // need to implement
        }
    } else {
        // previous transaction id little endian
        const previousTransactionId = reader.read(32);
        record['previousTransactionId'] = previousTransactionId;
        // previous transaction index
        const previousTransactionIndex = reader.readLE2D(4);
        record['previousTransactionIndex'] = previousTransactionIndex;
        // segwit script sig
        const segwitScriptSig = reader.read(1);
        record['scriptSig'] = segwitScriptSig;
        // sequence
        const sequence = reader.read(4);
        record['sequence'] = sequence;
        // number of outputs
        const numOutputs = parseVarInt(reader);
        record['numOutputs'] = numOutputs;
        const outputs: any[] = []
        for(let i = 0; i<numOutputs; i++){
            let output: Record<string,any> = {}
            // output ammounts
            const outputAmmounts = reader.readLE2D(8);
            output['outputAmounts'] = outputAmmounts;
            let script = new Script([]).parse(reader);
            output['script'] = script
            outputs.push(output);
        }
        record['outputs'] = outputs;
        const txinwitnessNum = reader.readLE2D(1);
        const txinwitnessData: string[] = [];
        for(let i =0; i<txinwitnessNum; i++) {
            // not sure if this should be a variable int or just an int
            const witnessDataLength = reader.readLE2D(1);
            const witnessData = reader.read(witnessDataLength);
            txinwitnessData.push(witnessData);
        }
        record['txinwitness'] = txinwitnessData
        record['locktime'] = reader.readLE2D(4);
        if(reader._hex.length != 0){
            console.error('Should have read all bytes');
        }
    }
    
    return record;
}