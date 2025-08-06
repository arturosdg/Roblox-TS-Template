/// <reference types="@rbxts/testez/globals" />

import { RunService } from "@rbxts/services";
import { serverStore } from "server/store";

export = () => {
    afterAll( () => {
        if ( RunService.IsRunMode() ) {
            return;
        }

        serverStore.destroy();
    } );
};
