export interface RawTransactionResult {
    result: RawTransaction
}
  
export interface RawTransaction {
    blockHash: string
    blocktime: number
    confirmations: number
    hash: string
    hex: string
    in_active_chain: boolean
    locktime: number
    size: number
    time: number
    txid: string
    version: number
    vin: Input[]
    vsize: number
    weight: number
}

export interface Input {
    scriptSig: ScriptSig
    sequence: number
    txid: string
    txinwitness: string[]
    vout: number
    
}

export interface ScriptSig {
    asn: string
    hex: string
}

export interface Output {
    n: number
    scriptPubKey: ScriptPubKey
    value: number
}

export interface ScriptPubKey {
    address: string
    asm: string
    hex: string
    type: string
}