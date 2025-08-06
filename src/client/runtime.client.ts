import { Flamework } from "@flamework/core";
import { CmdrClient } from "@rbxts/cmdr";

CmdrClient.SetActivationKeys([Enum.KeyCode.F2]);

Flamework.addPaths("src/client/pages");

Flamework.ignite();
