import { useEffect, useState } from "react"
import { useAppState } from "../../components/AppState"
import { Address, getAddressesForAccount, getAddressP2WPKH } from '../../utils/addressUtils'
import SidePanel from "../../components/SidePanel";
import * as electrumClient from '../../services/electrumClient'
import { UtxoViewer } from "./UtxoViewer";


interface TableRow extends Address {
    amountInt: number | undefined,
    utxoInt: electrumClient.ListUnspentResponseElement[] | undefined,
    amountExt: number | undefined,
    utxoExt: electrumClient.ListUnspentResponseElement[] | undefined,
    isExpanded: boolean,
    selectedUtxos?: Set<number>
}

export type SelectedUtxoMap = {
    [key:string]:electrumClient.ListUnspentResponseElement;
};


export const Wallet = () => {
    const { state } = useAppState();

    const [ selectedUtxos, setSelectedUtxos ] = useState<SelectedUtxoMap>({});

    return (
        <div>
            <SidePanel></SidePanel>
            <UtxoViewer
                selectedUtxos={selectedUtxos}
                setSelectedUtxos={setSelectedUtxos}
                keys={state.keys!}
                addressType={state.settings.addressType}
                electrsProxyHost={state.settings.electrsProxyHost}
            />
        </div>
    );
}