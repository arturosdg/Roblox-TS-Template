import { serverStore } from "server/infra/store";

/**
 * To prevent the state from being polluted between tests, we flush the state
 * before and after resetting it. This ensures that subscriptions run for the
 * changes they were intended to run for, and resets are handled separately.
 */
export function resetStore () {
    serverStore.flush();
    serverStore.resetState();
    serverStore.flush();
}
