import exp from "constants";
import { HexStreamReader, encodeVarint, hexStringToUint8Array, parseVarInt } from "../../utils/parseUtils";
import { ScriptSig, Transaction, Tx, TxIn, TxOut } from "./raw-transaction";
import { Script } from "./script";
import { uint8ArrayToHexString } from "../../utils/byteUtils";

const electrsProxyHost = "http://localhost:3001"

describe("test parse hex", () => {
    test("valid hex", async () => { 
        //            version   segwitMarker  segwit flag   numIn   32 byte tx id                                                    prev idx    scriptsig   sequence    outputs   output amount     script pub key                                 output amount    script pub key                                        num witness elements  element                                                                                                                                             element                                                            locktime
        console.log('02000000   00            01            01      d54b651a0e7fb1cb023c29d8aff916876d47f7b35a1ab58e6df11f912058cb52 00000000    00          feffffff    02        8488810d00000000 160014b8ecdfadeed6815cf4e2ef75d317855ace089075 400e650100000000 1976a9140e123e2677378906189d6bd63a0c7a743f5cff0d88ac   02                    47304402202363152835930ebaaaa82fac9a00cfd0cb523a8c9c8d01e6ea3cef5f1a11722802206001da8ba781178e5d26c031211a73be3eb8e888b006dae9050008e41df5e08501 2102aa3e0e2f05105d151e6e82516134f81a56ebe089e240513ab84ed2f0af20094e e1020000')
        const hex = "02000000000101d54b651a0e7fb1cb023c29d8aff916876d47f7b35a1ab58e6df11f912058cb520000000000feffffff028488810d00000000160014b8ecdfadeed6815cf4e2ef75d317855ace089075400e6501000000001976a9140e123e2677378906189d6bd63a0c7a743f5cff0d88ac0247304402202363152835930ebaaaa82fac9a00cfd0cb523a8c9c8d01e6ea3cef5f1a11722802206001da8ba781178e5d26c031211a73be3eb8e888b006dae9050008e41df5e085012102aa3e0e2f05105d151e6e82516134f81a56ebe089e240513ab84ed2f0af20094ee1020000"
        const transaction = Tx.parse(new HexStreamReader(hex));
        console.log(transaction);
        expect(transaction.locktime).toEqual(737);
        expect(transaction.segwitMarkerAndFlag).toEqual('0001');
        expect(transaction.version).toEqual(2);
        expect(transaction.id()).toEqual("a38be0cead697bfc9f3b181f507f6cfa17389b04507a38bb18170b986eaa57ec");
        // verify input
        expect(transaction.vin[0].scriptSig.hex).toEqual('00');
        expect(transaction.vin[0].sequence).toEqual(4294967294);
        expect(transaction.vin[0].txinwitness).toEqual([hexStringToUint8Array('304402202363152835930ebaaaa82fac9a00cfd0cb523a8c9c8d01e6ea3cef5f1a11722802206001da8ba781178e5d26c031211a73be3eb8e888b006dae9050008e41df5e08501'),
            hexStringToUint8Array('02aa3e0e2f05105d151e6e82516134f81a56ebe089e240513ab84ed2f0af20094e')
        ]);
        expect(transaction.vin[0].vout).toEqual(0);
        // verify outputs 0 & 1
        expect(transaction.vout[0].n).toEqual(0);
        expect(transaction.vout[0].scriptPubKey.hex).toEqual('160014b8ecdfadeed6815cf4e2ef75d317855ace089075');
        expect(transaction.vout[0].value).toEqual(226592900);
        expect(transaction.vout[1].n).toEqual(1);
        expect(transaction.vout[1].scriptPubKey.hex).toEqual('1976a9140e123e2677378906189d6bd63a0c7a743f5cff0d88ac');
        expect(transaction.vout[1].value).toEqual(23400000);
    }, 1000);  

    // todo: mock out calls to electrum so tests will pass if wallet gets wiped or dont spin up electrum for tests to run
    it("Can calculate fee", async () => {
        const hex = "02000000000101d54b651a0e7fb1cb023c29d8aff916876d47f7b35a1ab58e6df11f912058cb520000000000feffffff028488810d00000000160014b8ecdfadeed6815cf4e2ef75d317855ace089075400e6501000000001976a9140e123e2677378906189d6bd63a0c7a743f5cff0d88ac0247304402202363152835930ebaaaa82fac9a00cfd0cb523a8c9c8d01e6ea3cef5f1a11722802206001da8ba781178e5d26c031211a73be3eb8e888b006dae9050008e41df5e085012102aa3e0e2f05105d151e6e82516134f81a56ebe089e240513ab84ed2f0af20094ee1020000"
        const transaction = Tx.parse(new HexStreamReader(hex));
        const fee = await transaction.fee(electrsProxyHost);
        expect(fee).toEqual(2879.9999999701977);
    });
});

describe("tx input", () => {
    it("can parse and serialie txin", () => {
        const txInHex = "d54b651a0e7fb1cb023c29d8aff916876d47f7b35a1ab58e6df11f912058cb520000000000feffffff"
        const reader = new HexStreamReader(txInHex);
        const txin = TxIn.parse(reader);
        const txinParsedHex = uint8ArrayToHexString(txin.serialize());
        expect(txInHex).toEqual(txinParsedHex);
    });

    it("Can get value", async () => {
        const value = await TxIn.value("52cb5820911ff16d8eb51a5ab3f7476d8716f9afd8293c02cbb17f0e1a654bd5",0,electrsProxyHost);
        expect(value).toEqual(2.4999578);
    });

    it("can get prev script pub key", async () => {
        const scriptPubKey = await TxIn.scriptPubKey("52cb5820911ff16d8eb51a5ab3f7476d8716f9afd8293c02cbb17f0e1a654bd5",0,electrsProxyHost);
        expect(scriptPubKey.address).toEqual('bcrt1qnjx8mq3jc0n6pq8289gcszf32pvuvw82hx2jjt');
    });
});

describe("tx output", () => {
    it("can parse and serialize txout", () => {
        const txOutHex = "8488810d00000000160014b8ecdfadeed6815cf4e2ef75d317855ace089075"
        const reader = new HexStreamReader(txOutHex);
        const txout = TxOut.parse(reader);
        const txoutParsedHex = uint8ArrayToHexString(txout.serialize());
        expect(txOutHex).toEqual(txoutParsedHex);
    });
});