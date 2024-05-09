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

    const [maxCharaHealth, setMaxCharaHealth] = useState<number>(null);
    const [charaHealth, setCharaHealth] = useState<number>(0);
    const [charaHealthPourcent, setCharaHealthPourcent] = useState<number>(0);
    const [maxEnemyHealth, setMaxEnemyHealth] = useState<number>(null);
    const [enemyHealth, setEnemyHealth] = useState<number>(0);
    const [enemyHealthPourcent, setEnemyHealthPourcent] = useState<number>(0);

    const {t} = useTranslation();

    useEffect(() => {
        refreshCharacters();
    }, []);

    useEffect(() => {
        if (characterId === null) return;
        setCharacterHealth(characterId);
    }, [characterId]);

    useEffect(() => {
        if (maxEnemyHealth !== null) {
            setEnemyHealthPourcent(getPourcentHealth('enemy', fight.enemy.stat.health));
        }
    }, [maxEnemyHealth]);

    useEffect(() => {
        if (maxCharaHealth !== null) {
            setCharaHealthPourcent(getPourcentHealth('character', characters[findIndex(characterId)].stat_id.health));
        }
    }, [maxCharaHealth]);

    useEffect(() => {
        if (maxEnemyHealth !== null && maxCharaHealth !== null) {
            setTimeout(() => {
                simulateFightAnimation();
            }, 2000);
        }
    }, [maxEnemyHealth, maxCharaHealth]);

    const refreshCharacters = () => {
        const token = localStorage.getItem('token');
        const decodedToken = parseJwt(token!);
        getCharacterByUserId(decodedToken.sub).then((response) => {
            setCharacterId(response[0].character_id);
            setCharacters(response);
        });
    }

    const setCharacterHealth = (id) => {
        setCharaHealth(characters[findIndex(id)].stat_id.health);
        setMaxCharaHealth(characters[findIndex(id)].stat_id.health);
    }

    const handleLaunch = (id: number) => {
        simulateFight(id).then((response) => {
            setFight(response);
            setEnemyHealth(response.enemy.stat.health);
            setMaxEnemyHealth(response.enemy.stat.health);
            setCharacterHealth(characterId);
        });
    }

    const findIndex = (id) => {
        return characters.findIndex(chara => chara.character_id === id);
    }

    const getCharacterPicture = () => {
        const index = findIndex(characterId);
        if (index === -1) return '';
        return characters[index].picture;
    }

    const getPourcentHealth = (type: string, health) => {
        console.log(type, health, maxCharaHealth, maxEnemyHealth);
        if (type === 'character') {
            const value = ((health / maxCharaHealth) * 100);
            return value < 0 || value === 'Infinity' ? 0 : value + '%';
        } else {
            const value = ((health / maxEnemyHealth) * 100);
            return value < 0 || value === 'Infinity' ? 0 : value + '%';
        }
    }

    const simulateFightAnimation = () => {
        if (fight && fight.rounds && fight.rounds.length === 0) return;
        const rounds = fight.rounds;
        let index = 0;
        const interval = setInterval(() => {
            if (index === rounds.length) {
                setMaxEnemyHealth(null);
                setMaxCharaHealth(null);
                clearInterval(interval);
                return;
            }
            const round = rounds[index];
            if (round.attacker === 'character') {
                setEnemyHealth(round.enemyHealth);
                setEnemyHealthPourcent(getPourcentHealth('enemy', round.enemyHealth));
            } else {
                setCharaHealth(round.characterHealth);
                setCharaHealthPourcent(getPourcentHealth('character', round.characterHealth));
            }
            index++;
        }, 1000);
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
                <div className="d-flex justify-content-around align-items-center mt-5">
                    <div className="w-25">
                        <div className="overflow-hidden w-100">
                            <img src={getCharacterPicture()} className="img-fluid" alt="chara-picture"/>
                        </div>
                        <div className="progress" role="progressbar" aria-label="Example with label" aria-valuenow="25"
                             aria-valuemin="0" aria-valuemax="100">
                            <div className="progress-bar bg-success"
                                 style={{width: charaHealthPourcent}}>{charaHealth}
                            </div>
                        </div>
                    </div>
                    <div className="w-25">
                        <div className="overflow-hidden w-100">
                            <img src={fight?.enemy?.picture} className="img-fluid" alt="enemy-picture"/>
                        </div>
                        <div className="progress" role="progressbar" aria-label="Example with label" aria-valuenow="25"
                             aria-valuemin="0" aria-valuemax="100">
                            <div className="progress-bar bg-success"
                                 style={{width: enemyHealthPourcent}}>{enemyHealth}
                            </div>
                        </div>
                    </div>
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