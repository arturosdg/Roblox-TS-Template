# Agent System Documentation

## Overview

This document outlines the foundation for implementing a modular agent system in the Roblox-TS template. The system is designed to allow developers to add new functionality without modifying existing code, following SOLID principles and LEAN/YAGNI approaches.

## Project Architecture

### Relevant Libraries

- **UI Framework**: React with @rbxts/react for game interfaces
- **State Management**: Reflex for reactive state synchronization between client and server
- **Networking**: Flamework networking for type-safe client-server communication
- **Data Persistence**: ProfileService for player data management and DataStore integration
- **Dependency Injection**: Flamework core for service management and lifecycle
- **Testing Framework**: TestEZ for comprehensive test coverage
- **Command System**: Cmdr for in-game developer commands
- **Type Safety**: Full TypeScript coverage with @rbxts/types

### Folder Structure

```
src/
├── client/                    # Client-only code (runs on each player's device)
│   ├── app/                  # Main application components
│   │   └── holder/           # HolderApp.tsx - main UI router
│   ├── infra/                # Client infrastructure (networking, store)
│   ├── pages/                # Individual page components
│   ├── system-ui/            # Reusable UI components and apps
│   └── runtime.client.ts     # Client initialization
├── server/                    # Server-only code (runs on game server)
│   ├── actions/              # Server services (PlayerDataService, etc.)
│   ├── infra/                # Server infrastructure (store, networking)
│   ├── test/                 # Server-side tests
│   └── runtime.server.ts     # Server initialization
└── shared/                    # Code accessible by both client and server
    ├── domain/               # Business logic and domain models
    ├── infra/                # Shared infrastructure (network definitions)
    │   ├── network.ts        # RemoteEvents/Functions definitions
    │   └── store/            # Reflex state management
    └── utils/                # Shared utility functions
```

### Key Architectural Patterns

- **DataStore Integration**: ProfileService handles player data persistence and loading
- **RemoteEvents**: Client-server communication through type-safe Flamework networking  
- **Server Authority**: All valuable data and game logic validated on server
- **Client Prediction**: UI responds immediately while server validates actions
- **Sanity Checks**: Player actions validated server-side before applying changes

## Important Implementation Rule

**⚠️ CRITICAL: Before implementing any agent system functionality, always request full context and confirmation of requirements. Do not assume scope or begin implementation without explicit approval.**

This rule ensures:
- Clear understanding of requirements
- Appropriate scope of implementation
- Alignment with project goals
- Prevention of over-engineering

## Planned Architecture

### Key Principles
- **SOLID Principles**: Clean, maintainable architecture
- **LEAN/YAGNI**: Minimal viable implementation
- **Modular Design**: Add features without modifying existing code
- **Type Safety**: Full TypeScript coverage
- **Testing First**: Comprehensive test coverage

### Integration Points
- Network communication via existing infrastructure
- GUI integration with HolderApp router
- State management through Reflex
- Permission system for security

## Implementation Guidelines

When the system is ready to be implemented:

1. **Start Simple**: Begin with core interfaces only
2. **Test Driven**: Write tests before implementation
3. **Iterative Development**: Build incrementally
4. **Documentation**: Keep docs updated with implementation
5. **Review Process**: Get approval before expanding scope

## Next Steps

To proceed with implementation:
1. Define specific requirements and scope
2. Get explicit approval for implementation approach
3. Start with minimal viable interfaces
4. Build incrementally with testing
5. Expand based on validated needs

---

*Remember: Always ask for full context before implementing any functionality.*