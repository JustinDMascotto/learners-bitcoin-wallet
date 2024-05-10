import { AmmountDenomination } from "../models/settings";


export const viewInDenomination = (ammount:number|undefined,denomination:AmmountDenomination) => {
    if(ammount!==undefined && denomination === AmmountDenomination.BTC) {
        return ammount/100_000_000;
    }
    return ammount;
};