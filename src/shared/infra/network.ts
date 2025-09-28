import { Networking } from "@flamework/networking";
import { BroadcastAction } from "@rbxts/reflex";
import { PlayerData } from "./store/slices/players/types";
import { Setting } from "../domain/Settings";
import { AgentMetadata } from "../domain/Agent";

interface ServerEvents {
	reflex: {
		start: () => void;
	};

	toggleSetting: (setting: Setting) => void;

	agents: {
		register: (agentId: string) => void;
		unregister: (agentId: string) => void;
		activate: (agentId: string) => void;
		deactivate: (agentId: string) => void;
		event: (agentId: string, eventName: string, data: unknown) => void;
	};
}

interface ServerFunctions {
	agents: {
		getAll: () => ReadonlyArray<AgentMetadata>;
		getActive: () => ReadonlyArray<AgentMetadata>;
		call: (agentId: string, functionName: string, data: unknown) => unknown;
	};
}

interface ClientEvents {
	reflex: {
		dispatch: (actions: Array<BroadcastAction>) => void;
		hydrate: (actions: PlayerData) => void;
		start: () => void;
	};

	agents: {
		event: (agentId: string, eventName: string, data: unknown) => void;
		statusChanged: (agentId: string, status: string) => void;
		notification: (message: string, type: "info" | "success" | "warning" | "error") => void;
	};
}

interface ClientFunctions {
	agents: {
		call: (agentId: string, functionName: string, data: unknown) => unknown;
	};
}

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();
