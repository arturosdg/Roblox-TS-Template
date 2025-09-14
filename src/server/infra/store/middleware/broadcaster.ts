import { ProducerMiddleware, createBroadcaster } from "@rbxts/reflex";
import { ServerEvents } from "server/infra/network";
import { slices } from "shared/infra/store";

export function broadcasterMiddleware(): ProducerMiddleware {
	const broadcaster = createBroadcaster({
		producers: slices,
		dispatch: (player, actions) => {
			ServerEvents.reflex.dispatch(player, actions);
		},
	});

	ServerEvents.reflex.start.connect((player) => broadcaster.start(player));

	return broadcaster.middleware;
}
