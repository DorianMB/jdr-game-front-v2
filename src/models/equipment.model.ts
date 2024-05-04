import {ItemModelCascade} from "./item.model.ts";

export interface EquipmentModel {
    equipment_id: number;
    helmet_id: number;
    chestplate_id: number;
    gloves_id: number;
    boots_id: number;
    primary_weapon_id: number;
    secondary_weapon_id: number;
    primary_magic_item_id: number;
    secondary_magic_item_id: number;
    created_at: Date;
    updated_at: Date;
}

export interface EquipmentModelCascade {
    equipment_id: number;
    helmet_id: ItemModelCascade;
    chestplate_id: ItemModelCascade;
    gloves_id: ItemModelCascade;
    boots_id: ItemModelCascade;
    primary_weapon_id: ItemModelCascade;
    secondary_weapon_id: ItemModelCascade;
    primary_magic_item_id: ItemModelCascade;
    secondary_magic_item_id: ItemModelCascade;
    created_at: Date;
    updated_at: Date;
}