import { Controller, OnStart } from "@flamework/core";
import { ClientEvents, Functions } from "client/infra/network";
import { AgentMetadata } from "shared/domain/Agent";

@Controller()
export class ClientAgentManager implements OnStart {
	private readonly agentMetadata = new Map<string, AgentMetadata>();
	private readonly eventHandlers = new Map<string, Map<string, (data: unknown) => void>>();
	private readonly functionHandlers = new Map<string, Map<string, (data: unknown) => unknown>>();

	onStart() {
		this.setupNetworkHandlers();
		this.loadAgentMetadata();
	}

	private setupNetworkHandlers() {
		ClientEvents.agents.event.connect((agentId, eventName, data) => {
			const agentHandlers = this.eventHandlers.get(agentId);
			const handler = agentHandlers?.get(eventName);

			if (handler) {
				task.spawn(() => handler(data));
			}
		});

		ClientEvents.agents.statusChanged.connect((agentId, status) => {
			const metadata = this.agentMetadata.get(agentId);
			if (metadata) {
				this.agentMetadata.set(agentId, {
					...metadata,
					status: status as typeof metadata.status,
				});
			}
		});

		ClientEvents.agents.notification.connect((message, notificationType) => {
			this.showNotification(message, notificationType);
		});
	}

	private loadAgentMetadata(): void {
		Functions.agents
			.getAll()
			.then((allAgents) => {
				allAgents.forEach((agent) => {
					this.agentMetadata.set(agent.id, agent);
				});
			})
			.catch((err) => {
				warn(`[ClientAgentManager] Failed to load agent metadata: ${tostring(err)}`);
			});
	}

	registerEventHandler(agentId: string, eventName: string, handler: (data: unknown) => void) {
		if (!this.eventHandlers.has(agentId)) {
			this.eventHandlers.set(agentId, new Map());
		}
		this.eventHandlers.get(agentId)!.set(eventName, handler);
	}

	registerFunctionHandler(agentId: string, functionName: string, handler: (data: unknown) => unknown) {
		if (!this.functionHandlers.has(agentId)) {
			this.functionHandlers.set(agentId, new Map());
		}
		this.functionHandlers.get(agentId)!.set(functionName, handler);
	}

	fireEvent(agentId: string, eventName: string, data: unknown) {
		ClientEvents.agents.event.fire(agentId, eventName, data);
	}

	async callFunction(agentId: string, functionName: string, data: unknown): Promise<unknown> {
		try {
			return await Functions.agents.call(agentId, functionName, data);
		} catch (err) {
			warn(
				`[ClientAgentManager] Failed to call function ${functionName} on agent ${agentId}: ${tostring(err)}`,
			);
			return undefined;
		}
	}

	activateAgent(agentId: string) {
		ClientEvents.agents.activate.fire(agentId);
	}

	deactivateAgent(agentId: string) {
		ClientEvents.agents.deactivate.fire(agentId);
	}

	getAgentMetadata(agentId: string): AgentMetadata | undefined {
		return this.agentMetadata.get(agentId);
	}

	getAllAgents(): ReadonlyArray<AgentMetadata> {
		const result: Array<AgentMetadata> = [];
		for (const [, agent] of pairs(this.agentMetadata)) {
			result.push(agent);
		}
		return result;
	}

	getActiveAgents(): ReadonlyArray<AgentMetadata> {
		return this.getAllAgents().filter((agent) => agent.isEnabled);
	}

	private showNotification(message: string, notificationType: "info" | "success" | "warning" | "error") {
		// For now, just print to console
		// In a full implementation, this would show UI notifications
		const prefix = notificationType.upper();
		print(`[${prefix}] ${message}`);
	}
}
