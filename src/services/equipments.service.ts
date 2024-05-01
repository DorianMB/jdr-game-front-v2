import axios from "axios";
import {EQUIPMENTS} from "../utils/api.ts";
import {jwtHeader} from "../utils/header.ts";
import {EquipmentModel} from "../models/equipment.model.ts";

export const getEquipments = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(EQUIPMENTS, jwtHeader(token!));
    return response.data;
}

export const postEquipment = async (equipment: EquipmentModel): Promise<EquipmentModel> => {
    const token = localStorage.getItem('token');
    const response = await axios.post(EQUIPMENTS, equipment, jwtHeader(token!));
    return response.data;
}

export const patchEquipment = async (equipment: Partial<EquipmentModel>): Promise<EquipmentModel> => {
    const token = localStorage.getItem('token');
    const response = await axios.patch(EQUIPMENTS, equipment, jwtHeader(token!));
    return response.data;
}

export const deleteEquipment = async (equipment: EquipmentModel): Promise<void> => {
    const token = localStorage.getItem('token');
    await axios.delete(EQUIPMENTS + '/' + equipment.equipment_id, jwtHeader(token!));
}