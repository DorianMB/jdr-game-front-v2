import {RiSwordLine} from "@remixicon/react";
import {useTranslation} from "react-i18next";
import {getCharacterByUserId, simulateFight} from "../services/characters.service.ts";
import {useEffect, useState} from "react";
import {FightModel} from "../models/fight.model.ts";
import {parseJwt} from "../utils/jwt.ts";

function FightView() {
    const [fight, setFight] = useState<FightModel>({} as FightModel);
    const [characters, setCharacters] = useState<CharacterModel[]>([] as CharacterModel[]);
    const [characterId, setCharacterId] = useState<number>(null);

    const {t} = useTranslation();

    useEffect(() => {
        refreshCharacters();
    }, []);

    const refreshCharacters = () => {
        const token = localStorage.getItem('token');
        const decodedToken = parseJwt(token!);
        getCharacterByUserId(decodedToken.sub).then((response) => {
            setCharacterId(response[0].character_id);
            setCharacters(response);
        });
    }

    const handleLaunch = (id: number) => {
        simulateFight(id).then((response) => {
            setFight(response);
        });
    }

    return (
        <>
            <h1 className="mt-4 text-center">{t('pages.fight.title')}</h1>
            <div className="d-flex justify-content-center align-items-center mt-4">
                <button className="btn btn-primary text-white"
                        disabled={characters.length === 0}
                        data-bs-toggle="modal"
                        data-bs-target="#modalChooseCharacter">
                    <RiSwordLine></RiSwordLine> {t('pages.fight.launch')} <RiSwordLine></RiSwordLine>
                </button>
            </div>

            {/*FIGHT*/}
            {
                Object.keys(fight).length > 0 &&
                <div className="d-flex justify-content-center align-items-center mt-4">
                    {
                        fight.isVictory ?
                            <div className="alert alert-success" role="alert">
                                {t('pages.fight.victory')}
                            </div>
                            :
                            <div className="alert alert-danger" role="alert">
                                {t('pages.fight.defeat')}
                            </div>
                    }
                </div>
            }

            {/*MODAL*/}
            <div className="modal modal-detail fade" id="modalChooseCharacter" tabIndex={-1}
                 aria-labelledby="modalChooseCharacterLabel"
                 aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5"
                                id="modalChooseCharacterLabel">{t('pages.fight.modal-title')}</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {
                                characters.length > 0 &&
                                <select className="form-select"
                                        value={characterId === null ? characters[0].character_id : characterId}
                                        onChange={($event) => {
                                            setCharacterId(parseInt($event.target.value));
                                        }}>
                                    {
                                        characters.map((character) => {
                                            return <option value={character.character_id}
                                                           key={character.character_id}>{character.name}</option>
                                        })
                                    }
                                </select>
                            }
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary text-white"
                                    data-bs-dismiss="modal">{t('components.modal.close')}</button>
                            <button type="button" className="btn btn-primary text-white"
                                    disabled={characterId === null}
                                    onClick={() => handleLaunch(characterId)}
                                    data-bs-dismiss="modal">{t('components.modal.launch')}</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default FightView;