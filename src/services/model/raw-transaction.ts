import { intToLittleEndian, littleEndianToBigEndian, uint8ArrayToHexString, hash256 } from "../../utils/byteUtils"
import { HexStreamReader, concatUint8Arrays, hexStringToUint8Array, reverseUint8Array, parseVarInt, encodeVarint } from "../../utils/parseUtils"
import { getRawTransaction } from "../electrumClient"
import { Script } from "./script"
import * as bitcoin from 'bitcoinjs-lib'

export interface RawTransactionResult {
    result: RawTransaction
}
  
export interface RawTransaction {
    // The hash of the block that includes this transaction.
    blockHash: string
    // The block time expressed in UNIX epoch time.
    blocktime: number
    // The number of confirmations for the transaction.
    confirmations: number
    // The transaction hash, which may differ from txid for witness transactions.
    hash: string
    // The serialized, hex-encoded data of the transaction.
    hex: string
    // Indicates whether the specified block is in the active chain or not. This field is only present if the blockhash argument is explicitly provided.
    in_active_chain: boolean
    // block height at which this transaction is valid
    locktime: number
    // The serialized transaction size in bytes.
    size: number
    // The virtual transaction size, which differs from size for witness transactions.
    vsize: number
    // same as blocktime
    time: number
    // The transaction ID (same as provided).
    txid: string
    version: number
    // inputs
    vin: IInput[]
    // outputs
    vout: IOutput[]
    // The transaction's weight, which is between vsize * 4 - 3 and vsize * 4
    weight: number
}

export interface Transaction {
    version: number
    vin: IInput[]
    vout: IOutput[]
    locktime: number
    segwitMarkerAndFlag: string | undefined

    id():string
}

export class Tx implements Transaction {
    version: number
    vin: IInput[]
    vout: IOutput[]
    locktime: number
    segwitMarkerAndFlag: string | undefined

    constructor(
        version:number,
        vin:IInput[],
        vout:IOutput[],
        locktime:number,
        segwitMarkerAndFlag:string|undefined=undefined
    ){
        this.version = version;
        this.vin = vin;
        this.vout = vout;
        this.locktime = locktime;
        this.segwitMarkerAndFlag = segwitMarkerAndFlag;
    }

    /**
   * Human-readable hexadecimal of the transaction hash.
   * @returns The transaction hash as a hex string.
   */
    id(): string {
        return Buffer.from(this.hash()).toString('hex');
    }

  /**
   * Binary hash of the legacy serialization.
   * @returns A Uint8Array containing the binary hash of the legacy serialization.
   */
    hash(): Uint8Array {
        return hash256(this.serializeLegacy()).reverse();
    }

    async fee(electrsProxyHost:string): Promise<number> {
        // Initialize input sum and output sum
        let inputSum = 0;
        let outputSum = 0;
    
        // Use TxIn.value() to sum up the input amounts
        for (const tx_in of this.vin) {
          inputSum += await TxIn.value(tx_in.txid,tx_in.vout,electrsProxyHost);
        }
    
        // Use TxOut.amount to sum up the output amounts
        for (const tx_out of this.vout) {
          outputSum += tx_out.value;
        }
    
        // Fee is input sum - output sum
        return inputSum - outputSum;
    }


    serialize(): Uint8Array {
        return this.segwitMarkerAndFlag == '0001' ? this.serializeSegwit() : this.serializeLegacy();
    }

    serializeSegwit():Uint8Array {
        let result = intToLittleEndian(this.version, 4);
        result = concatUint8Arrays(result, new Uint8Array([0x00, 0x01])); // Segwit marker and flag
        result = concatUint8Arrays(result, encodeVarint(this.vin.length));
        for (const txIn of this.vin) {
            result = concatUint8Arrays(result, txIn.serialize());
        }
        result = concatUint8Arrays(result, encodeVarint(this.vout.length));
        for (const txOut of this.vout) {
            result = concatUint8Arrays(result, txOut.serialize());
        }
        for (const txIn of this.vin) {
            result = concatUint8Arrays(result, encodeVarint(txIn.txinwitness!.length));
            for (const item of txIn.txinwitness!) {
                // in the case where witness item length was 0, we appended 0 to the list which is a number
                if (typeof item === 'number') {
                    result = concatUint8Arrays(result, intToLittleEndian(item, 1));
                } else {
                    result = concatUint8Arrays(result, encodeVarint(item.length));
                    result = concatUint8Arrays(result, item);
                }
            }
        }
        result = concatUint8Arrays(result, intToLittleEndian(this.locktime, 4));
        return result;
    }

    serializeLegacy(): Uint8Array {
        let result = intToLittleEndian(this.version, 4);
        result = concatUint8Arrays(result, encodeVarint(this.vin.length));
        for (const txIn of this.vin) {
            result = concatUint8Arrays(result, txIn.serialize());
        }
        result = concatUint8Arrays(result, encodeVarint(this.vout.length));
        for (const txOut of this.vout) {
            result = concatUint8Arrays(result, txOut.serialize());
        }
        result = concatUint8Arrays(result, intToLittleEndian(this.locktime, 4));
        return result;
    }

    static parse(reader:HexStreamReader):Tx {
        if(reader.peek(1,4).length == 0){
            return Tx.parse_segwit(reader);
        } else {
            return Tx.parse_legacy(reader);
        }
    }

    static parse_segwit(reader:HexStreamReader):Tx {
        const version = reader.readLE2D(4);
        let segwitMarkerAndFlag = reader.read(2);
        // segwit marker
        const inputs: IInput[] = [];
        const outputs: IOutput[] = [];
        
        const numInputs = parseVarInt(reader);
        for(let i =0;i<numInputs;i++){
            let input = TxIn.parse(reader);
            inputs.push(input);
        }
        const numOutputs = parseVarInt(reader);
        for(let i = 0; i<numOutputs; i++){
            // output ammounts
            let txOut = TxOut.parse(reader);
            txOut.n = i;
            outputs.push(txOut);
        }

        for(let i = 0; i<numInputs; i++){
            const txinwitnessNum = reader.readLE2D(1);
            const txinwitnessData: any[] = [];
            for(let i =0; i<txinwitnessNum; i++) {
                // not sure if this should be a variable int or just an int
                const witnessDataLength = reader.readLE2D(1);
                let witnessData;
                if(witnessDataLength===0){
                    witnessData = 0;
                } else {
                    witnessData = hexStringToUint8Array(reader.read(witnessDataLength));
                }
                txinwitnessData.push(witnessData);
            }
            inputs[i].txinwitness = txinwitnessData;
        }
        
        const locktime = reader.readLE2D(4);
        return new Tx(version,inputs,outputs,locktime,segwitMarkerAndFlag);
    }

    static parse_legacy(reader:HexStreamReader):Tx {

    }

}

export interface IInput {
    // The script signature object
    scriptSig: IScriptSig
    sequence: number
    // The transaction ID from which this input originates
    txid: string
    // An array of hex-encoded witness data (if any).
    txinwitness: any[] | undefined
    // The output number from the previous transaction
    vout: number

    serialize():Uint8Array
}

export class TxIn implements IInput {
    // The script signature object
    scriptSig: IScriptSig
    sequence: number
    // The transaction ID from which this input originates
    txid: string
    // An array of hex-encoded witness data (if any).
    txinwitness: any[] | undefined
    // The output number from the previous transaction
    vout: number

    constructor(
        scriptSig:IScriptSig,
        sequence:number,
        txid:string,
        vout:number,
        txiwitness:any[]|undefined=undefined
    ){
        this.scriptSig = scriptSig;
        this.sequence = sequence;
        this.txid = txid;
        this.txinwitness = txiwitness;
        this.vout = vout
    }

    // used to get the value of the input, value is denominated in btc not satoshi
    static async value(transactionId:string,index:number,electrsProxyHost:string):Promise<number> {
        const tx = await getRawTransaction(transactionId,electrsProxyHost);
        return tx['vout'][index].value * 100_000_000;
    }

    // Get the ScriptPubKey by looking up the tx hash Returns a Script object
    static async scriptPubKey(transactionId:string,index:number,electrsProxyHost:string):Promise<IScriptPubKey> {
        const tx = await getRawTransaction(transactionId,electrsProxyHost);
        return tx['vout'][index].scriptPubKey
    }

    serialize():Uint8Array {
        // Serialize prev_tx, little endian
        const txid = hexStringToUint8Array(this.txid);
        let result = reverseUint8Array(txid);
        // Serialize prev_index, 4 bytes, little endian
        result = concatUint8Arrays(result, intToLittleEndian(this.vout, 4));
        // Serialize the script_sig
        result = concatUint8Arrays(result, this.scriptSig.serialize());
        // Serialize sequence, 4 bytes, little endian
        result = concatUint8Arrays(result, intToLittleEndian(this.sequence, 4));

        return result;
    }

    static parse(hex:HexStreamReader):TxIn {
        const txidLittleEndian = hex.read(32);
        const txid = littleEndianToBigEndian(txidLittleEndian);
        const vout = hex.readLE2D(4);
        const segwitScriptSig = ScriptSig.parse(hex);
        const sequence = hex.readLE2D(4);
        return new TxIn(segwitScriptSig,sequence,txid,vout);
    }
}

export interface IScriptSig {
    // The assembly representation of the script.
    asm: string | undefined
    // The hex-encoded script.
    hex: string

    serialize():Uint8Array
}

export class ScriptSig implements IScriptSig {
    asm: string | undefined
    hex: string
    _script: Script

    constructor(script:Script) {
        this._script = script;
        this.hex = uint8ArrayToHexString(script.serialize());
    }

    serialize():Uint8Array {
        return this._script.serialize();
    }

    static parse(hex:HexStreamReader):ScriptSig {
        return new ScriptSig(Script.parse(hex));
    }
}

export interface IOutput {
    // The index of the output.
    n: number | undefined
    // The script public key object
    scriptPubKey: IScriptPubKey
    // The value in BTC
    value: number

    serialize():Uint8Array
}

export class TxOut implements IOutput {
    // The index of the output.
    n: number | undefined
    // The script public key object
    scriptPubKey: IScriptPubKey
    // The value in BTC
    value: number

    constructor(scriptPubKey: IScriptPubKey,value:number,n:number|undefined=undefined){
        this.scriptPubKey = scriptPubKey;
        this.value = value;
        this.n = n
    }

    static parse(hex:HexStreamReader):IOutput {
        const outputAmmounts = hex.readLE2D(8);
        let script = ScriptPubKey.parse(hex);
        return new TxOut(script,outputAmmounts);
    }

    serialize(): Uint8Array {
        // Serialize amount, 8 bytes, little endian
        let result = intToLittleEndian(this.value, 8);
        // Serialize the scriptPubKey
        result = concatUint8Arrays(result, this.scriptPubKey.serialize());
        return result;
    }
}

export interface IScriptPubKey {
    address: string | undefined
    // The assembly representation of the script.
    asm: string | undefined
    // The hex-encoded script.
    hex: string
    // The type of script, e.g., 'pubkeyhash'
    type: string | undefined
    // The number of required signatures
    reqSigs: number | undefined

    serialize():Uint8Array
}

export class ScriptPubKey implements IScriptPubKey {
    address: string | undefined
    // The assembly representation of the script.
    asm: string | undefined
    // The hex-encoded script.
    hex: string 
    // The type of script, e.g., 'pubkeyhash'
    type: string | undefined
    // The number of required signatures
    reqSigs: number | undefined

    _script: Script

    constructor(script:Script){
        this.hex = uint8ArrayToHexString(script.serialize());
        this._script = script;
    }

    serialize():Uint8Array {
        return this._script.serialize()
    }

    static parse(hex: HexStreamReader): IScriptPubKey {
        const script = Script.parse(hex);
        // todo come up with tostirng method for asm, able to set type
        return new ScriptPubKey(script);
    }
}
