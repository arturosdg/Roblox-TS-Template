import { Currency } from "shared/domain/Currency";
import { Setting } from "shared/domain/Settings";

export interface PlayerData {
    balance: PlayerBalance
    settings: PlayerSettings
}

export type PlayerBalance = Record<Currency, number>;

export type PlayerSettings = Record<Setting, boolean>;
