import { Flamework } from "@flamework/core";
import TestEZ from "@rbxts/testez";
import {RunService} from "@rbxts/services";

Flamework.addPaths("src/server/components");
Flamework.addPaths("src/server/services");
Flamework.addPaths("src/shared/components");

Flamework.ignite();


export const IS_DEV = RunService.IsStudio();
if (IS_DEV) {
    TestEZ.TestBootstrap.run([script.Parent!]);
}