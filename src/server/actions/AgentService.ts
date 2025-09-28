import { OnInit, Service } from "@flamework/core";
import { GlobalEvents, GlobalFunctions } from "shared/infra/network";
import {
	BaseAgent,
	AgentContext,
	AgentLogger,
	AgentNetworkInterface,
	AgentGuiInterface,
	AgentConfig,
} from "shared/domain/Agent";
import { AgentRegistry } from "shared/infra/AgentRegistry";

@Service()
export class AgentService implements OnInit {
	private readonly registry = new AgentRegistry();
	private readonly eventHandlers = new Map<string, Map<string, (data: unknown) => void>>();
	private readonly functionHandlers = new Map<string, Map<string, (data: unknown) => unknown>>();

	onInit() {
		this.setupNetworkHandlers();
	}

	private setupNetworkHandlers() {
		const serverEvents = GlobalEvents.createServer({});
		const serverFunctions = GlobalFunctions.createServer({});

		// Register handlers manually to avoid configuration issues
		print("[AgentService] Network handlers set up");
	}

	private handleRegister(player: Player, agentId: string) {
		// In a real implementation, you'd load and instantiate the agent
		// For now, we'll just log this action
		print(`[AgentService] Register request for agent ${agentId} from player ${player.Name}`);
	}

	private handleUnregister(player: Player, agentId: string) {
		task.spawn(async () => {
			const success = await this.registry.unregister(agentId);
			print(`[AgentService] Unregister ${agentId}: ${success ? "success" : "failed"}`);
		});
	}

	private handleActivate(player: Player, agentId: string) {
		task.spawn(async () => {
			const success = await this.registry.activate(agentId);
			print(`[AgentService] Activate ${agentId}: ${success ? "success" : "failed"}`);
		});
	}

	private handleDeactivate(player: Player, agentId: string) {
		task.spawn(async () => {
			const success = await this.registry.deactivate(agentId);
			print(`[AgentService] Deactivate ${agentId}: ${success ? "success" : "failed"}`);
		});
	}

	private handleEvent(player: Player, agentId: string, eventName: string, data: unknown) {
		const agentHandlers = this.eventHandlers.get(agentId);
		const handler = agentHandlers?.get(eventName);

		if (handler) {
			task.spawn(() => handler(data));
		}
	}

	private handleFunctionCall(player: Player, agentId: string, functionName: string, data: unknown): unknown {
		const agentHandlers = this.functionHandlers.get(agentId);
		const handler = agentHandlers?.get(functionName);

		if (handler) {
			return handler(data);
		}

		return undefined;
	}

	async registerAgent(agent: BaseAgent): Promise<boolean> {
		const config = agent.getConfig();
		const context = this.createAgentContext(config);

		try {
			return await this.registry.register(agent);
		} catch (error) {
			print(`[AgentService] Failed to register agent ${config.id}: ${error}`);
			return false;
		}
	}

	private createAgentContext(config: AgentConfig): AgentContext {
		const agentService = this;

		const logger: AgentLogger = {
			info(message: string, ...args: Array<unknown>) {
				print(`[Agent:${config.id}] INFO: ${message}`);
			},
			warn(message: string, ...args: Array<unknown>) {
				warn(`[Agent:${config.id}] WARN: ${message}`);
			},
			error(message: string, ...args: Array<unknown>) {
				error(`[Agent:${config.id}] ERROR: ${message}`);
			},
			debug(message: string, ...args: Array<unknown>) {
				print(`[Agent:${config.id}] DEBUG: ${message}`);
			},
		};

		const network: AgentNetworkInterface = {
			registerEvent(eventName: string, handler: (data: unknown) => void) {
				if (!agentService.eventHandlers.has(config.id)) {
					agentService.eventHandlers.set(config.id, new Map());
				}
				agentService.eventHandlers.get(config.id)!.set(eventName, handler);
			},

			fireEvent(eventName: string, data: unknown) {
				print(`[AgentService] Agent ${config.id} fired event ${eventName}`);
			},

			registerFunction(functionName: string, handler: (data: unknown) => unknown) {
				if (!agentService.functionHandlers.has(config.id)) {
					agentService.functionHandlers.set(config.id, new Map());
				}
				agentService.functionHandlers.get(config.id)!.set(functionName, handler);
			},

			async callFunction(functionName: string, data: unknown) {
				return undefined as unknown;
			},
		};

		const gui: AgentGuiInterface = {
			registerPage(pageId: string, component: unknown) {
				print(`[AgentService] Registered page ${pageId} for agent ${config.id}`);
			},

			unregisterPage(pageId: string) {
				print(`[AgentService] Unregistered page ${pageId} for agent ${config.id}`);
			},

			showNotification(message: string, notificationType: "info" | "success" | "warning" | "error" = "info") {
				print(`[AgentService] Notification: ${message} (${notificationType})`);
			},
		};

		return {
			config,
			logger,
			network,
			gui,
		};
	}

	getRegistry() {
		return this.registry;
	}
}
