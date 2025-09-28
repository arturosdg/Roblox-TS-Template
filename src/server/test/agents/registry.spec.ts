import { AgentRegistry } from "shared/infra/AgentRegistry";
import { BaseAgent, AgentConfig, AgentContext } from "shared/domain/Agent";
import { createMockContext } from "../utils/agentTestUtils";

// Mock agent for testing
class MockAgent extends BaseAgent {
	private _isActivated = false;
	private _isDeactivated = false;

	constructor(
		context: AgentContext,
		private config: AgentConfig,
	) {
		super(context);
	}

	getConfig(): AgentConfig {
		return this.config;
	}

	async onActivate(): Promise<void> {
		this._isActivated = true;
	}

	async onDeactivate(): Promise<void> {
		this._isDeactivated = true;
	}

	isActivated() {
		return this._isActivated;
	}
	isDeactivated() {
		return this._isDeactivated;
	}
}

export = () => {
	describe("AgentRegistry", () => {
		let registry: AgentRegistry;

		beforeEach(() => {
			registry = new AgentRegistry();
		});

		it("should register an agent successfully", async () => {
			const config: AgentConfig = {
				id: "test-agent",
				name: "Test Agent",
				version: "1.0.0",
				description: "Test description",
				author: "Test Author",
			};

			const agent = new MockAgent(createMockContext(), config);
			const result = await registry.register(agent);

			expect(result).to.be.ok();
			expect(registry.isRegistered("test-agent")).to.be.ok();
		});

		it("should not register agent with duplicate ID", async () => {
			const config: AgentConfig = {
				id: "duplicate-agent",
				name: "Duplicate Agent",
				version: "1.0.0",
				description: "Test description",
				author: "Test Author",
			};

			const agent1 = new MockAgent(createMockContext(), config);
			const agent2 = new MockAgent(createMockContext(), config);

			const result1 = await registry.register(agent1);
			const result2 = await registry.register(agent2);

			expect(result1).to.be.ok();
			expect(result2).to.never.be.ok();
		});

		it("should activate an agent", async () => {
			const config: AgentConfig = {
				id: "activate-agent",
				name: "Activate Agent",
				version: "1.0.0",
				description: "Test description",
				author: "Test Author",
			};

			const agent = new MockAgent(createMockContext(), config);
			await registry.register(agent);

			const result = await registry.activate("activate-agent");

			expect(result).to.be.ok();
			expect(registry.isActive("activate-agent")).to.be.ok();
			expect(agent.isActivated()).to.be.ok();
		});

		it("should deactivate an agent", async () => {
			const config: AgentConfig = {
				id: "deactivate-agent",
				name: "Deactivate Agent",
				version: "1.0.0",
				description: "Test description",
				author: "Test Author",
			};

			const agent = new MockAgent(createMockContext(), config);
			await registry.register(agent);
			await registry.activate("deactivate-agent");

			const result = await registry.deactivate("deactivate-agent");

			expect(result).to.be.ok();
			expect(registry.isActive("deactivate-agent")).to.never.be.ok();
			expect(agent.isDeactivated()).to.be.ok();
		});

		it("should unregister an agent", async () => {
			const config: AgentConfig = {
				id: "unregister-agent",
				name: "Unregister Agent",
				version: "1.0.0",
				description: "Test description",
				author: "Test Author",
			};

			const agent = new MockAgent(createMockContext(), config);
			await registry.register(agent);

			const result = await registry.unregister("unregister-agent");

			expect(result).to.be.ok();
			expect(registry.isRegistered("unregister-agent")).to.never.be.ok();
		});

		it("should return all agents", async () => {
			const config1: AgentConfig = {
				id: "agent1",
				name: "Agent 1",
				version: "1.0.0",
				description: "Test",
				author: "Test",
			};

			const config2: AgentConfig = {
				id: "agent2",
				name: "Agent 2",
				version: "1.0.0",
				description: "Test",
				author: "Test",
			};

			const agent1 = new MockAgent(createMockContext(), config1);
			const agent2 = new MockAgent(createMockContext(), config2);

			await registry.register(agent1);
			await registry.register(agent2);

			const allAgents = registry.getAllAgents();
			expect(allAgents.size()).to.equal(2);
		});

		it("should return only active agents", async () => {
			const config1: AgentConfig = {
				id: "active-agent",
				name: "Active Agent",
				version: "1.0.0",
				description: "Test",
				author: "Test",
			};

			const config2: AgentConfig = {
				id: "inactive-agent",
				name: "Inactive Agent",
				version: "1.0.0",
				description: "Test",
				author: "Test",
			};

			const agent1 = new MockAgent(createMockContext(), config1);
			const agent2 = new MockAgent(createMockContext(), config2);

			await registry.register(agent1);
			await registry.register(agent2);
			await registry.activate("active-agent");

			const activeAgents = registry.getActiveAgents();
			expect(activeAgents.size()).to.equal(1);
			expect(activeAgents[0].id).to.equal("active-agent");
		});
	});
};
