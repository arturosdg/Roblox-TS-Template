import { InferState, combineProducers } from "@rbxts/reflex";
import { slices } from "shared/infra/store";
import { receiverMiddleware } from "./middleware/receiver";

export type RootStore = typeof clientStore;

export type RootState = InferState<RootStore>;

export function createStore() {
	const store = combineProducers({
		...slices,
	});

	store.applyMiddleware(receiverMiddleware());

	return store;
}

export const clientStore = createStore();
