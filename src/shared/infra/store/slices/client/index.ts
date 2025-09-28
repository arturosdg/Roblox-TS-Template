import { combineProducers } from "@rbxts/reflex";
import { guiSlice } from "./gui";
import { agentSlice } from "./agents";

export const clientSlice = combineProducers({
	gui: guiSlice,
	agents: agentSlice,
});
