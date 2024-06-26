import { parseTransaction } from "./transactionParser";
import { Script } from "../../services/model/script";

describe("test parse hex", () => {
    test("valid hex", async () => { 
        //                                                                                                                                                                                                 ?                     ?                                                                                                                                           
        console.log('02000000 00 01 01 d54b651a0e7fb1cb023c29d8aff916876d47f7b35a1ab58e6df11f912058cb52 00000000 00 feffffff 02 8488810d00000000 160014b8ecdfadeed6815cf4e2ef75d317855ace089075 400e650100000000 1976a9140e123e2677378906189d6bd63a0c7a743f5cff0d88ac 02 47304402202363152835930ebaaaa82fac9a00cfd0cb523a8c9c8d01e6ea3cef5f1a11722802206001da8ba781178e5d26c031211a73be3eb8e888b006dae9050008e41df5e08501 2102aa3e0e2f05105d151e6e82516134f81a56ebe089e240513ab84ed2f0af20094ee1020000')
        const hex = "02000000000101d54b651a0e7fb1cb023c29d8aff916876d47f7b35a1ab58e6df11f912058cb520000000000feffffff028488810d00000000160014b8ecdfadeed6815cf4e2ef75d317855ace089075400e6501000000001976a9140e123e2677378906189d6bd63a0c7a743f5cff0d88ac0247304402202363152835930ebaaaa82fac9a00cfd0cb523a8c9c8d01e6ea3cef5f1a11722802206001da8ba781178e5d26c031211a73be3eb8e888b006dae9050008e41df5e085012102aa3e0e2f05105d151e6e82516134f81a56ebe089e240513ab84ed2f0af20094ee1020000"
        const transaction = await parseTransaction(hex);
        console.log(transaction);
        expect(transaction).toEqual({
            version: 2,
            numInputs: 1,
            previousTransactionId: 'd54b651a0e7fb1cb023c29d8aff916876d47f7b35a1ab58e6df11f912058cb52',
            previousTransactionIndex: 0,
            scriptSig: '00',
            sequence: 'feffffff',
            numOutputs: 2,
            outputs: [
                {
                    outputAmounts: 226592900,
                    script: {
                        cmds: [ 
                            0,
                            "b8ecdfadeed6815cf4e2ef75d317855ace089075"
                        ],
                    },
                },
                {
                    outputAmounts: 23400000,
                        script: {
                            cmds: [
                                118,
                                169,
                                "0e123e2677378906189d6bd63a0c7a743f5cff0d",
                                136,
                                172,
                            ],
                        },
                }
            ],
            txinwitness: [
                "304402202363152835930ebaaaa82fac9a00cfd0cb523a8c9c8d01e6ea3cef5f1a11722802206001da8ba781178e5d26c031211a73be3eb8e888b006dae9050008e41df5e08501",
                "02aa3e0e2f05105d151e6e82516134f81a56ebe089e240513ab84ed2f0af20094e"],
            locktime: 737
        });
    }, 1000);
});