import { AgentConfig, AgentMetadata, AgentStatus, BaseAgent } from "shared/domain/Agent";

export interface AgentRegistryInterface {
	register(agent: BaseAgent): Promise<boolean>;
	unregister(agentId: string): Promise<boolean>;
	activate(agentId: string): Promise<boolean>;
	deactivate(agentId: string): Promise<boolean>;
	getAgent(agentId: string): BaseAgent | undefined;
	getAllAgents(): ReadonlyArray<AgentMetadata>;
	getActiveAgents(): ReadonlyArray<AgentMetadata>;
	isRegistered(agentId: string): boolean;
	isActive(agentId: string): boolean;
}

export class AgentRegistry implements AgentRegistryInterface {
	private readonly agents = new Map<string, BaseAgent>();
	private readonly metadata = new Map<string, AgentMetadata>();

	async register(agent: BaseAgent): Promise<boolean> {
		const config = agent.getConfig();

		if (this.isRegistered(config.id)) {
			return false;
		}

		// Validate dependencies
		if (config.dependencies) {
			for (const dependency of config.dependencies) {
				if (!this.isRegistered(dependency) || !this.isActive(dependency)) {
					error(`Agent dependency '${dependency}' is not available for agent '${config.id}'`);
					return false;
				}
			}
		}

		this.agents.set(config.id, agent);
		this.metadata.set(config.id, {
			...config,
			isEnabled: false,
			registeredAt: os.time(),
			status: "inactive" as AgentStatus,
		});

		return true;
	}

	async unregister(agentId: string): Promise<boolean> {
		const agent = this.agents.get(agentId);
		if (!agent) {
			return false;
		}

		// Check if other agents depend on this one
		const dependentAgents = this.getAllAgents().filter((metadata) => {
			if (!metadata.dependencies) return false;

			for (const dep of metadata.dependencies) {
				if (dep === agentId && metadata.isEnabled) {
					return true;
				}
			}
			return false;
		});

		if (dependentAgents.size() > 0) {
			error(`Cannot unregister agent '${agentId}' - it is required by other active agents`);
			return false;
		}

		if (this.isActive(agentId)) {
			await this.deactivate(agentId);
		}

		this.agents.delete(agentId);
		this.metadata.delete(agentId);
		return true;
	}

	async activate(agentId: string): Promise<boolean> {
		const agent = this.agents.get(agentId);
		const metadata = this.metadata.get(agentId);

		if (!agent || !metadata) {
			return false;
		}

		if (metadata.isEnabled) {
			return true;
		}

		try {
			await agent.onActivate();

			this.metadata.set(agentId, {
				...metadata,
				isEnabled: true,
				lastActivatedAt: os.time(),
				status: "active" as AgentStatus,
			});

			return true;
		} catch (error) {
			this.metadata.set(agentId, {
				...metadata,
				status: "error" as AgentStatus,
			});

			throw error;
		}
	}

	async deactivate(agentId: string): Promise<boolean> {
		const agent = this.agents.get(agentId);
		const metadata = this.metadata.get(agentId);

		if (!agent || !metadata) {
			return false;
		}

		if (!metadata.isEnabled) {
			return true;
		}

		try {
			await agent.onDeactivate();

			this.metadata.set(agentId, {
				...metadata,
				isEnabled: false,
				status: "inactive" as AgentStatus,
			});

			return true;
		} catch (error) {
			this.metadata.set(agentId, {
				...metadata,
				status: "error" as AgentStatus,
			});

			throw error;
		}
	}

	getAgent(agentId: string): BaseAgent | undefined {
		return this.agents.get(agentId);
	}

	getAllAgents(): ReadonlyArray<AgentMetadata> {
		const result: Array<AgentMetadata> = [];
		for (const [id, metadata] of pairs(this.metadata)) {
			result.push(metadata);
		}
		return result;
	}

	getActiveAgents(): ReadonlyArray<AgentMetadata> {
		return this.getAllAgents().filter((metadata) => metadata.isEnabled);
	}

	isRegistered(agentId: string): boolean {
		return this.agents.has(agentId);
	}

	isActive(agentId: string): boolean {
		const metadata = this.metadata.get(agentId);
		return metadata?.isEnabled ?? false;
	}
}
