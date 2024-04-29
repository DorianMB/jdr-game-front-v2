import axios from "axios";
import {CHARACTERS} from "../utils/api.ts";
import {jwtHeader} from "../utils/header.ts";
import {CharacterModel} from "../models/character.model.ts";

export const getCharacters = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(CHARACTERS, jwtHeader(token!));
    return response.data;
}

export const patchCharacter = async (data: CharacterModel) => {
    console.log(data);
}

export const deleteCharacter = async (data: CharacterModel) => {
    console.log(data.caracter_id);
}