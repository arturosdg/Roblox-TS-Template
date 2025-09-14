import { Controller, OnStart } from "@flamework/core";
import React from "@rbxts/react";
import { ReflexProvider } from "@rbxts/react-reflex";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import { Players } from "@rbxts/services";
import { clientStore } from "client/infra/store";
import HolderApp from "client/app/holder/holder-app";
import ScreenGui from "client/system-ui/components/scaledGui";

@Controller({})
export class App implements OnStart {
	private playerGui = Players.LocalPlayer.WaitForChild("PlayerGui");

	onStart () {
		const root = createRoot( new Instance( "Folder" ) )
		root.render( createPortal( <ReflexProvider producer={clientStore}>
			<ScreenGui>
				<HolderApp />
			</ScreenGui>
		</ReflexProvider>
			, this.playerGui ) )
	}
}
