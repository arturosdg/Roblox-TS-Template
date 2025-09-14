import { Cmdr } from "@rbxts/cmdr";

const parent = script.Parent as Folder;

Cmdr.RegisterDefaultCommands();
Cmdr.RegisterCommandsIn(parent.FindFirstChild("commands") as Folder);
Cmdr.RegisterTypesIn(parent.FindFirstChild("types") as Folder);
