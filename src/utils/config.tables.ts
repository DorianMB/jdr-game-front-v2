import {UserModel} from "../models/user.model.ts";

export interface ConfigTable {
    columnsKeys: string[];
    columsTypes: string[];
    selectOptions?: SelectOptions;
    isDisabled?: string[];
    defaultData?: object;
    actions?: string[];
    canAdd?: boolean;
}

interface SelectOptions {
    [key: string]: SelectOption[];
}

interface SelectOption {
    value: number | string;
    label: string;
}

export const configTableUsers = {
    columnsKeys: ['user_id', 'name', 'mail', 'is_admin', 'created_at', 'updated_at'],
    columsTypes: ['number', 'string', 'string', 'select', 'date', 'date'],
    selectOptions: {
        is_admin: [{value: 0, label: 'false'}, {value: 1, label: 'true'}]
    },
    isDisabled: ["user_id", "created_at", "updated_at"],
    defaultData: {user_id: null, name: '', mail: '', is_admin: 0, created_at: '', updated_at: ''},
    actions: ['Edit', 'Delete'],
    canAdd: false
};

export const configTableCharacters = (users: UserModel[]): ConfigTable => {
    const optionUser: SelectOption[] = users.map((user: UserModel) => ({value: user.user_id, label: user.name}));
    return {
        columnsKeys: ['character_id', 'name', 'picture', 'experience', 'money', 'user_id', 'equipment_id', 'stat_id', 'bag_id', 'created_at', 'updated_at'],
        columsTypes: ['number', 'string', 'url', 'number', 'number', 'select', 'number', 'number', 'number', 'date', 'date'],
        selectOptions: {
            user_id: optionUser
        },
        isDisabled: ["character_id", "created_at", "updated_at"],
        defaultData: {
            character_id: null,
            picture: '',
            experience: 0,
            money: 0,
            user_id: 0,
            equipment_id: 0,
            stat_id: 0,
            bag_id: 0,
            created_at: '',
            updated_at: ''
        },
        actions: ['Edit', 'Delete', 'View'],
        canAdd: true
    }
}

export const configTableBags = {
    columnsKeys: ['bag_id', 'length', 'created_at', 'updated_at'],
    columsTypes: ['number', 'number', 'date', 'date'],
    isDisabled: ["bag_id", "created_at", "updated_at"],
    defaultData: {bag_id: null, length: '', created_at: '', updated_at: ''},
    actions: ['Edit', 'Delete', 'View'],
    canAdd: true
};

export const configTableEquipments = {
    columnsKeys: ['equipment_id', 'helmet_id', 'chestplate_id', 'gloves_id', 'boots_id', 'primary_weapon_id', 'secondary_weapon_id', 'primary_magic_item_id', 'secondary_magic_item_id', 'created_at', 'updated_at'],
    columsTypes: ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'date', 'date'],
    isDisabled: ["equipment_id", "created_at", "updated_at"],
    defaultData: {
        equipment_id: null,
        helmet_id: '',
        chestplate_id: '',
        gloves_id: '',
        boots_id: '',
        primary_weapon_id: '',
        secondary_weapon_id: '',
        primary_magic_item_id: '',
        secondary_magic_item_id: '',
        created_at: '',
        updated_at: ''
    },
    actions: ['Edit', 'Delete', 'View'],
    canAdd: true
};

export const configTableStats = {
    columnsKeys: ['stat_id', 'strength', 'intelligence', 'speed', 'charisma', 'health', 'luck', 'created_at', 'updated_at'],
    columsTypes: ['number', 'number', 'number', 'number', 'number', 'number', 'number', 'date', 'date'],
    isDisabled: ["stat_id", "created_at", "updated_at"],
    defaultData: {
        stat_id: null,
        strength: '',
        intelligence: '',
        speed: '',
        charisma: '',
        health: '',
        luck: '',
        created_at: '',
        updated_at: ''
    },
    actions: ['Edit', 'Delete', 'View'],
    canAdd: true
};