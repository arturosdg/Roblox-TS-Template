import { createProducer } from "@rbxts/reflex";
import { AgentMetadata } from "shared/domain/Agent";

export interface AgentState {
	readonly agents: Readonly<Record<string, AgentMetadata>>;
	readonly activePages: ReadonlyArray<string>;
	readonly notifications: ReadonlyArray<AgentNotification>;
}

export interface AgentNotification {
	readonly id: string;
	readonly message: string;
	readonly type: "info" | "success" | "warning" | "error";
	readonly timestamp: number;
	readonly agentId?: string;
}

const initialState: AgentState = {
	agents: {},
	activePages: [],
	notifications: [],
};

export const agentSlice = createProducer(initialState, {
	setAgents: (state, agents: ReadonlyArray<AgentMetadata>) => ({
		...state,
		agents: agents.reduce((acc, agent) => ({ ...acc, [agent.id]: agent }), {}),
	}),

	updateAgent: (state, agentId: string, updates: Partial<AgentMetadata>) => {
		const currentAgent = state.agents[agentId];
		if (!currentAgent) return state;

		return {
			...state,
			agents: {
				...state.agents,
				[agentId]: { ...currentAgent, ...updates },
			},
		};
	},

	registerPage: (state, pageId: string) => ({
		...state,
		activePages: [...state.activePages, pageId],
	}),

	unregisterPage: (state, pageId: string) => ({
		...state,
		activePages: state.activePages.filter((id) => id !== pageId),
	}),

	addNotification: (state, notification: Omit<AgentNotification, "id" | "timestamp">) => {
		const newNotification: AgentNotification = {
			...notification,
			id: tostring(math.random() * 1000000),
			timestamp: os.time(),
		};

		return {
			...state,
			notifications: [...state.notifications, newNotification],
		};
	},

	removeNotification: (state, notificationId: string) => ({
		...state,
		notifications: state.notifications.filter((n) => n.id !== notificationId),
	}),

	clearNotifications: (state) => ({
		...state,
		notifications: [],
	}),
});
