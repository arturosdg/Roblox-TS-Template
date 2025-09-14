import { SharedState } from "../index";

export const selectHolderPage = ( state: SharedState ) => {
    return state.client.gui.holderPage;
}
