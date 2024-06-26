import {getEquipmentById} from "../services/equipments.service.ts";
import {EquipmentModelCascade} from "../models/equipment.model.ts";
import {ItemModelCascade} from "../models/item.model.ts";
import {t} from "i18next";

export const getCumulativeStatFromEquipment = async (
    equipment: EquipmentModelCascade,
    stat: string,
): Promise<number> => {
    const newEquip = await getEquipmentById(equipment.equipment_id);
    let cumulative = 0;
    if (newEquip.helmet_id && newEquip.helmet_id[stat]) {
        cumulative += newEquip.helmet_id[stat];
    }
    if (newEquip.chestplate_id && newEquip.chestplate_id[stat]) {
        cumulative += newEquip.chestplate_id[stat];
    }
    if (newEquip.gloves_id && newEquip.gloves_id[stat]) {
        cumulative += newEquip.gloves_id[stat];
    }
    if (newEquip.boots_id && newEquip.boots_id[stat]) {
        cumulative += newEquip.boots_id[stat];
    }
    if (newEquip.primary_weapon_id && newEquip.primary_weapon_id[stat]) {
        cumulative += newEquip.primary_weapon_id[stat];
    }
    if (newEquip.secondary_weapon_id && newEquip.secondary_weapon_id[stat]) {
        cumulative += newEquip.secondary_weapon_id[stat];
    }
    if (
        newEquip.primary_magic_item_id &&
        newEquip.primary_magic_item_id[stat]
    ) {
        cumulative += newEquip.primary_magic_item_id[stat];
    }
    if (
        newEquip.secondary_magic_item_id &&
        newEquip.secondary_magic_item_id[stat]
    ) {
        cumulative += newEquip.secondary_magic_item_id[stat];
    }
    return stat === 'health'
        ? Math.floor(cumulative / 2)
        : Math.floor(cumulative / 10);
};

export const tooltip = (item: ItemModelCascade): string => {
    let result = '';
    if (item) {
        const keysToShowInItem = ['rarity', 'price', 'level', 'strength', 'intelligence', 'speed', 'charisma', 'health', 'luck'];
        if (item.charm) {
            keysToShowInItem.push('charm_type', 'charm_value');
        }

        // Parcourir les autres propriétés
        Object.entries(item).forEach(([key, value]) => {
            if (key !== 'loot_id' && keysToShowInItem.includes(key)) {
                result += `<div><b>${t('entities.item.' + key)} :</b> ${value !== null ? value : ''}</div>`;
            }
        });
    }
    return `<div>${result}</div>`;
}