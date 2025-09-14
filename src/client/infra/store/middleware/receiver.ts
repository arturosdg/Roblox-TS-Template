import { ProducerMiddleware, createBroadcastReceiver } from "@rbxts/reflex";
import { ClientEvents } from "client/infra/network";

export function receiverMiddleware(): ProducerMiddleware {
	const receiver = createBroadcastReceiver({
		start: () => {
			ClientEvents.reflex.start.fire();
		},
	});

	ClientEvents.reflex.dispatch.connect((actions) => receiver.dispatch(actions));

	return receiver.middleware;
}
