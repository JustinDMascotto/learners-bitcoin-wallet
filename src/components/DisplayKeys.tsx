import { useAppState } from "./AppState"
import { getAddress } from "../utils/addressUtils"
import * as networks from 'bitcoinjs-lib/src/networks';

export const DisplayKeys = () => {
    const { state, dispatch } = useAppState();

    const address = getAddress(state.keys?.hdRoot,networks.testnet)

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
                </div>
            )}
        </div>
    )
}