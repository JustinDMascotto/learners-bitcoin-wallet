import { useAppState } from "./AppState"
import { useState, useEffect } from 'react'
import * as bip39 from 'bip39';

export const DisplayKeys = () => {
    const { state } = useAppState();
    const [mnemonic,setMnemonic] = useState('')

    useEffect(() => {
        bip39.generateMnemonic()
    },[state.keys])

    return (
        <div>
            {state.keys !== undefined && (
                <div>
                    <div>
                        WIF: {state.keys?.hdRoot.toWIF()}
                    </div>
                    <div>
                        Extended pubkey: {state.keys.hdRoot.neutered().toBase58()}
                    </div>    
                    <div>
                        Extended privkey: {state.keys.hdRoot.toBase58()}
                    </div>
                    <div>
                        Mnemonic phrase: {mnemonic}
                    </div>
                </div>
            )}
        </div>
    )
}