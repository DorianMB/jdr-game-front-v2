import {UserModel} from "../models/user.model.ts";

export interface ConfigTable {
    columnsKeys: string[];
    columsTypes: string[];
    selectOptions?: SelectOptions;
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
    defaultData: {user_id: null, name: '', mail: '', is_admin: 0},
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
        defaultData: {
            character_id: null,
            picture: '',
            experience: 0,
            money: 0,
            user_id: 0,
            equipment_id: 0,
            stat_id: 0,
            bag_id: 0
        },
        actions: ['Edit', 'Delete', 'View'],
        canAdd: true
    }
}