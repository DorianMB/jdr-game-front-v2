export const BASE_URL = import.meta.env.VITE_API_URL;
export const BACK_PING = BASE_URL + '/hello';
export const SIGNIN = BASE_URL + '/auth/signin';
export const SIGNUP = BASE_URL + '/auth/signup';

// users
export const USERS = BASE_URL + '/users';

// characters
export const CHARACTERS = BASE_URL + '/characters';
export const CHARACTERS_USER = CHARACTERS + '/user';
export const CHARACTERS_FIGHT = CHARACTERS + '/fight';

// bags
export const BAGS = BASE_URL + '/bags';
export const BAGS_ITEMS = BAGS + '/items';

// equipments
export const EQUIPMENTS = BASE_URL + '/equipments';

// stats
export const STATS = BASE_URL + '/stats';

// loot-tables
export const LOOTTABLES = BASE_URL + '/loot-tables';

// items
export const ITEMS = BASE_URL + '/items';
export const ITEMS_GENERATE = ITEMS + '/generate';
export const ITEMS_EQUIP = ITEMS + '/equip';
export const ITEMS_PUTINBAG = ITEMS + '/putInBag';
export const ITEMS_SELL = ITEMS + '/sell';