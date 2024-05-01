import axios from "axios";
import {BAGS} from "../utils/api.ts";
import {jwtHeader} from "../utils/header.ts";
import {BagModel} from "../models/bag.model.ts";

export const getBags = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(BAGS, jwtHeader(token!));
    return response.data;
}

export const postBag = async (bag: BagModel): Promise<BagModel> => {
    const token = localStorage.getItem('token');
    const response = await axios.post(BAGS, bag, jwtHeader(token!));
    return response.data;
}

export const patchBag = async (bag: Partial<BagModel>): Promise<BagModel> => {
    const token = localStorage.getItem('token');
    const response = await axios.patch(BAGS, bag, jwtHeader(token!));
    return response.data;
}

export const deleteBag = async (bag: BagModel): Promise<void> => {
    const token = localStorage.getItem('token');
    await axios.delete(BAGS + '/' + bag.bag_id, jwtHeader(token!));
}