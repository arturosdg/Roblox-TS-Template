import { AgentContext, AgentLogger, AgentNetworkInterface, AgentGuiInterface, AgentConfig } from "shared/domain/Agent";

export interface MockAgentLogger extends AgentLogger {
	getCalls(method: keyof AgentLogger): Array<Array<unknown>>;
}

export function createMockLogger(): MockAgentLogger {
	const calls = new Map<keyof AgentLogger, Array<Array<unknown>>>();

	const logger = {
		info(message: string, ...args: Array<unknown>) {
			if (!calls.has("info")) calls.set("info", []);
			calls.get("info")!.push([message, ...args]);
		},
		warn(message: string, ...args: Array<unknown>) {
			if (!calls.has("warn")) calls.set("warn", []);
			calls.get("warn")!.push([message, ...args]);
		},
		error(message: string, ...args: Array<unknown>) {
			if (!calls.has("error")) calls.set("error", []);
			calls.get("error")!.push([message, ...args]);
		},
		debug(message: string, ...args: Array<unknown>) {
			if (!calls.has("debug")) calls.set("debug", []);
			calls.get("debug")!.push([message, ...args]);
		},
		getCalls(method: keyof AgentLogger) {
			return calls.get(method) || [];
		},
	};

	return logger;
}

export function createMockNetworkInterface(): AgentNetworkInterface {
	return {
		registerEvent(eventName: string, handler: (data: unknown) => void) {
			// Mock implementation
		},
		fireEvent(eventName: string, data: unknown) {
			// Mock implementation
		},
		registerFunction(functionName: string, handler: (data: unknown) => unknown) {
			// Mock implementation
		},
		async callFunction(functionName: string, data: unknown) {
			return undefined as unknown;
		},
	};
}

export function createMockGuiInterface(): AgentGuiInterface {
	const registeredPages = new Set<string>();
	const notifications: Array<{ message: string; notificationType?: string }> = [];

	return {
		registerPage(pageId: string, component: unknown) {
			registeredPages.add(pageId);
		},
		unregisterPage(pageId: string) {
			registeredPages.delete(pageId);
		},
		showNotification(message: string, notificationType?: "info" | "success" | "warning" | "error") {
			notifications.push({ message, notificationType });
		},
	};
}

export function createMockContext(config?: Partial<AgentConfig>): AgentContext {
	const defaultConfig: AgentConfig = {
		id: "test-agent",
		name: "Test Agent",
		version: "1.0.0",
		description: "Test agent for testing purposes",
		author: "Test Suite",
	};

	return {
		config: { ...defaultConfig, ...config },
		logger: createMockLogger(),
		network: createMockNetworkInterface(),
		gui: createMockGuiInterface(),
	};
}
