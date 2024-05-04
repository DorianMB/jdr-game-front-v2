import {BagModel} from "./bag.model.ts";
import {UserModel} from "./user.model.ts";
import {EquipmentModelCascade} from "./equipment.model.ts";
import {StatModel} from "./stat.model.ts";

export interface CharacterModel {
    character_id: number,
    name: string,
    picture: string,
    experience: number,
    money: number,
    user_id: number,
    equipment_id: number,
    stat_id: number,
    bag_id: number,
    created_at: Date,
    updated_at: Date
}

export interface CharacterModelCascade {
    character_id: number,
    name: string,
    picture: string,
    experience: number,
    money: number,
    user_id: UserModel,
    equipment_id: EquipmentModelCascade,
    stat_id: StatModel,
    bag_id: BagModel,
    created_at: Date,
    updated_at: Date
}