import {adminGuard} from "../utils/auth.guard.ts";
import {useEffect, useState} from "react";
import {UserModel} from "../models/user.model.ts";
import CustomTable from "../Components/CustomTable.tsx";
import {deleteUser, getUsers, patchUser, postUser} from "../services/users.service.ts";
import {
    configTableBags,
    configTableCharacters,
    configTableEquipments,
    configTableItem,
    configTableLoot,
    configTableStats,
    configTableUsers
} from "../utils/config.tables.ts";
import {CharacterModel} from "../models/character.model.ts";
import {deleteCharacter, getCharacters, patchCharacter, postCharacter} from "../services/characters.service.ts";
import {JSX} from "react/jsx-runtime";
import {BagModel} from "../models/bag.model.ts";
import {deleteBag, getBags, patchBag, postBag} from "../services/bags.service.ts";
import {deleteEquipment, getEquipments, patchEquipment, postEquipment} from "../services/equipments.service.ts";
import {EquipmentModel} from "../models/equipment.model.ts";
import {deleteStat, getStats, patchStat, postStat} from "../services/stats.service.ts";
import {StatModel} from "../models/stat.model.ts";
import {LootTableModel} from "../models/loot-table.model.ts";
import {ItemModel} from "../models/item.model.ts";
import {deleteLootTable, getLootTables, patchLootTable, postLootTable} from "../services/loot-tables.service.ts";
import {deleteItem, generateItemFromLootTable, getItems, patchItem, postItem} from "../services/items.service.ts";

function Admin() {
    const [users, setUsers] = useState<UserModel[]>([]);
    const [characters, setCharacters] = useState<CharacterModel[]>([]);
    const [bags, setBags] = useState<BagModel[]>([]);
    const [equipments, setEquipments] = useState<EquipmentModel[]>([]);
    const [stats, setStats] = useState<StatModel[]>([]);
    const [lootTables, setLootTables] = useState<LootTableModel[]>([]);
    const [items, setItems] = useState<ItemModel[]>([]);
    const [configTabs, setConfigTabs] = useState<{
        title: string,
        refreshData: () => void,
        content: JSX.Element
    }[]>([]);

    useEffect(() => {
        adminGuard();
        refreshUsers();
        refreshCaracters();
        refreshBags();
        refreshEquipments();
        refreshStats();
        refreshLootTables();
        refreshItems();
    }, []);

    useEffect(() => {
        if (users.length > 0 && characters) {
            setConfigTabs([
                {
                    title: 'Users',
                    refreshData: refreshUsers,
                    content: <CustomTable name={'Users'} config={configTableUsers} data={users}
                                          postMethod={postUser} patchMethod={patchUser}
                                          deleteMethod={deleteUser}
                                          refreshData={refreshUsers}/>
                },
                {
                    title: 'Characters',
                    refreshData: refreshCaracters,
                    content: <CustomTable name={'Characters'} config={configTableCharacters(users)} data={characters}
                                          postMethod={postCharacter} patchMethod={patchCharacter}
                                          deleteMethod={deleteCharacter}
                                          refreshData={refreshCaracters}/>
                },
                {
                    title: 'Bags',
                    refreshData: refreshBags,
                    content: <CustomTable name={'Bags'} config={configTableBags} data={bags}
                                          postMethod={postBag} patchMethod={patchBag}
                                          deleteMethod={deleteBag}
                                          refreshData={refreshBags}/>
                },
                {
                    title: 'Equipments',
                    refreshData: refreshEquipments,
                    content: <CustomTable name={'Equipments'} config={configTableEquipments} data={equipments}
                                          postMethod={postEquipment} patchMethod={patchEquipment}
                                          deleteMethod={deleteEquipment}
                                          refreshData={refreshEquipments}/>
                },
                {
                    title: 'Stats',
                    refreshData: refreshStats,
                    content: <CustomTable name={'Stats'} config={configTableStats} data={stats}
                                          postMethod={postStat} patchMethod={patchStat}
                                          deleteMethod={deleteStat}
                                          refreshData={refreshStats}/>
                },
                {
                    title: 'Loot Tables',
                    refreshData: refreshLootTables,
                    content: <CustomTable name={'LootTables'} config={configTableLoot} data={lootTables}
                                          postMethod={postLootTable} patchMethod={patchLootTable}
                                          deleteMethod={deleteLootTable} generateMethod={generateItemFromLootTable}
                                          refreshData={refreshLootTables}/>
                },
                {
                    title: 'Items',
                    refreshData: refreshItems,
                    content: <CustomTable name={'Items'} config={configTableItem} data={items}
                                          postMethod={postItem} patchMethod={patchItem}
                                          deleteMethod={deleteItem}
                                          refreshData={refreshItems}/>
                },
            ]);
        }
    }, [users, characters, stats, bags, equipments, lootTables, items]);

    const refreshUsers = () => {
        getUsers().then((data) => {
            setUsers(data);
        });
    }

    const refreshCaracters = () => {
        getCharacters().then((data) => {
            setCharacters(data)
        });
    }

    const refreshBags = () => {
        getBags().then((data) => {
            setBags(data)
        });
    }

    const refreshEquipments = () => {
        getEquipments().then((data) => {
            setEquipments(data)
        });
    }

    const refreshStats = () => {
        getStats().then((data) => {
            setStats(data)
        });
    }

    const refreshLootTables = () => {
        getLootTables().then((data) => {
            setLootTables(data)
        });
    }

    const refreshItems = () => {
        getItems().then((data) => {
            setItems(data)
        });
    }

    return (
        <>
            <h1 className="text-center mt-5">Admin</h1>
            <ul className="nav nav-tabs justify-content-center mt-4" id="adminTab" role="tablist">
                {
                    configTabs && configTabs.map((item, index) => (
                        <li className="nav-item" role="presentation" key={'nav-item-' + index}>
                            <button className={`nav-link ${index === 0 ? 'active' : ''}`} id={`tab-${index}`}
                                    onClick={item.refreshData}
                                    data-bs-toggle="tab" data-bs-target={`#tab-content-${index}`} type="button"
                                    role="tab" aria-controls={`tab-content-${index}`} aria-selected="true">
                                {item.title}
                            </button>
                        </li>
                    ))
                }
            </ul>
            <div className="tab-content" id="adminTabContent">
                {
                    configTabs && configTabs.map((item, index) => (
                        <div className={`w-75 mx-auto mt-5 tab-pane fade ${index === 0 ? 'show active' : ''}`}
                             id={`tab-content-${index}`} role="tabpanel" aria-labelledby={`tab-${index}`}
                             key={'tab-content-' + index}>
                            {item.content}
                        </div>
                    ))
                }
            </div>
        </>
    );
}

export default Admin;