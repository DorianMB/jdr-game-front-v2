import {UserModel} from "../models/user.model.ts";
import {getRandomLootTable} from "../services/loot-tables.service.ts";

export interface ConfigTable {
    columnsKeys: string[];
    columsTypes: string[];
    selectOptions?: SelectOptions;
    isDisabled?: string[];
    defaultData?: object;
    actions?: string[];
    customActions?: { label: string, action: () => Promise<any>, color: string }[];
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

export const configTableLoot = {
    columnsKeys: ['loot_table_id', 'type', 'picture', 'fight_picture', 'name', 'description', 'rarity', 'damage_min', 'damage_max', 'armor_min', 'armor_max', 'strength_min', 'strength_max', 'intelligence_min', 'intelligence_max', 'speed_min', 'speed_max', 'charisma_min', 'charisma_max', 'health_min', 'health_max', 'luck_min', 'luck_max', 'charm', 'charm_type', 'charm_value', 'created_at', 'updated_at'],
    columsTypes: ['number', 'select', 'url', 'url', 'string', 'string', 'select', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'number', 'select', 'select', 'number', 'date', 'date'],
    isDisabled: ["loot_table_id", "created_at", "updated_at"],
    selectOptions: {
        type: [
            {value: 'helmet', label: 'helmet'},
            {value: 'chestplate', label: 'chestplate'},
            {value: 'gloves', label: 'gloves'},
            {value: 'boots', label: 'boots'},
            {value: 'sword', label: 'sword'},
            {value: 'shield', label: 'shield'},
            {value: 'bow', label: 'bow'},
            {value: 'arrow', label: 'arrow'},
            {value: 'magic_wand', label: 'magic_wand'},
            {value: 'magic_book', label: 'magic_book'},
            {value: 'magic_item', label: 'magic_item'}
        ],
        rarity: [
            {value: 'common', label: 'common'},
            {value: 'uncommun', label: 'uncommun'},
            {value: 'rare', label: 'rare'},
            {value: 'epic', label: 'epic'},
            {value: 'legendary', label: 'legendary'}
        ],
        charm: [{value: 0, label: 'false'}, {value: 1, label: 'true'}],
        charm_type: [
            {value: 'xp_boost', label: 'xp_boost'},
            {value: 'gold_boost', label: 'gold_boost'},
            {value: 'looting_boost', label: 'looting_boost'},
            {value: 'first_attack_boost', label: 'first_attack_boost'}
        ]
    },
    defaultData: {
        loot_table_id: null,
        type: 'helmet',
        picture: '',
        fight_picture: '',
        name: '',
        description: '',
        rarity: 'common',
        damage_min: 0,
        damage_max: 0,
        armor_min: 0,
        armor_max: 0,
        strength_min: 0,
        strength_max: 0,
        intelligence_min: 0,
        intelligence_max: 0,
        speed_min: 0,
        speed_max: 0,
        charisma_min: 0,
        charisma_max: 0,
        health_min: 0,
        health_max: 0,
        luck_min: 0,
        luck_max: 0,
        charm: 0,
        charm_type: '',
        charm_value: 0,
        created_at: '',
        updated_at: ''
    },
    actions: ['Edit', 'Delete', 'View', 'Generate'],
    customActions: [
        {
            label: 'Random',
            action: async () => {
                return await getRandomLootTable();
            },
            color: 'primary'
        }
    ],
    canAdd: true
};

export const configTableItem = {
    columnsKeys: ['item_id', 'loot_id', 'bag_id', 'level', 'price', 'rarity', 'strength', 'intelligence', 'speed', 'charisma', 'health', 'luck', 'charm', 'charm_type', 'charm_value', 'created_at', 'updated_at'],
    columsTypes: ['number', 'number', 'number', 'number', 'number', 'select', 'number', 'number', 'number', 'number', 'number', 'number', 'select', 'select', 'number', 'date', 'date'],
    isDisabled: ["item_id", "created_at", "updated_at"],
    selectOptions: {
        rarity: [
            {value: 'common', label: 'common'},
            {value: 'uncommun', label: 'uncommun'},
            {value: 'rare', label: 'rare'},
            {value: 'epic', label: 'epic'},
            {value: 'legendary', label: 'legendary'}
        ],
        charm: [{value: 0, label: 'false'}, {value: 1, label: 'true'}],
        charm_type: [
            {value: 'xp_boost', label: 'xp_boost'},
            {value: 'gold_boost', label: 'gold_boost'},
            {value: 'looting_boost', label: 'looting_boost'},
            {value: 'first_attack_boost', label: 'first_attack_boost'}
        ]
    },
    defaultData: {
        item_id: null,
        loot_id: '',
        bag_id: '',
        level: 0,
        price: 0,
        rarity: 'common',
        strength: 0,
        intelligence: 0,
        speed: 0,
        charisma: 0,
        health: 0,
        luck: 0,
        charm: 0,
        charm_type: '',
        charm_value: 0,
        created_at: '',
        updated_at: ''
    },
    actions: ['Edit', 'Delete', 'View'],
    canAdd: true
};

