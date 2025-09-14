import { HolderPage, ImageName } from "shared/domain/Gui";
import React from "@rbxts/react";
import Frame from "client/system-ui/components/frame";
import Object from "@rbxts/object-utils";
import Button from "./components/button";
import { clientStore } from "client/infra/store";
import { selectHolderPage } from "shared/infra/store/selectors/client";

const BUTTONS: Partial<Record<HolderPage, ImageName>> = {
	Settings: "Settings",
};

export default function ButtonsApp() {
	const buttons = Object.keys(BUTTONS).map((name) => {
		return (
			<Button
				button={name}
				image={BUTTONS[name]!}
				click={() => {
					const isCurrentPage = clientStore.getState(selectHolderPage) === name;
					clientStore.setHolderPage(isCurrentPage ? undefined : name);
				}}
			/>
		);
	});

	return (
		<Frame
			key="Buttons"
			layoutOrder={1}
			backgroundTransparency={1}
			size={new UDim2(0, 240, 0, 160)}
			automaticSize={Enum.AutomaticSize.Y}
		>
			<uigridlayout
				CellPadding={new UDim2(0, 15, 0, 15)}
				CellSize={new UDim2(0, 70, 0, 70)}
				SortOrder={Enum.SortOrder.LayoutOrder}
				VerticalAlignment={Enum.VerticalAlignment.Top}
				HorizontalAlignment={Enum.HorizontalAlignment.Right}
			/>

			{buttons}
		</Frame>
	);
}
