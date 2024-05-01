import axios from "axios";
import {LOOTTABLES} from "../utils/api.ts";
import {jwtHeader} from "../utils/header.ts";
import {LootTableModel} from "../models/loot-table.model.ts";

export const getLootTables = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(LOOTTABLES, jwtHeader(token!));
    return response.data;
}

export const postLootTable = async (lootTable: LootTableModel): Promise<LootTableModel> => {
    const token = localStorage.getItem('token');
    const response = await axios.post(LOOTTABLES, lootTable, jwtHeader(token!));
    return response.data;
}

export const patchLootTable = async (lootTable: Partial<LootTableModel>): Promise<LootTableModel> => {
    const token = localStorage.getItem('token');
    const response = await axios.patch(LOOTTABLES, lootTable, jwtHeader(token!));
    return response.data;
}

export const deleteLootTable = async (lootTable: LootTableModel): Promise<void> => {
    const token = localStorage.getItem('token');
    await axios.delete(LOOTTABLES + '/' + lootTable.loot_table_id, jwtHeader(token!));
}