import { networks } from "bitcoinjs-lib";
import { Keys } from "./keys";


describe('Test Keys', () => {
    it('Test that we can generate keys with apropriate prefix', () => {
        const keys = Keys.importBrainWallet('dadfadfadfadsfadfa',networks.regtest);
        expect(keys.hdRoot.toWIF()).toBe('cNGWP57ZDWFDfFdthpBAf5dsm927tqdZ89dePh6Mgzn6Di1vj2Gu');
    });
});