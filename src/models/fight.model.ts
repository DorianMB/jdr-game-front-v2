import {ItemModelCascade} from "./item.model.ts";
import {StatModel} from "./stat.model.ts";

export interface FightModel {
    enemy: Enemy;
    rounds: any[];
    isVictory: boolean;
    treasure: ItemModelCascade;
}

export interface Enemy {
    name: string;
    level: number;
    stat: StatModel;
    picture: string;
    fight_picture: string;
}
