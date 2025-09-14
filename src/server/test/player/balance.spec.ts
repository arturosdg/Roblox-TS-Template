import { serverStore } from "server/infra/store";
import { selectPlayerBalance, selectPlayerBalances } from "shared/infra/store/selectors/players";
import { defaultPlayerData } from "shared/infra/store/slices/players/utils";
import { resetStore } from "../utils/resetStore";

export = () => {
	const playerId = tostring("TEST");

	it("should have balances", () => {
		serverStore.loadPlayerData(playerId, defaultPlayerData);
		serverStore.flush();
		const balances = serverStore.getState(selectPlayerBalances(playerId));
		expect(balances).to.be.ok();
	});

	it("should have 0 coins", () => {
		const coins = serverStore.getState(selectPlayerBalance(playerId, "Coins"));
		expect(coins).to.equal(0);
	});

	it("should have 5 coins", () => {
		serverStore.changeBalance(playerId, "Coins", 5);
		const coins = serverStore.getState(selectPlayerBalance(playerId, "Coins"));
		expect(coins).to.equal(5);
	});

	it("should have 1 balance", () => {
		serverStore.changeBalance(playerId, "Coins", -4);
		const coins = serverStore.getState(selectPlayerBalance(playerId, "Coins"));
		expect(coins).to.equal(1);
	});

	resetStore();
};
