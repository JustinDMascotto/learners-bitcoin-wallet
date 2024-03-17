import { useAppState } from "./AppState"

export const DisplayKeys = () => {
    const { state } = useAppState();

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