import {LootTableModel} from "./loot-table.model.ts";

export interface ItemModel {
    item_id: number;
    loot_id: number;
    bag_id: number;
    level: number;
    price: number;
    rarity: string;
    strength: number;
    intelligence: number;
    speed: number;
    charisma: number;
    health: number;
    luck: number;
    charm: boolean;
    charm_type: string;
    created_at: Date;
    updated_at: Date;
}

export interface ItemModelCascade {
    item_id: number;
    loot_id: LootTableModel;
    bag_id: number;
    level: number;
    price: number;
    rarity: string;
    strength: number;
    intelligence: number;
    speed: number;
    charisma: number;
    health: number;
    luck: number;
    charm: boolean;
    charm_type: string;
    created_at: Date;
    updated_at: Date;
}