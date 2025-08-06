import { Service, OnStart } from "@flamework/core";
import { ServerEvents } from "server/infra/network";
import { serverStore } from "server/infra/store";
import { Setting } from "shared/domain/Settings";

@Service({})
export class SettingsService implements OnStart {
    onStart() {
        ServerEvents.toggleSetting.connect((player, setting) => this.toggleSetting(player, setting));
    }

    private toggleSetting ( player: Player, setting: Setting ) {
        serverStore.toggleSetting( tostring( player.UserId ), setting )
    }
}
