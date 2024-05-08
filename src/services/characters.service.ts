import axios from "axios";
import {CHARACTERS, CHARACTERS_FIGHT, CHARACTERS_USER} from "../utils/api.ts";
import {jwtHeader} from "../utils/header.ts";
import {CharacterModel} from "../models/character.model.ts";

export const getCharacters = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(CHARACTERS, jwtHeader(token!));
    return response.data;
}

export const getCharacterById = async (id: number) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(CHARACTERS + '/' + id, jwtHeader(token!));
    return response.data;
}

export const getCharacterByUserId = async (user_id: number) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(CHARACTERS_USER + '/' + user_id, jwtHeader(token!));
    return response.data;
}

export const postCharacter = async (data: CharacterModel) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(CHARACTERS, data, jwtHeader(token!));
    return response.data;
}

export const patchCharacter = async (data: CharacterModel) => {
    const token = localStorage.getItem('token');
    const response = await axios.patch(CHARACTERS, data, jwtHeader(token!));
    return response.data;
}

export const deleteCharacter = async (data: CharacterModel): Promise<void> => {
    const token = localStorage.getItem('token');
    await axios.delete(CHARACTERS + '/' + data.character_id, jwtHeader(token!));
}

export const simulateFight = async (id: number) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(CHARACTERS_FIGHT + '/' + id, jwtHeader(token!));
    return response.data;
}