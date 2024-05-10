import React, { useEffect, useState } from "react"
import { Address, getAddressesForAccount, getAddressP2WPKH } from '../../utils/addressUtils'
import * as electrumClient from '../../services/electrumClient'
import * as wallet from './Wallet'
import { WalletAddressType } from "../../models/settings";
import { Keys } from "../../models/keys";

interface TableRow extends Address {
    amountInt: number | undefined,
    utxoInt: electrumClient.ListUnspentResponseElement[] | undefined,
    amountExt: number | undefined,
    utxoExt: electrumClient.ListUnspentResponseElement[] | undefined,
    isExpanded: boolean,
    selectedUtxos?: Set<number>
}

interface UtxoViewerProps {
    selectedUtxos: wallet.SelectedUtxoMap
    setSelectedUtxos: (utxos:wallet.SelectedUtxoMap) => void;
    addressType: WalletAddressType,
    keys: Keys,
    electrsProxyHost: string
}

export const UtxoViewer: React.FC<UtxoViewerProps> = ({selectedUtxos, setSelectedUtxos,addressType,keys,electrsProxyHost}) => {
    const [ derivePath, setDerivePath ] = useState("m/0'/0/0");
    const [ account, setAccount ] = useState(0);
    const [ highlighted, setHighlighted ] = useState({rowIndex: 0, colType: ''});
    const [ addresses, setAddresses ] = useState<Address[]>([]);
    const [ tableData, setTableData ] = useState<TableRow[]>([]);
    const [ expandedRows, setExpandedRows ] = useState(new Set());

    const handleUtxoSelect = (
        utxo: electrumClient.ListUnspentResponseElement, 
        checked: boolean) => {
        if(checked){
            const newState = {...selectedUtxos, [utxo.tx_hash]: utxo }
            setSelectedUtxos(newState)
        } else {
            const {[utxo.tx_hash]:_, ...newState } = selectedUtxos;
            setSelectedUtxos(newState);
        }
    }


    useEffect(() => {
        let regex = new RegExp("m/(\\d+)\'{0,1}/\\d+/\\d+");
        if(regex.test(derivePath)) {
            let account = derivePath.match(regex);
            if(account && account[1]) {
                setAccount(parseInt(account[1]));
                let addresses = getAddressesForAccount(parseInt(account[1]),addressType,keys);
                setAddresses(addresses)
                let tableData: TableRow[] = addresses.map( it => (
                    {
                        externalPubAddress: it.externalPubAddress, 
                        internalPubAddress: it.internalPubAddress,
                        amountExt: undefined,
                        utxoExt: undefined,
                        amountInt: undefined,
                        utxoInt: undefined,
                        isExpanded: false
                    }
                ));
                setTableData(tableData)
            }
        } 
    },[derivePath,keys]);

    

    useEffect(() => {
        const fetchData = async (address: string) : Promise<electrumClient.ListUnspentResponseElement[]> => {
            let utxos = await electrumClient.getUtxos(address,keys?.network!,electrsProxyHost);
            return utxos;
        };
    
        const accumulateData = async () => {
            let tableDataPromises = addresses.map(async (address) => {
                try {
                    // Wait for both promises to resolve before proceeding
                    const [externalAddrUtxos, internalAddrUtxos] = await Promise.all([
                        fetchData(address.externalPubAddress),
                        fetchData(address.internalPubAddress),
                    ]);
                    const sumInternal = internalAddrUtxos.reduce((accumulator, currentItem) => {
                        return accumulator + currentItem.value;
                      }, 0);
                    const sumExternal = externalAddrUtxos.reduce((accumulator, currentItem) => {
                        return accumulator + currentItem.value;
                      }, 0);
                    
                    // Return the new object to include in tableData
                    return {...address, amountExt: sumExternal, amountInt: sumInternal, utxoInt: internalAddrUtxos, utxoExt: externalAddrUtxos,isExpanded: false};
                } catch (error) {
                    console.error(error);
                    return { ...address, amountExt: 0, amountInt: 0, utxoExt: [], utxoInt: [], isExpanded: false }; // Or however you wish to handle errors
                }
            });
    
            // Wait for all data to be accumulated
            const tableData = await Promise.all(tableDataPromises);
    
            // Update state with the accumulated data
            console.log(tableData)
            setTableData(tableData);
        };
    
        accumulateData();
    }, [addresses,keys]); // Dependency array - re-run the effect if something changes, if needed

    const toggleRowExpansion = (rowIndex:number) => {
        const newExpandedRows = new Set(expandedRows);
        if (newExpandedRows.has(rowIndex)) {
            newExpandedRows.delete(rowIndex);
        } else {
            newExpandedRows.add(rowIndex);
        }
        setExpandedRows(newExpandedRows);
    };

    return (
        <div>
            <input type="text"
            value={derivePath}
            onChange={(e) => setDerivePath(e.target.value)}/>
            <table>
                <thead>
                    <tr>
                    <th>Toggle</th>
                    <th>Public Address</th>
                    <th>Amount</th>
                    <th>Change Address</th>
                    <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row, rowIndex) => (
                        <>
                            <tr key={rowIndex}>
                                <td>
                                    <button onClick={() => toggleRowExpansion(rowIndex)}>
                                        {expandedRows.has(rowIndex) ? '-' : '+'}
                                    </button>
                                </td>
                                <td onClick={() => setHighlighted({ rowIndex, colType: 'first-second' })}
                                    style={{ backgroundColor: highlighted.rowIndex === rowIndex && highlighted.colType ==='first-second' ? 'yellow' : 'transparent' }}
                                >
                                    {row.externalPubAddress}
                                </td>
                                <td onClick={() => setHighlighted({ rowIndex, colType: 'first-second' })}
                                    style={{ backgroundColor: highlighted.rowIndex === rowIndex && highlighted.colType === 'first-second' ? 'yellow' : 'transparent' }}
                                >
                                    {row.amountExt}
                                </td>
                                <td onClick={() => setHighlighted({ rowIndex, colType: 'third-fourth' })}
                                    style={{ backgroundColor: highlighted.rowIndex === rowIndex && highlighted.colType === 'third-fourth' ? 'yellow' : 'transparent' }}
                                >
                                    {row.internalPubAddress}
                                </td>
                                <td onClick={() => setHighlighted({ rowIndex, colType: 'third-fourth' })}
                                    style={{ backgroundColor: highlighted.rowIndex === rowIndex && highlighted.colType === 'third-fourth' ? 'yellow' : 'transparent' }}
                                >
                                    {row.amountInt}
                                </td>
                                
                            </tr>
                            {expandedRows.has(rowIndex) && (
                            <>
                                {row.utxoExt?.map((utxo, utxoIndex) => (
                                    <tr key={`ext-${utxoIndex}`}>
                                        <td colSpan={5}>
                                            <input type="checkbox"
                                                checked={utxo.tx_hash in selectedUtxos}
                                                onChange={(e) => handleUtxoSelect(utxo, e.target.checked)}
                                            />
                                            {utxo.value}
                                        </td>
                                    </tr>
                                ))}
                                {row.utxoInt?.map((utxo, utxoIndex) => (
                                    <tr key={`int-${utxoIndex}`}>
                                        <td colSpan={5}>
                                            <input type="checkbox"
                                                checked={utxo.tx_hash in selectedUtxos}
                                                onChange={(e) => handleUtxoSelect(utxo, e.target.checked)}
                                            />
                                            {utxo.value}
                                        </td>
                                    </tr>
                                ))}
                            </>
                            )}
                        </>
                    ))}
                </tbody>
            </table>
        </div>
    );
};