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
    vin: Input[]
    // outputs
    vout: Output[]
    // The transaction's weight, which is between vsize * 4 - 3 and vsize * 4
    weight: number
}

export interface Input {
    // The script signature object
    scriptSig: ScriptSig
    sequence: number
    // The transaction ID from which this input originates
    txid: string
    // An array of hex-encoded witness data (if any).
    txinwitness: string[]
    // The output number from the previous transaction
    vout: number
    
}

export interface ScriptSig {
    // The assembly representation of the script.
    asn: string
    // The hex-encoded script.
    hex: string
}

export interface Output {
    // The index of the output.
    n: number
    // The script public key object
    scriptPubKey: ScriptPubKey
    // The value in BTC
    value: number
}

export interface ScriptPubKey {
    address: string
    // The assembly representation of the script.
    asm: string
    // The hex-encoded script.
    hex: string
    // The type of script, e.g., 'pubkeyhash'
    type: string
    // The number of required signatures
    reqSigs: number
}