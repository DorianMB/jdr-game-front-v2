import {getEquipmentById} from "../services/equipments.service.ts";

export const getCumulativeStatFromEquipment = async (
    equipment: Equipment,
    stat: string,
): Promise<number> => {
    const newEquip = await getEquipmentById(equipment.equipment_id);
    console.log('ici', newEquip, stat);
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