export interface AgentConfig {
	readonly id: string;
	readonly name: string;
	readonly version: string;
	readonly description: string;
	readonly author: string;
	readonly dependencies?: ReadonlyArray<string>;
	readonly permissions?: ReadonlyArray<AgentPermission>;
}

export interface AgentPermission {
	readonly type: "network" | "gui" | "datastore" | "service";
	readonly resource: string;
	readonly access: "read" | "write" | "execute";
}

export interface AgentMetadata extends AgentConfig {
	readonly isEnabled: boolean;
	readonly registeredAt: number;
	readonly lastActivatedAt?: number;
	readonly status: AgentStatus;
}

export type AgentStatus = "active" | "inactive" | "error" | "disabled";

export interface AgentContext {
	readonly config: AgentConfig;
	readonly logger: AgentLogger;
	readonly network: AgentNetworkInterface;
	readonly gui: AgentGuiInterface;
}

export interface AgentLogger {
	info(message: string, ...args: Array<unknown>): void;
	warn(message: string, ...args: Array<unknown>): void;
	error(message: string, ...args: Array<unknown>): void;
	debug(message: string, ...args: Array<unknown>): void;
}

export interface AgentNetworkInterface {
	registerEvent(eventName: string, handler: (data: unknown) => void): void;
	fireEvent(eventName: string, data: unknown): void;
	registerFunction(functionName: string, handler: (data: unknown) => unknown): void;
	callFunction(functionName: string, data: unknown): Promise<unknown>;
}

export interface AgentGuiInterface {
	registerPage(pageId: string, component: unknown): void;
	unregisterPage(pageId: string): void;
	showNotification(message: string, type?: "info" | "success" | "warning" | "error"): void;
}

export abstract class BaseAgent {
	protected readonly context: AgentContext;

	constructor(context: AgentContext) {
		this.context = context;
	}

	abstract onActivate(): void | Promise<void>;
	abstract onDeactivate(): void | Promise<void>;
	abstract getConfig(): AgentConfig;
}
