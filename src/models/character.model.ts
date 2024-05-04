import {BagModel} from "./bag.model.ts";
import {UserModel} from "./user.model.ts";
import {EquipmentModel} from "./equipment.model.ts";
import {StatModel} from "./stat.model.ts";

export interface CharacterModel {
    character_id: number,
    name: string,
    picture: string,
    experience: number,
    money: number,
    user_id: number | UserModel,
    equipment_id: number | EquipmentModel,
    stat_id: number | StatModel,
    bag_id: number | BagModel,
    created_at: Date,
    updated_at: Date
}