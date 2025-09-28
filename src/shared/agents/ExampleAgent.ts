import { BaseAgent, AgentConfig, AgentContext } from "shared/domain/Agent";

export class ExampleAgent extends BaseAgent {
	private tickConnection?: RBXScriptConnection;

	constructor(context: AgentContext) {
		super(context);
	}

	getConfig(): AgentConfig {
		return {
			id: "example-agent",
			name: "Example Agent",
			version: "1.0.0",
			description: "A simple example agent that demonstrates the agent system capabilities",
			author: "System",
			permissions: [
				{
					type: "network",
					resource: "heartbeat",
					access: "read",
				},
				{
					type: "gui",
					resource: "notifications",
					access: "write",
				},
			],
		};
	}

	async onActivate(): Promise<void> {
		this.context.logger.info("Example Agent activated!");

		// Register network handlers
		this.context.network.registerEvent("ping", (data) => {
			this.context.logger.info(`Received ping: ${data}`);
			this.context.network.fireEvent("pong", { response: "Hello from Example Agent!" });
		});

		this.context.network.registerFunction("getStatus", () => {
			return {
				status: "active",
				uptime: os.time(),
				message: "Example Agent is running smoothly",
			};
		});

		// Register a GUI page (placeholder)
		this.context.gui.registerPage("example-page", "ExamplePageComponent");

		// Show activation notification
		this.context.gui.showNotification("Example Agent has been activated!", "success");

		// Set up a simple heartbeat (example of periodic task)
		this.tickConnection = game.GetService("RunService").Heartbeat.Connect(() => {
			// This could do periodic work
			// For demo purposes, we'll just log once every 30 seconds
			if (os.time() % 30 === 0) {
				this.context.logger.debug("Example Agent heartbeat");
			}
		});

		this.context.logger.info("Example Agent setup complete");
	}

	async onDeactivate(): Promise<void> {
		this.context.logger.info("Example Agent deactivating...");

		// Clean up connections
		if (this.tickConnection) {
			this.tickConnection.Disconnect();
			this.tickConnection = undefined;
		}

		// Unregister GUI page
		this.context.gui.unregisterPage("example-page");

		// Show deactivation notification
		this.context.gui.showNotification("Example Agent has been deactivated", "info");

		this.context.logger.info("Example Agent deactivated successfully");
	}
}
