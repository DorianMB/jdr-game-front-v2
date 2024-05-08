import axios from "axios";
import {ITEMS} from "../utils/api.ts";
import {jwtHeader} from "../utils/header.ts";
import {ItemModel, ItemModelCascade} from "../models/item.model.ts";

export const getItems = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(ITEMS, jwtHeader(token!));
    return response.data;
}

export const getItemById = async (id: number): Promise<ItemModelCascade> => {
    const token = localStorage.getItem('token');
    const response = await axios.get(ITEMS + '/' + id, jwtHeader(token!));
    return response.data;
}

export const postItem = async (item: ItemModel): Promise<ItemModel> => {
    const token = localStorage.getItem('token');
    const response = await axios.post(ITEMS, item, jwtHeader(token!));
    return response.data;
}

export const patchItem = async (item: Partial<ItemModel>): Promise<ItemModel> => {
    const token = localStorage.getItem('token');
    const response = await axios.patch(ITEMS, item, jwtHeader(token!));
    return response.data;
}

export const deleteItem = async (item: ItemModel): Promise<void> => {
    const token = localStorage.getItem('token');
    await axios.delete(ITEMS + '/' + item.item_id, jwtHeader(token!));
}

export const generateItemFromLootTable = async (lootTableId: number): Promise<ItemModel> => {
    const token = localStorage.getItem('token');
    const response = await axios.get(ITEMS + '/generate/' + lootTableId, jwtHeader(token!));
    return response.data;
}

export const equipItem = async (info: { item_id: number, bag_id: number, equipment_id: number }): Promise<boolean> => {
    const token = localStorage.getItem('token');
    const response = await axios.patch(ITEMS + '/equip', info, jwtHeader(token!));
    return response.data;
}

export const putInBag = async (info: { item_id: number, bag_id: number, equipment_id: number }): Promise<boolean> => {
    const token = localStorage.getItem('token');
    const response = await axios.patch(ITEMS + '/putInBag', info, jwtHeader(token!));
    return response.data;
}

export const sellItem = async (info: {
    item_id: number,
    bag_id: number,
    equipment_id: number,
    character_id: number
}): Promise<boolean> => {
    const token = localStorage.getItem('token');
    const response = await axios.patch(ITEMS + '/sell', info, jwtHeader(token!));
    return response.data;
}