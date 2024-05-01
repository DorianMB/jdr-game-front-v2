import {adminGuard} from "../utils/auth.guard.ts";
import {useEffect, useState} from "react";
import {UserModel} from "../models/user.model.ts";
import CustomTable from "../Components/CustomTable.tsx";
import {deleteUser, getUsers, patchUser, postUser} from "../services/users.service.ts";
import {
    configTableBags,
    configTableCharacters,
    configTableEquipments,
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

function Admin() {
    const [users, setUsers] = useState<UserModel[]>([]);
    const [characters, setCharacters] = useState<CharacterModel[]>([]);
    const [bags, setBags] = useState<BagModel[]>([]);
    const [equipments, setEquipments] = useState<EquipmentModel[]>([]);
    const [stats, setStats] = useState<StatModel[]>([]);
    const [configTabs, setConfigTabs] = useState<{ title: string, content: JSX.Element }[]>([]);

    useEffect(() => {
        adminGuard();
        refreshUsers();
        refreshCaracters();
        refreshBags();
        refreshEquipments();
        refreshStats();
    }, []);

    useEffect(() => {
        if (users.length > 0 && characters) {
            setConfigTabs([
                {
                    title: 'Users',
                    content: <CustomTable name={'Users'} config={configTableUsers} data={users}
                                          postMethod={postUser} patchMethod={patchUser}
                                          deleteMethod={deleteUser}
                                          refreshData={refreshUsers}/>
                },
                {
                    title: 'Characters',
                    content: <CustomTable name={'Characters'} config={configTableCharacters(users)} data={characters}
                                          postMethod={postCharacter} patchMethod={patchCharacter}
                                          deleteMethod={deleteCharacter}
                                          refreshData={refreshCaracters}/>
                },
                {
                    title: 'Bags',
                    content: <CustomTable name={'Bags'} config={configTableBags} data={bags}
                                          postMethod={postBag} patchMethod={patchBag}
                                          deleteMethod={deleteBag}
                                          refreshData={refreshBags}/>
                },
                {
                    title: 'Equipments',
                    content: <CustomTable name={'Equipments'} config={configTableEquipments} data={equipments}
                                          postMethod={postEquipment} patchMethod={patchEquipment}
                                          deleteMethod={deleteEquipment}
                                          refreshData={refreshEquipments}/>
                },
                {
                    title: 'Stats',
                    content: <CustomTable name={'Stats'} config={configTableStats} data={stats}
                                          postMethod={postStat} patchMethod={patchStat}
                                          deleteMethod={deleteStat}
                                          refreshData={refreshStats}/>
                },
            ]);
        }
    }, [users, characters]);

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

    return (
        <>
            <h1 className="text-center mt-5">Admin</h1>
            <ul className="nav nav-tabs px-5" id="adminTab" role="tablist">
                {
                    configTabs && configTabs.map((item, index) => (
                        <li className="nav-item" role="presentation" key={'nav-item-' + index}>
                            <button className={`nav-link ${index === 0 ? 'active' : ''}`} id={`tab-${index}`}
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