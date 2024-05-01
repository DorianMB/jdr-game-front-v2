import axios from "axios";
import {STATS} from "../utils/api.ts";
import {jwtHeader} from "../utils/header.ts";
import {StatModel} from "../models/stat.model.ts";

export const getStats = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(STATS, jwtHeader(token!));
    return response.data;
}

export const postStat = async (stat: StatModel): Promise<StatModel> => {
    const token = localStorage.getItem('token');
    const response = await axios.post(STATS, stat, jwtHeader(token!));
    return response.data;
}

export const patchStat = async (stat: Partial<StatModel>): Promise<StatModel> => {
    const token = localStorage.getItem('token');
    const response = await axios.patch(STATS, stat, jwtHeader(token!));
    return response.data;
}

export const deleteStat = async (stat: StatModel): Promise<void> => {
    const token = localStorage.getItem('token');
    await axios.delete(STATS + '/' + stat.stat_id, jwtHeader(token!));
}