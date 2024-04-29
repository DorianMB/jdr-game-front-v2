import axios from "axios";
import {USERS} from "../utils/api.ts";
import {jwtHeader} from "../utils/header.ts";
import {UserModel} from "../models/user.model.ts";

export const getUsers = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(USERS, jwtHeader(token!));
    return response.data;
}

export const patchUser = async (user: Partial<UserModel>): Promise<UserModel> => {
    const token = localStorage.getItem('token');
    const response = await axios.patch(USERS, user, jwtHeader(token!));
    return response.data;
}

export const deleteUser = async (user: UserModel): Promise<void> => {
    console.log(user.user_id);
}