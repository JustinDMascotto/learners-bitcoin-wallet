import * as wallet from './Wallet'
import React, { useEffect, useState } from "react"
import * as electrumClient from '../../services/electrumClient'
import { RawTransaction, RawTransactionResult } from '../../services/model/raw-transaction'
import { viewInDenomination } from '../../utils/denominationUtils'
import { AmmountDenomination } from '../../models/settings'

interface TransactionViewerProps {
    selectedUtxos: wallet.SelectedUtxoMap,
    electrsProxyHost: string,
    denomination: AmmountDenomination
}

export const TransactionViewer: React.FC<TransactionViewerProps> = ({selectedUtxos,electrsProxyHost,denomination}) => {
    const [utxoToView,setUtxoToView] = useState('');
    const [viewedTransaction,setViewedTransaction] = useState<RawTransaction>();

    const handleUtxoSelect = (utxoHash:string, checked:boolean) => {
        if(checked) {
            setUtxoToView(utxoHash);
        } else {
            setUtxoToView('');
        }
    };

    useEffect(() => {
        const fetchData = async (utxoHash: string) : Promise<RawTransaction | undefined> => {
            let transaction: RawTransaction | undefined
            if(utxoHash === ''){
                transaction = undefined;
                setViewedTransaction(transaction);
            } else {
                transaction = await electrumClient.getRawTransaction(utxoHash,electrsProxyHost);
                setViewedTransaction(transaction);
            }
            return transaction;
        };

        fetchData(utxoToView);
    },[utxoToView]);

    return (
        <div>
            Selected Utxos:
            <ul>
            {Object.keys(selectedUtxos).map((row,rowIndex) => (
                <li key={row}>
                    <input
                        type="checkbox"
                        checked={utxoToView === row}
                        onChange={(e) => handleUtxoSelect(row, e.target.checked)}
                    />
                    <label htmlFor={row}>
                        {viewInDenomination(selectedUtxos[row].value,denomination)}
                    </label>
                </li>
            ))}
            </ul>
            <>
            {viewedTransaction !== undefined && (
                <div>
                    {viewedTransaction.hex}
                </div>
            )}
            </>
        </div>
    );
}