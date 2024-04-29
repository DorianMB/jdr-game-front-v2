import {adminGuard} from "../utils/auth.guard.ts";
import {useEffect, useState} from "react";
import {UserModel} from "../models/user.model.ts";
import CustomTable from "../Components/CustomTable.tsx";
import {deleteUser, getUsers, patchUser} from "../services/users.service.ts";
import {configTableCharacters, configTableUsers} from "../utils/config.tables.ts";
import {CharacterModel} from "../models/character.model.ts";
import {deleteCharacter, getCharacters, patchCharacter} from "../services/characters.service.ts";

function Admin() {
    const [users, setUsers] = useState<UserModel[]>([]);
    const [characters, setCharacters] = useState<CharacterModel[]>([]);
    const configAccordion = [
        {
            title: 'Users',
            content: <CustomTable config={configTableUsers} data={users as []}
                                  patchMethod={patchUser}
                                  deleteMethod={deleteUser}/>
        },
        {
            title: 'Characters',
            content: <CustomTable config={configTableCharacters(users)} data={characters as []}
                                  patchMethod={patchCharacter}
                                  deleteMethod={deleteCharacter}/>
        }
    ];

    useEffect(() => {
        adminGuard();
        getUsers().then((data) => setUsers(data));
        getCharacters().then((data) => setCharacters(data));
    }, []);

    return (
        <>
            <h1 className="text-center mt-5">Admin</h1>
            <div className="accordion w-75 mx-auto" id="accordionExample">
                {
                    configAccordion.map((item, index) => (
                        <div className="accordion-item" key={'accordion-item-' + index}>
                            <h2 className="accordion-header" id={'heading-' + index}>
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                        data-bs-target={'#collapse-' + index} aria-expanded="false"
                                        aria-controls={'collapse-' + index}>
                                    {item.title}
                                </button>
                            </h2>
                            <div id={'collapse-' + index} className="accordion-collapse collapse"
                                 aria-labelledby={'heading-' + index} data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                    {item.content}
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    );
}

export default Admin;