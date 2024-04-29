import {UserModel} from "../models/user.model.ts";

export interface ConfigTable {
    columnsKeys: string[];
    columsTypes: string[];
    selectOptions?: SelectOptions;
    actions?: string[];
}

interface SelectOptions {
    [key: string]: SelectOption[];
}

interface SelectOption {
    value: number | string;
    label: string;
}

export const configTableUsers = {
    columnsKeys: ['user_id', 'name', 'mail', 'is_admin'],
    columsTypes: ['number', 'string', 'string', 'select'],
    selectOptions: {
        is_admin: [{value: 0, label: 'false'}, {value: 1, label: 'true'}]
    },
    actions: ['Edit', 'Delete']
};

export const configTableCharacters = (users: UserModel[]): ConfigTable => {
    const optionUser: SelectOption[] = users.map((user: UserModel) => ({value: user.user_id, label: user.name}));
    return {
        columnsKeys: ['caracter_id', 'picture', 'experience', 'money', 'user_id', 'equipment_id', 'stat_id', 'bag_id'],
        columsTypes: ['number', 'string', 'number', 'number', 'select', 'number', 'number', 'number'],
        selectOptions: {
            user_id: optionUser
        },
        actions: ['Edit', 'Delete']
    }
}