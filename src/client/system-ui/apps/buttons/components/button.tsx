import React from "@rbxts/react"
import ImageLabel from "client/system-ui/components/imageLabel"
import TextButton from "client/system-ui/components/textButton"
import TextLabel from "client/system-ui/components/textLabel"
import { COLORS, ImageName } from "shared/domain/Gui"

interface Props {
    button: string,
    image: ImageName,
    click: () => void
}

export default function Button ( props: Props ) {
    return (
        <TextButton
            key={props.button}
            backgroundColor3={COLORS.PrimaryBackground}
            onClick={props.click}
            uiCornerSize={new UDim( 0, 35 )}
            uiStrokeSize={4}
        >
            <ImageLabel
                image={props.image}
                position={new UDim2( 0.5, 0, .5, 0 )}
                anchorPoint={new Vector2( 0.5, .5 )}
                size={new UDim2( 0.85, 0, 0.85, 0 )}
            />
            <TextLabel
                anchorPoint={new Vector2( 0.5, 1 )}
                position={new UDim2( 0.5, 0, 1, 10 )}
                size={new UDim2( 1, 0, 0, 20 )}
                text={props.button}
                textSize={20}
                uiStrokeSize={2}
            />
        </TextButton >
    )
}
