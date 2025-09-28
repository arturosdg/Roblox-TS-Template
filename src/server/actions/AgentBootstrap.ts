import { OnStart, Service, Dependency } from "@flamework/core";
import { AgentService } from "./AgentService";
import { ExampleAgent } from "shared/agents/ExampleAgent";

@Service()
export class AgentBootstrap implements OnStart {
	private agentService = Dependency<AgentService>();

	async onStart() {
		print("[AgentBootstrap] Initializing agents...");

		try {
			// Create and register the example agent
			await this.registerExampleAgent();

			print("[AgentBootstrap] All agents initialized successfully");
		} catch (err) {
			const errorMessage = tostring(err);
			error(`[AgentBootstrap] Failed to initialize agents: ${errorMessage}`);
		}
	}

	private async registerExampleAgent() {
		const config = {
			id: "example-agent",
			name: "Example Agent",
			version: "1.0.0",
			description: "A simple example agent that demonstrates the agent system capabilities",
			author: "System",
			permissions: [
				{
					type: "network" as const,
					resource: "heartbeat",
					access: "read" as const,
				},
				{
					type: "gui" as const,
					resource: "notifications",
					access: "write" as const,
				},
			],
		};

		const context = this.agentService.createAgentContext(config);
		const exampleAgent = new ExampleAgent(context);

		const success = await this.agentService.registerAgent(exampleAgent);
		if (success) {
			print("[AgentBootstrap] Example agent registered successfully");
			
			// Optionally activate it immediately
			await this.agentService.getRegistry().activate("example-agent");
			print("[AgentBootstrap] Example agent activated");
		} else {
			warn("[AgentBootstrap] Failed to register example agent");
		}
	}
}