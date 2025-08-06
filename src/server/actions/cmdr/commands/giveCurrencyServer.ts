import { CommandContext } from "@rbxts/cmdr";
import { serverStore } from "server/infra/store";
import { Currency } from "shared/domain/Currency";

export = function (context: CommandContext, player: Player, currency: Currency, amount: number) {
	serverStore.changeBalance(tostring(player.UserId), currency, amount);
};
