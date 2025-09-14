import { useSelector } from "@rbxts/react-reflex";
import React from "@rbxts/react";
import { ClientEvents } from "client/infra/network";
import TextLabel from "client/system-ui/components/textLabel";
import { Setting } from "shared/domain/Settings";
import { RunService } from "@rbxts/services";
import { selectPlayerSetting } from "shared/infra/store/selectors/players";
import { GetStatePlayerId } from "client/system-ui/utils/GetStatePlayerId";
import { clientStore } from "client/infra/store";
import { COLORS } from "shared/domain/Gui";
import TextButton from "client/system-ui/components/textButton";

interface Props {
	setting: Setting;
}

export default function SettingButton(props: Props) {
	const value = useSelector(selectPlayerSetting(GetStatePlayerId(), props.setting));

	const click = () => {
		const isInGame = RunService.IsRunning();
		if (isInGame) ClientEvents.toggleSetting(props.setting);
		else clientStore.toggleSetting(GetStatePlayerId(), props.setting);
	};

	return (
		<TextButton
			key={props.setting}
			backgroundColor3={Color3.fromRGB(0, 137, 215)}
			onClick={click}
			uiStrokeSize={0}
			uiCornerSize={new UDim(0, 10)}
		>
			<TextButton
				key="Toggle"
				backgroundColor3={value ? COLORS.Buttons.On : COLORS.Buttons.Off}
				position={new UDim2(0, 480, 0, 18)}
				size={new UDim2(0, 30, 0, 30)}
				layoutOrder={-1}
				onClick={click}
				uiCornerSize={new UDim(0, 10)}
				uiStrokeSize={3}
			/>

			<TextLabel
				key={props.setting}
				text={props.setting}
				textSize={32}
				automaticSize={Enum.AutomaticSize.XY}
				textXAlignment={Enum.TextXAlignment.Left}
				uiStrokeSize={3}
			/>

			<uistroke ApplyStrokeMode={Enum.ApplyStrokeMode.Border} Color={Color3.fromRGB(0, 52, 82)} Thickness={3} />
			<uilistlayout
				FillDirection={Enum.FillDirection.Horizontal}
				HorizontalAlignment={Enum.HorizontalAlignment.Left}
				SortOrder={Enum.SortOrder.LayoutOrder}
				VerticalAlignment={Enum.VerticalAlignment.Center}
				Padding={new UDim(0, 10)}
			/>
			<uipadding PaddingLeft={new UDim(0, 10)} />
		</TextButton>
	);
}
