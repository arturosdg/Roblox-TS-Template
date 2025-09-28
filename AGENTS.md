# Agent System Documentation

## Overview

The Agent System is a modular, extensible architecture that allows developers to add new functionality to the Roblox-TS template without modifying existing code. It follows SOLID principles and emphasizes LEAN/YAGNI approaches.

## Architecture

### Core Components

1. **BaseAgent** - Abstract base class all agents must extend
2. **AgentRegistry** - Manages agent lifecycle and dependencies
3. **AgentService** (Server) - Handles server-side agent operations
4. **ClientAgentManager** (Client) - Manages client-side agent interactions
5. **Agent State Management** - Reflex-based state management for agents

### Directory Structure

```
src/
├── shared/
│   ├── domain/
│   │   └── Agent.ts              # Core agent interfaces and base class
│   ├── infra/
│   │   ├── AgentRegistry.ts      # Agent lifecycle management
│   │   └── network.ts            # Extended with agent communication
│   ├── agents/
│   │   └── ExampleAgent.ts       # Example agent implementation
│   └── store/
│       └── slices/client/agents.ts # Agent state management
├── server/
│   ├── actions/
│   │   └── AgentService.ts       # Server-side agent service
│   └── test/
│       ├── agents/               # Agent tests
│       └── utils/agentTestUtils.ts # Testing utilities
└── client/
    ├── infra/
    │   └── ClientAgentManager.ts # Client agent management
    └── system-ui/apps/agents/
        └── agents-app.tsx        # Agent management UI
```

## Key Features

### SOLID Principles Implementation

- **Single Responsibility**: Each agent handles one specific functionality
- **Open/Closed**: New agents can be added without modifying existing code
- **Liskov Substitution**: All agents implement the same base interface
- **Interface Segregation**: Agents only depend on interfaces they use
- **Dependency Inversion**: Agents depend on abstractions, not implementations

### LEAN/YAGNI Approach

- Minimal viable implementation
- No unnecessary complexity
- Features added only when needed
- Clean, maintainable codebase

### Testing-First Development

- Comprehensive test coverage
- Mock utilities for agent testing
- Automated testing in CI/CD pipeline

## Creating a New Agent

### 1. Define Your Agent

```typescript
import { BaseAgent, AgentConfig, AgentContext } from "shared/domain/Agent";

export class MyCustomAgent extends BaseAgent {
    constructor(context: AgentContext) {
        super(context);
    }

    getConfig(): AgentConfig {
        return {
            id: "my-custom-agent",
            name: "My Custom Agent",
            version: "1.0.0",
            description: "Description of what this agent does",
            author: "Your Name",
            permissions: [
                {
                    type: "network",
                    resource: "custom-events",
                    access: "read",
                },
            ],
        };
    }

    async onActivate(): Promise<void> {
        this.context.logger.info("Custom agent activated!");
        
        // Register event handlers
        this.context.network.registerEvent("my-event", (data) => {
            this.handleMyEvent(data);
        });

        // Register GUI pages if needed
        this.context.gui.registerPage("my-page", MyPageComponent);
    }

    async onDeactivate(): Promise<void> {
        this.context.logger.info("Custom agent deactivating...");
        
        // Cleanup
        this.context.gui.unregisterPage("my-page");
    }

    private handleMyEvent(data: unknown) {
        // Handle custom event
    }
}
```

### 2. Register Your Agent

```typescript
// In server initialization
import { MyCustomAgent } from "shared/agents/MyCustomAgent";

// Get agent service instance
const agentService = Dependency<AgentService>();

// Create and register agent
const context = agentService.createAgentContext(myAgentConfig);
const myAgent = new MyCustomAgent(context);
await agentService.registerAgent(myAgent);
```

### 3. Write Tests

```typescript
import { MyCustomAgent } from "shared/agents/MyCustomAgent";
import { createMockContext } from "server/test/utils/agentTestUtils";

export = () => {
    describe("MyCustomAgent", () => {
        let agent: MyCustomAgent;
        
        beforeEach(() => {
            const mockContext = createMockContext();
            agent = new MyCustomAgent(mockContext);
        });

        it("should activate successfully", async () => {
            await agent.onActivate();
            // Verify expected behavior
        });

        it("should handle events correctly", () => {
            // Test event handling
        });
    });
};
```

## Agent Communication

### Network Events

Agents can communicate through events:

```typescript
// Sending an event
this.context.network.fireEvent("agent-message", { 
    from: this.getConfig().id,
    message: "Hello from agent!" 
});

// Receiving events
this.context.network.registerEvent("agent-message", (data) => {
    this.context.logger.info(`Received: ${data.message}`);
});
```

### Function Calls

Agents can expose functions for other agents to call:

```typescript
// Register a function
this.context.network.registerFunction("get-status", () => {
    return { status: "active", data: this.getSomeData() };
});

// Call a function
const status = await this.context.network.callFunction("get-status", {});
```

## GUI Integration

### Adding Pages

Agents can register pages in the HolderApp router:

```typescript
// Register a page
this.context.gui.registerPage("my-agent-page", MyAgentPageComponent);

// Add to HOLDER_PAGES in shared/domain/Gui.ts
export const HOLDER_PAGES = ["Settings", "Agents", "MyAgentPage"] as const;
```

### Notifications

Agents can show notifications to users:

```typescript
this.context.gui.showNotification("Agent operation completed!", "success");
```

## State Management

Agents integrate with the Reflex store for state management:

```typescript
// Use selectors to read agent state
const allAgents = useSelector(selectAllAgents);
const myAgent = useSelector(selectAgent("my-agent-id"));

// Update agent state through actions
clientStore.updateAgent("my-agent-id", { status: "active" });
```

## Best Practices

### 1. Keep Agents Focused
- Each agent should handle one specific functionality
- Avoid creating monolithic agents that do everything

### 2. Handle Errors Gracefully
```typescript
async onActivate(): Promise<void> {
    try {
        await this.initializeAgent();
    } catch (error) {
        this.context.logger.error(`Failed to activate: ${error}`);
        throw error;
    }
}
```

### 3. Clean Up Resources
```typescript
async onDeactivate(): Promise<void> {
    // Clean up connections, event handlers, etc.
    if (this.connection) {
        this.connection.Disconnect();
    }
}
```

### 4. Use Dependency Injection
- Don't hardcode dependencies
- Use the context provided to the agent

### 5. Write Tests
- Test both success and failure scenarios
- Use mock contexts for isolation
- Test agent interactions

## Security Considerations

### Permissions System
Agents declare required permissions in their config:

```typescript
permissions: [
    {
        type: "network",
        resource: "user-data",
        access: "read",
    },
    {
        type: "datastore",
        resource: "agent-settings",
        access: "write",
    },
]
```

### Validation
- Always validate input data in event handlers
- Check permissions before performing operations
- Log security-relevant events

## Performance Guidelines

### 1. Lazy Loading
- Only initialize what you need
- Load resources on demand

### 2. Event Handler Efficiency
```typescript
this.context.network.registerEvent("high-frequency-event", (data) => {
    // Keep handlers lightweight
    // Offload heavy work to separate tasks
    task.spawn(() => this.processHeavyWork(data));
});
```

### 3. Memory Management
- Clean up resources in onDeactivate
- Avoid memory leaks from uncleaned connections

## Troubleshooting

### Common Issues

1. **Agent won't activate**
   - Check dependencies are available and active
   - Verify permissions are correct
   - Check logs for error messages

2. **Events not firing**
   - Ensure event names match exactly
   - Check network connectivity
   - Verify handlers are registered before events fire

3. **State not updating**
   - Check selectors are properly connected
   - Verify actions are dispatched correctly
   - Ensure component re-renders are triggered

### Debugging

Enable debug logging:
```typescript
this.context.logger.debug("Agent state", { data: this.getCurrentState() });
```

Use the Agents UI to monitor agent status and debug issues visually.

## Future Enhancements

The agent system is designed to be extensible. Planned features include:

- Hot-reloading of agents during development
- Agent marketplace for sharing agents
- Advanced permission system with role-based access
- Agent communication protocols for complex interactions
- Performance monitoring and metrics
- Automatic dependency resolution

## Contributing

When adding new features to the agent system:

1. Follow SOLID principles
2. Write comprehensive tests
3. Update documentation
4. Consider backward compatibility
5. Use existing patterns and conventions