import {RiSwordLine} from "@remixicon/react";
import {useTranslation} from "react-i18next";
import {getCharacterByUserId, simulateFight} from "../services/characters.service.ts";
import {useEffect, useState} from "react";
import {FightModel} from "../models/fight.model.ts";
import {parseJwt} from "../utils/jwt.ts";
import {getCumulativeStatFromEquipment} from "../utils/functions.ts";

function FightView() {
    const [fight, setFight] = useState<FightModel>({} as FightModel);
    const [characters, setCharacters] = useState<CharacterModel[]>([] as CharacterModel[]);
    const [characterId, setCharacterId] = useState<number>(null);

    const [isVictory, setIsVictory] = useState<boolean>(false);
    const [showFightResult, setShowFightResult] = useState<boolean>(false);
    const [treasure, setTreasure] = useState<ItemModel>({} as ItemModel);

    const [maxCharaHealth, setMaxCharaHealth] = useState<number>(null);
    const [charaHealth, setCharaHealth] = useState<number>(0);
    const [charaHealthPourcent, setCharaHealthPourcent] = useState<string>('0%');
    const [maxEnemyHealth, setMaxEnemyHealth] = useState<number>(null);
    const [enemyHealth, setEnemyHealth] = useState<number>(0);
    const [enemyHealthPourcent, setEnemyHealthPourcent] = useState<string>('0%');

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
            setCharacterId('');
            setCharacters(response);
        });
    }

    const setCharacterHealth = (id) => {
        const chara = characters[findIndex(id)];
        if (!chara) return;
        getCumulativeStatFromEquipment(chara.equipment_id, 'health').then((response) => {
            const cumulative = response;
            setCharaHealth(chara.stat_id.health + cumulative);
            setMaxCharaHealth(chara.stat_id.health + cumulative);
            setCharaHealthPourcent('100%');
        });
    }

    const handleLaunch = (id: number) => {
        simulateFight(id).then((response) => {
            setFight(response);
            setEnemyHealth(response.enemy.stat.health);
            setMaxEnemyHealth(response.enemy.stat.health);
            setCharacterHealth(characterId);
            setTreasure(null);
            setIsVictory(false);
            setShowFightResult(false);
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

                setIsVictory(fight.isVictory);
                setTreasure(fight.treasure);
                setShowFightResult(true);

                clearInterval(interval);
                setFight({} as FightModel);
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
                        onClick={refreshCharacters}
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

            {/*FIGHT RESULT*/}
            {
                showFightResult &&
                <div className="d-flex flex-column justify-content-center align-items-center mt-5">
                    {
                        isVictory ?
                            <div className="alert alert-success" role="alert">
                                {t('pages.fight.victory')}
                            </div>
                            :
                            <div className="alert alert-danger" role="alert">
                                {t('pages.fight.defeat')}
                            </div>
                    }
                    {
                        treasure && Object.keys(treasure).length > 0 &&
                        <div className="mt-3 d-flex flex-column justify-content-center align-items-center"
                             style={{width: '18rem'}}>
                            <img src={treasure.loot_id.picture}
                                 className={'img-fluid border border-2 ' + `bc-${treasure.rarity.toLowerCase()}`}
                                 alt="treasure-picture"/>
                            <div className="d-flex flex-column">
                                <h5 className="text-center">{treasure.loot_id.name}</h5>
                                <p className="text-center">{treasure.loot_id.description}</p>
                            </div>
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
                                    <option value=''>-</option>
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