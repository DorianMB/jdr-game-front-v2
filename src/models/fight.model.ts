import {ItemModel} from "./item.model.ts";

export interface FightModel {
    enemy: Enemy;
    rounds: any[];
    isVictory: boolean;
    treasure: ItemModel;
}

export interface Enemy {
    name: string;
    level: number;
    stat: Stat;
    picture: string;
    fight_picture: string;
}
