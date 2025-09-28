import { ExampleAgent } from "shared/agents/ExampleAgent";
import { createMockContext } from "../utils/agentTestUtils";

export = () => {
	describe("ExampleAgent", () => {
		let agent: ExampleAgent;

		beforeEach(() => {
			const mockContext = createMockContext();
			agent = new ExampleAgent(mockContext);
		});

		it("should have correct configuration", () => {
			const config = agent.getConfig();

			expect(config.id).to.equal("example-agent");
			expect(config.name).to.equal("Example Agent");
			expect(config.version).to.equal("1.0.0");
			expect(config.author).to.equal("System");
			expect(config.description).to.be.a("string");
			expect(config.permissions).to.be.an("table");
		});

		it("should activate successfully", async () => {
			// Test activation
			await agent.onActivate();
			// Basic test - if it doesn't throw, it's successful
		});

		it("should deactivate successfully", async () => {
			// First activate
			await agent.onActivate();

			// Then deactivate
			await agent.onDeactivate();
			// Basic test - if it doesn't throw, it's successful
		});

		it("should have required permissions", () => {
			const config = agent.getConfig();
			const permissions = config.permissions || [];

			const hasNetworkPermission = permissions.some((p) => p.type === "network" && p.resource === "heartbeat");
			const hasGuiPermission = permissions.some((p) => p.type === "gui" && p.resource === "notifications");

			expect(hasNetworkPermission).to.be.ok();
			expect(hasGuiPermission).to.be.ok();
		});
	});
};
