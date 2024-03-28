import { useEffect, useState } from "react"
import { useAppState } from "../../components/AppState"
import { Address, getAddressesForAccount, getAddressP2WPKH } from '../../utils/addressUtils'
import SidePanel from "../../components/SidePanel";
import * as electrumClient from '../../services/electrumClient'


interface TableRow extends Address {
    amountInt: number | undefined,
    utxoInt: electrumClient.ListUnspentResponseElement[] | undefined,
    amountExt: number | undefined,
    utxoExt: electrumClient.ListUnspentResponseElement[] | undefined,
}


export const Wallet = () => {
    const { state } = useAppState();

    const [ derivePath, setDerivePath ] = useState("m/0'/0/0");
    const [ account, setAccount ] = useState(0);
    const [ addresses, setAddresses ] = useState<Address[]>([]);
    const [ firstAddress, setFirstAddress ] = useState('');
    const [ highlighted, setHighlighted ] = useState({rowIndex: 0, colType: ''});
    const [ tableData, setTableData ] = useState<TableRow[]>([]);


    useEffect(() => {
        let regex = new RegExp("m/(\\d+)\'{0,1}/\\d+/\\d+");
        if(regex.test(derivePath)) {
            let account = derivePath.match(regex);
            if(account && account[1]) {
                setAccount(parseInt(account[1]));
                let addresses = getAddressesForAccount(parseInt(account[1]),state.keys!);
                setAddresses(addresses)
                let tableData: TableRow[] = addresses.map( it => ({externalPubAddress: it.externalPubAddress, 
                    internalPubAddress: it.internalPubAddress,
                    amountExt: undefined,
                    utxoExt: undefined,
                    amountInt: undefined,
                    utxoInt: undefined}));
                setTableData(tableData)
            }
            let address = getAddressP2WPKH(state.keys?.hdRoot.derivePath(derivePath).neutered(),state.keys?.network)
            setFirstAddress(address);
        } 
    },[derivePath,state.keys]);

    

    useEffect(() => {
        const fetchData = async (address: string) : Promise<electrumClient.ListUnspentResponseElement[]> => {
            let utxos = await electrumClient.getUtxos(address,state.keys?.network!);
            return utxos; // Or whatever data you're fetching
        };
    
        const accumulateData = async () => {
            let tableDataPromises = addresses.map(async (address) => {
                try {
                    // Wait for both promises to resolve before proceeding
                    const [externalAddrAmount, internalAddrAmount] = await Promise.all([
                        fetchData(address.externalPubAddress),
                        fetchData(address.internalPubAddress),
                    ]);
                    const sumInternal = internalAddrAmount.reduce((accumulator, currentItem) => {
                        return accumulator + currentItem.value;
                      }, 0);
                    const sumExternal = externalAddrAmount.reduce((accumulator, currentItem) => {
                        return accumulator + currentItem.value;
                      }, 0);
                    
                    // Return the new object to include in tableData
                    return {...address, amountExt: sumExternal, amountInt: sumInternal, utxoInt: internalAddrAmount, utxoExt: externalAddrAmount};
                } catch (error) {
                    console.error(error);
                    return { ...address, amountExt: 0, amountInt: 0, utxoExt: [], utxoInt: [] }; // Or however you wish to handle errors
                }
            });
    
            // Wait for all data to be accumulated
            const tableData = await Promise.all(tableDataPromises);
    
            // Update state with the accumulated data
            setTableData(tableData);
        };
    
        accumulateData();
    }, [addresses,state.keys]); // Dependency array - re-run the effect if something changes, if needed


    return (
        <div>
            <SidePanel></SidePanel>
            <input type="text"
            value={derivePath}
            onChange={(e) => setDerivePath(e.target.value)}/>
            <div>
                first address: {firstAddress}
            </div>
            <table>
                <thead>
                    <tr>
                    <th>Public Address</th>
                    <th>Amount</th>
                    <th>Change Address</th>
                    <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
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
                    ))}
                </tbody>
            </table>
        </div>
    );
}