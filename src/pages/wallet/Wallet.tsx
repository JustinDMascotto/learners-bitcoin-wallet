import { useState } from "react"
import { useAppState } from "../../components/AppState"
import SidePanel from "../../components/SidePanel";
import * as electrumClient from '../../services/electrumClient'
import { UtxoViewer } from "./UtxoViewer";
import { TransactionViewer } from "./TransactionViewer";


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
                denomination={state.settings.ammountDenomination}
            />
            <TransactionViewer 
                selectedUtxos={selectedUtxos}
                electrsProxyHost={state.settings.electrsProxyHost}
                denomination={state.settings.ammountDenomination}>
            </TransactionViewer>
        </div>
    );
}