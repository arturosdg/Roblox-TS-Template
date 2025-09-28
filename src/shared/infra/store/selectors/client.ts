import { SharedState } from "../index";
import { AgentMetadata } from "shared/domain/Agent";

export const selectHolderPage = (state: SharedState) => {
	return state.client.gui.holderPage;
};

export const selectAllAgents = (state: SharedState) => {
	const agentsRecord = state.client.agents.agents;
	const result: Array<AgentMetadata> = [];
	for (const [id, agent] of pairs(agentsRecord)) {
		result.push(agent);
	}
	return result;
};

export const selectActiveAgents = (state: SharedState) => {
	return selectAllAgents(state).filter((agent: AgentMetadata) => agent.isEnabled);
};

export const selectAgent = (agentId: string) => (state: SharedState) => {
	return state.client.agents.agents[agentId];
};

export const selectAgentNotifications = (state: SharedState) => {
	return state.client.agents.notifications;
};

export const selectActivePages = (state: SharedState) => {
	return state.client.agents.activePages;
};
