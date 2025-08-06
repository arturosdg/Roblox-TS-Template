import { Registry } from "@rbxts/cmdr";
import { CURRENCIES } from "shared/domain/Currency";

export = function (registry: Registry) {
	registry.RegisterType("currency", registry.Cmdr.Util.MakeEnumType("currency", [...CURRENCIES]));
};
