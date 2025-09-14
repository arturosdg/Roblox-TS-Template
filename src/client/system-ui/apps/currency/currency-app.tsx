import CurrencyFrame from "./components/currency-frame";
import { CURRENCIES } from "shared/domain/Currency";
import React from "@rbxts/react";
import Frame from "client/system-ui/components/frame";

export default function CurrencyApp() {
	const currencyFrames = CURRENCIES.map((currency) => {
		return <CurrencyFrame currency={currency} />;
	});

	return (
		<Frame key="Currency" backgroundTransparency={1} automaticSize={Enum.AutomaticSize.XY} layoutOrder={0}>
			{currencyFrames}

			<uilistlayout Padding={new UDim(0, 15)} />
		</Frame>
	);
}
