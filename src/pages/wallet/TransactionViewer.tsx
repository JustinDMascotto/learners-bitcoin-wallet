import * as wallet from './Wallet'
import React, { useEffect, useState } from "react"
import * as electrumClient from '../../services/electrumClient'
import { RawTransaction } from '../../services/model/raw-transaction'
import { viewInDenomination } from '../../utils/denominationUtils'
import { AmmountDenomination } from '../../models/settings'
import { littleEndianToDecimal } from '../../utils/byteUtils'

interface TransactionViewerProps {
    selectedUtxos: wallet.SelectedUtxoMap,
    electrsProxyHost: string,
    denomination: AmmountDenomination
}

interface ColorCodedHex {
    index: number,
    color: string,
    hexSegment: string,
    label: string
}

export const TransactionViewer: React.FC<TransactionViewerProps> = ({selectedUtxos,electrsProxyHost,denomination}) => {
    const [utxoToView,setUtxoToView] = useState('');
    const [viewedTransaction,setViewedTransaction] = useState<RawTransaction>();
    const [colorCodedHex,setColorCodedHex] = useState<ColorCodedHex[]>();

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

    const toColorCodedHex = (hexSegment:string,color:string,label:string,index:number):ColorCodedHex => {
        return {
            index,
            color,
            hexSegment,
            label
        }
    }

    const stringToStream = (text:string) => {
        const encoder = new TextEncoder();
        const uint8Array = encoder.encode(text);
    
        return new ReadableStream({
            start(controller) {
                controller.enqueue(uint8Array);
                controller.close();
            }
        });
    };

    const readSegment = async (reader:ReadableStreamDefaultReader<any>,decoder:TextDecoder,numCharacters:number):Promise<string> => {
        let index = 0;
        let currentSegment = '';
        do {
            let { done, value } = await reader.read()
            if(done){
                index = numCharacters;
                break;
            }
            const chunk = decoder.decode(value, { stream: true });
        } while ( index <= numCharacters )

        return currentSegment;
    }

    useEffect(() => {
        if(viewedTransaction!==undefined){
            // 0-7 is version
            let cursor = 8
            const numInputsVarInt = parseInt(viewedTransaction?.hex.substring(cursor,10),16);
            let numIn: number
            switch(true){
                case numInputsVarInt < 253:
                    numIn = numInputsVarInt
                    cursor = 10;
                    break;
                case viewedTransaction?.hex.substring(8,10) === 'fd':
                    numIn = littleEndianToDecimal(viewedTransaction?.hex.substring(10,14));
                    cursor = 14;
                    break;
                case viewedTransaction?.hex.substring(8,10) === 'fe':
                    numIn = littleEndianToDecimal(viewedTransaction?.hex.substring(10,18));
                    cursor = 20;
                    break;
                case viewedTransaction?.hex.substring(8,10) === 'ff':
                    numIn = littleEndianToDecimal(viewedTransaction?.hex.substring(10,26));
                    cursor = 26
                    break;
            }
            const numInputs = toColorCodedHex(viewedTransaction?.hex.substring(0,8),"red","version",0);
            // 32 bytes = 64 hex char
            const prevTxIdLength = 64;
            const prevTxId = viewedTransaction?.hex.substring(cursor,cursor+prevTxIdLength);
            cursor+=prevTxIdLength;
            // 4 bytes = 8 hex char
            const prevTxIndexLength = 8;
            const prevTxIndex = viewedTransaction?.hex.substring(cursor,cursor+prevTxIndexLength);
            cursor+=prevTxIndexLength;
            
        }
    },[viewedTransaction]);

    const divStyle = {
        maxWidth: '30vw',
        width: '100%',
    }

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
                <div style={divStyle}>
                    {viewedTransaction.hex}
                </div>
            )}
            </>
        </div>
    );
}