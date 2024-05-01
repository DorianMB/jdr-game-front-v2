import axios from "axios";
import {ITEMS} from "../utils/api.ts";
import {jwtHeader} from "../utils/header.ts";
import {ItemModel} from "../models/item.model.ts";

export const getItems = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(ITEMS, jwtHeader(token!));
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