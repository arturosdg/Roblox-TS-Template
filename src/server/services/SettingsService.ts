import { Service, OnStart } from "@flamework/core";
import { ServerEvents } from "server/network";
import { serverStore } from "server/store";
import { Setting } from "shared/configs/Settings";

@Service({})
export class SettingsService implements OnStart {
    onStart() {
        ServerEvents.toggleSetting.connect((player, setting) => this.toggleSetting(player, setting));
    }

    private toggleSetting ( player: Player, setting: Setting ) {
        serverStore.toggleSetting( tostring( player.UserId ), setting )
    }
}
