import { InferState, combineProducers } from "@rbxts/reflex";
import { slices } from "shared/infra/store";
import { broadcasterMiddleware } from "./middleware/broadcaster";

export type RootState = InferState<typeof serverStore>;

export function createStore() {
	const store = combineProducers({
		...slices,
	});

	// Apply middleware
	store.applyMiddleware(broadcasterMiddleware());

	return store;
}

export const serverStore = createStore();
