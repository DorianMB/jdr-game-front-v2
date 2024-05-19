import {RiSwordLine} from "@remixicon/react";
import {useTranslation} from "react-i18next";
import {getCharacterByUserId, simulateFight} from "../services/characters.service.ts";
import {useEffect, useState} from "react";
import {FightModel} from "../models/fight.model.ts";
import {parseJwt} from "../utils/jwt.ts";
import {getCumulativeStatFromEquipment, tooltip} from "../utils/functions.ts";
import {isBagFull} from "../services/bags.service.ts";
import {CharacterModelCascade} from "../models/character.model.ts";
import {ItemModelCascade} from "../models/item.model.ts";
import * as bootstrap from "bootstrap";

function FightView() {
    const [fight, setFight] = useState<FightModel>({} as FightModel);
    const [characters, setCharacters] = useState<CharacterModelCascade[]>([] as CharacterModelCascade[]);
    const [characterId, setCharacterId] = useState<any>(null);
    const [isCharaBagFull, setIsCharaBagFull] = useState<boolean>(false);

    const [isVictory, setIsVictory] = useState<boolean>(false);
    const [showFightResult, setShowFightResult] = useState<boolean>(false);
    const [treasure, setTreasure] = useState<ItemModelCascade>({} as ItemModelCascade);
    const [tooltipList, setTooltipList] = useState<any[]>([]);

    const [maxCharaHealth, setMaxCharaHealth] = useState<any>(null);
    const [charaHealth, setCharaHealth] = useState<number>(0);
    const [charaHealthPourcent, setCharaHealthPourcent] = useState<string>('0%');
    const [maxEnemyHealth, setMaxEnemyHealth] = useState<any>(null);
    const [enemyHealth, setEnemyHealth] = useState<number>(0);
    const [enemyHealthPourcent, setEnemyHealthPourcent] = useState<string>('0%');

    const [enemyAttack, setEnemyAttack] = useState<{ show: boolean, damage: number, fightPicture: string }>({
        damage: 0,
        show: false,
        fightPicture: ''
    });
    const [charaAttack, setCharaAttack] = useState<{ show: boolean, damage: number, fightPicture: string }>({
        damage: 0,
        show: false,
        fightPicture: ''
    });

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
            setEnemyAttack({show: false, damage: 0, fightPicture: ''});
            setCharaAttack({show: false, damage: 0, fightPicture: ''});
            setTimeout(() => {
                simulateFightAnimation();
            }, 2000);
        }
    }, [maxEnemyHealth, maxCharaHealth]);

    const setupTooltip = () => {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        setTooltipList(tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        }));
    }

    const closeTooltips = () => {
        tooltipList.forEach(tooltip => {
            tooltip.hide();
        });
    }

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
            setTreasure({} as ItemModelCascade);
            setIsVictory(false);
            setShowFightResult(false);
        });
    }

    const handleBagFull = (id: number) => {
        isBagFull(id).then((response) => {
            setIsCharaBagFull(response);
        });
    }

    const handleWeaponFightAnimation = () => {
        switch (fight.characterWeapon.type) {
            case 'sword':
                return 'animation-weapon-sword-left'
            case 'bow':
                return 'animation-weapon-magic-left'
            case 'magic_wand':
                return 'animation-weapon-magic-left'
            default:
                return 'animation-weapon-sword-left'
        }
    }

    const findIndex = (id) => {
        return characters.findIndex(chara => chara.character_id === id);
    }

    const getCharacterPresentation = () => {
        const index = findIndex(characterId);
        if (index === -1) return '';
        return characters[index].name + ' : niv' + characters[index].level;
    }

    const getCharacterPicture = () => {
        const index = findIndex(characterId);
        if (index === -1) return '';
        return characters[index].picture;
    }

    const getPourcentHealth = (type: string, health) => {
        if (type === 'character') {
            if (maxCharaHealth === 0) {
                return '0%';
            }
            const value = ((health / maxCharaHealth) * 100);
            return value < 0 ? 0 + '%' : value + '%';
        } else {
            if (maxEnemyHealth === 0) {
                return '0%';
            }
            const value = ((health / maxEnemyHealth) * 100);
            return value < 0 ? 0 + '%' : value + '%';
        }
    }

    const simulateFightAnimation = () => {
        if (fight && fight.rounds && fight.rounds.length === 0) return;
        const rounds = fight.rounds;
        let index = 0;
        const interval = setInterval(() => {
            if (index === rounds.length) {
                setTimeout(() => {
                    setMaxEnemyHealth(null);
                    setMaxCharaHealth(null);

                    setupTooltip();

                    setIsVictory(fight.isVictory);
                    setTreasure(fight.treasure);

                    setShowFightResult(true);

                    clearInterval(interval);
                    setFight({} as FightModel);
                }, 1000);
                return;
            }
            const round = rounds[index];
            if (round.attacker === 'character') {
                setEnemyHealth(round.enemyHealth);
                setEnemyHealthPourcent(getPourcentHealth('enemy', round.enemyHealth));
                setEnemyAttack({show: false, damage: 0, fightPicture: ''});
                setCharaAttack({
                    show: true,
                    damage: round.characterDamage,
                    fightPicture: fight.characterWeapon.picture
                });
            } else {
                setCharaHealth(round.characterHealth);
                setCharaHealthPourcent(getPourcentHealth('character', round.characterHealth));
                setCharaAttack({show: false, damage: 0, fightPicture: ''});
                setEnemyAttack({show: true, damage: round.enemyDamage, fightPicture: fight.enemy.fight_picture});
            }
            index++;
        }, 1000);
    }

    return (
        <>
            <h1 className="mt-4 text-center">{t('pages.fight.title')}</h1>
            {
                (Object.keys(fight).length === 0) &&
                <div className="d-flex justify-content-center align-items-center mt-4" onClick={closeTooltips}>
                    <button className="btn btn-primary text-white"
                            disabled={characters.length === 0}
                            onClick={refreshCharacters}
                            data-bs-toggle="modal"
                            data-bs-target="#modalChooseCharacter">
                        <RiSwordLine></RiSwordLine> {t('pages.fight.launch')} <RiSwordLine></RiSwordLine>
                    </button>
                </div>
            }

            {/*FIGHT*/}
            {
                Object.keys(fight).length > 0 &&
                <div className="d-flex justify-content-around align-items-center mt-5">
                    <div className="w-25 d-flex flex-column align-items-center position-relative">
                        <h5>{getCharacterPresentation()}</h5>
                        <div className="overflow-hidden w-100">
                            <img src={getCharacterPicture()} className="img-fluid" alt="chara-picture"/>
                        </div>
                        <div className="progress w-100" role="progressbar" aria-label="health character"
                             aria-valuemin={0} aria-valuemax={100}>
                            <div className="progress-bar bg-success"
                                 style={{width: charaHealthPourcent}}>{charaHealth}
                            </div>
                        </div>
                        {
                            enemyAttack.show &&
                            <div
                                className="badge bg-danger position-absolute fs-6 top-50 animate__animated animate__slower animate__fadeInUp animate__fadeOutUp">
                                - {enemyAttack.damage}
                            </div>
                        }
                        {
                            charaAttack.show &&
                            <div
                                className={`w-25 h-25 position-absolute top-50 ${charaAttack.show ? handleWeaponFightAnimation() : ''}`}>
                                <img
                                    className="img-fluid"
                                    src={charaAttack.fightPicture}
                                    alt="sword"/>
                            </div>
                        }
                    </div>
                    <div className="w-25 d-flex flex-column align-items-center position-relative">
                        <h5>{fight?.enemy?.name} : niv {fight?.enemy.level}</h5>
                        <div className="overflow-hidden w-100">
                            <img src={fight?.enemy?.picture} className="img-fluid" alt="enemy-picture"/>
                        </div>
                        <div className="progress w-100" role="progressbar" aria-label="health enemy"
                             aria-valuemin={0} aria-valuemax={100}>
                            <div className="progress-bar bg-success"
                                 style={{width: enemyHealthPourcent}}>{enemyHealth}
                            </div>
                        </div>
                        {
                            charaAttack.show &&
                            <div
                                className="badge bg-danger position-absolute fs-6 top-50 animate__animated animate__slower animate__fadeInUp animate__fadeOutUp">
                                - {charaAttack.damage}
                            </div>
                        }
                        {
                            enemyAttack.show &&
                            <div
                                className={`w-25 h-25 position-absolute top-50 ${enemyAttack.show ? 'animation-weapon-sword-right' : ''}`}>
                                <img
                                    className="img-fluid"
                                    src={enemyAttack.fightPicture}
                                    alt="sword"/>
                            </div>
                        }
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
                                 data-bs-toggle="tooltip"
                                 data-bs-html="true"
                                 data-bs-title={tooltip(treasure)}
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
                                            handleBagFull(parseInt($event.target.value));
                                        }}>
                                    <option value=''>{t('pages.fight.modal-select')}</option>
                                    {
                                        characters.map((character) => {
                                            return <option value={character.character_id}
                                                           key={character.character_id}>{character.name}</option>
                                        })
                                    }
                                </select>
                            }
                            {
                                isCharaBagFull &&
                                <div className="alert alert-danger mt-3" role="alert">
                                    {t('components.alert.bag-full')}
                                </div>
                            }
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary text-white"
                                    data-bs-dismiss="modal">{t('components.modal.close')}</button>
                            <button type="button" className="btn btn-primary text-white"
                                    disabled={!characterId || isCharaBagFull}
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