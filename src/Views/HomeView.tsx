import {useEffect, useState} from 'react'
import {authGuard} from "../utils/auth.guard.ts";
import {parseJwt} from "../utils/jwt.ts";
import {CharacterModel} from "../models/character.model.ts";
import {getCharacterByUserId, postCharacter} from "../services/characters.service.ts";
import {useNavigate} from "react-router-dom";
import {RiAddLine} from "@remixicon/react";
import {useTranslation} from "react-i18next";

function HomeView() {
    const [decodedToken, setDecodedToken] = useState<{ username: string, sub: number } | null>(null);
    const [characters, setCharacters] = useState<CharacterModel[]>([]);
    const [newCharacter, setNewCharacter] = useState<CharacterModel>({} as CharacterModel);
    const navigate = useNavigate();

    const {t} = useTranslation();

    useEffect(() => {
        authGuard();
        const token = localStorage.getItem('token');
        const decodedToken = parseJwt(token!);
        setDecodedToken(decodedToken)
    }, [])

    useEffect(() => {
        refreshCaracters();
    }, [decodedToken]);

    const refreshCaracters = () => {
        if (!decodedToken) return;
        getCharacterByUserId(decodedToken.sub).then((data) => {
            setCharacters(data)
        });
    }

    const navigateToCharacter = (id: number) => {
        navigate(`/character/${id}`);
    }

    const openModal = () => {
        setNewCharacter({user_id: decodedToken!.sub} as CharacterModel);
    }

    const handleSave = () => {
        postCharacter(newCharacter).then(() => {
            refreshCaracters();
        });
    }

    return (
        <>
            <h1 className="mt-4 text-center">Hello {decodedToken ? decodedToken.username : ''}</h1>
            <div className="d-flex flex-row-reverse mx-5 mt-5">
                <button className="btn btn-primary text-white"
                        onClick={openModal}
                        data-bs-toggle="modal"
                        data-bs-target="#modalCreate">
                    <RiAddLine></RiAddLine> {t('pages.home.character')}
                </button>
            </div>
            <div className="d-flex flex-wrap justify-content-around mt-2">
                {
                    characters &&
                    characters.map((character) => {
                        return (
                            <div key={character.character_id} className="card card-character m-5"
                                 onClick={() => navigateToCharacter(character.character_id)}>
                                <img className="img-fluid background" src={character.picture} alt={character.name}/>
                                <div className="hover">
                                    <div className="character-circle mb-3">
                                        <img className="img-fluid" src={character.picture} alt={character.name}/>
                                    </div>
                                    <p>{character.name}</p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            {/*MODAL*/}
            <div className="modal modal-detail fade" id="modalCreate" tabIndex={-1}
                 aria-labelledby="modalCreateLabel"
                 aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5"
                                id="modalCreateLabel">{t('pages.home.create')}</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <input className="form-control" type="text" placeholder={t('entities.character.name')}
                                   onChange={($event) => {
                                       newCharacter.name = $event.target.value;
                                   }}/>
                            <textarea className="form-control" placeholder={t('entities.character.picture')}
                                      onChange={($event) => {
                                          newCharacter.picture = $event.target.value;
                                      }}></textarea>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary text-white"
                                    data-bs-dismiss="modal">{t('components.customTable.close')}</button>
                            <button type="button" className="btn btn-primary text-white" onClick={handleSave}
                                    data-bs-dismiss="modal">{t('components.customTable.save')}</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomeView