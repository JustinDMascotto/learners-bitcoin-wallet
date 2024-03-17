import { useEffect, useState } from "react"
import { useAppState } from "../../components/AppState"
import { getAddressP2WPKH } from "../../utils/addressUtils";
import SidePanel from "../../components/SidePanel";
import { Keys } from "../../models/keys";
import { stat } from "fs";
import internal from "stream";


interface TableRow extends Address {
    amountInt: number | undefined,
    amountExt: number | undefined
}

interface Address {
    externalPubAddress: string,
    internalPubAddress: string
}

function getAddressesForAccount(account:number,
                                keys: Keys): Address[] {
    let addresses: Address[] = [];
    for(let i = 0; i < 10; i++) {
        let childAddr = keys.hdRoot.deriveHardened(account).derive(i)
        addresses.push({
            externalPubAddress: getAddressP2WPKH(childAddr?.derive(0).neutered(),keys?.network),
            internalPubAddress: getAddressP2WPKH(childAddr?.derive(1).neutered(),keys?.network),
        })
    }
    return addresses;
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
                    amountInt: undefined}));
                setTableData(tableData)
            }
            let address = getAddressP2WPKH(state.keys?.hdRoot.derivePath(derivePath).neutered(),state.keys?.network)
            setFirstAddress(address);
        } 
    },[derivePath,state.keys]);



    async function mockReq(delay:number):Promise<number> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(1);
            }, delay);
        });
    }

    

    useEffect(() => {
        const fetchData = async (address: string) => {
            await mockReq(2000); // Assuming mockReq is defined and returns a promise
            return 10; // Or whatever data you're fetching
        };
    
        const accumulateData = async () => {
            let tableDataPromises = addresses.map(async (address) => {
                try {
                    // Wait for both promises to resolve before proceeding
                    const [externalAddrAmount, internalAddrAmount] = await Promise.all([
                        fetchData(address.externalPubAddress),
                        fetchData(address.internalPubAddress),
                    ]);
                    
                    // Return the new object to include in tableData
                    return {...address, amountExt: externalAddrAmount, amountInt: internalAddrAmount};
                } catch (error) {
                    console.error(error);
                    return { ...address, amountExt: 0, amountInt: 0 }; // Or however you wish to handle errors
                }
            });
    
            // Wait for all data to be accumulated
            const tableData = await Promise.all(tableDataPromises);
            
            console.log( 'here' )
            console.log( tableData)
    
            // Update state with the accumulated data
            setTableData(tableData);
        };
    
        accumulateData();
    }, [addresses]); // Dependency array - re-run the effect if something changes, if needed


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