import {useNavigate, useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {getCharacterById, patchCharacter} from "../services/characters.service.ts";
import {CharacterModel, CharacterModelCascade} from "../models/character.model.ts";
import {parseJwt} from "../utils/jwt.ts";
import {
    RiAddLine,
    RiBriefcase5Line,
    RiCoinFill,
    RiEyeLine,
    RiMedalFill,
    RiMoneyDollarCircleLine,
    RiQuestionMark,
    RiShirtFill,
    RiSparkling2Fill,
    RiStarFill
} from "@remixicon/react";
import {STATS_TYPE_LIST} from "../utils/constants.ts";
import {ItemModelCascade} from "../models/item.model.ts";
import {getItemsByBagId} from "../services/bags.service.ts";
import {equipItem, getItemById, putInBag, sellItem} from "../services/items.service.ts";
import {getCumulativeStatFromEquipment, tooltip} from "../utils/functions.ts";
import {patchStat} from "../services/stats.service.ts";
import Badge from "../Components/Badge.tsx";
import * as bootstrap from "bootstrap";

function CharacterView() {
    const [character, setCharacter] = useState<CharacterModelCascade | null>(null);
    const [stat, setStat] = useState<[string, any][]>([]);
    const [cumulativeStat, setCumulativeStat] = useState<object>({});
    const [bagItems, setBagItems] = useState<ItemModelCascade[]>([]);

    const [userId, setUserId] = useState<number | null>(null);

    const [tooltipList, setTooltipList] = useState<any[]>([]);

    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, show: boolean }>({x: 0, y: 0, show: false});
    const [itemId, setItemId] = useState<number | undefined>(undefined);
    const [context, setContext] = useState<string>('');
    const [detailItem, setDetailItem] = useState<ItemModelCascade | null>(null);

    const {id} = useParams();
    const {t} = useTranslation();
    const navigate = useNavigate();

    const keysToShowInItem = ['rarity', 'price', 'level', 'damage', 'armor', 'strength', 'intelligence', 'speed', 'charisma', 'health', 'luck', 'charm_type', 'charm_value'];
    const keysToShowInLoot = ['name', 'description'];

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null) {
            navigate('/signin');
        } else {
            const decodedToken = parseJwt(token!);
            console.log(decodedToken);
            setUserId(decodedToken.sub);
        }
        const clickListener = () => setContextMenu(prev => ({...prev, show: false}));
        document.addEventListener('click', clickListener);
        return () => {
            document.removeEventListener('click', clickListener);
        };
    }, []);

    useEffect(() => {
        if (userId && id) {
            refreshCharacterData(+id);
        }
    }, [userId]);

    useEffect(() => {
        refreshItemData();
    }, [itemId]);

    useEffect(() => {
        handleStat();
    }, [character]);

    const refreshCharacterData = (id: number) => {
        getCharacterById(id).then((data) => {
            closeTooltips();
            if (data.user_id.user_id !== userId) {
                navigate('/');
            }
            setCharacter(data);
            const statList = Object.entries(data.stat_id).filter(s => {
                return STATS_TYPE_LIST.includes(s[0].toString())
            });
            setStat(statList);
            getItemsByBagId(data.bag_id.bag_id).then((items) => {
                setBagItems(items);
            });
            setTimeout(() => {
                setupTooltip();
            }, 200);
        });
    }

    const refreshItemData = () => {
        if (itemId) {
            getItemById(itemId).then((data: ItemModelCascade) => {
                setDetailItem(data);
            });
        }
    }

    const setupTooltip = () => {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        setTooltipList(tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        }));
    }

    const closeTooltips = () => {
        setTimeout(() => {
            tooltipList.forEach(tooltip => {
                tooltip.hide();
            });
        }, 200);
    }

    const handlePutInBag = () => {
        closeTooltips();
        putInBag({
            item_id: itemId!,
            bag_id: character!.bag_id.bag_id!,
            equipment_id: character!.equipment_id.equipment_id!
        }).then(() => {
            refreshCharacterData(+id!)
        });
    };

    const handleEquip = () => {
        closeTooltips();
        equipItem({
            item_id: itemId!,
            bag_id: character!.bag_id.bag_id!,
            equipment_id: character!.equipment_id.equipment_id!
        }).then(() => {
            refreshCharacterData(+id!)
        });
    };

    const handleSell = () => {
        closeTooltips();
        sellItem({
            item_id: itemId!,
            bag_id: character!.bag_id.bag_id!,
            equipment_id: character!.equipment_id.equipment_id!,
            character_id: +id!
        }).then(() => {
            refreshCharacterData(+id!)
        });
    }

    const handleStat = async () => {
        if (character) {
            const newCumulativeStat = {};
            for (const stat of STATS_TYPE_LIST) {
                newCumulativeStat[stat] = await getCumulativeStatFromEquipment(character.equipment_id, stat);
            }
            setCumulativeStat(newCumulativeStat);
        }
    }

    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        closeTooltips();
        setContextMenu({x: event.clientX, y: event.clientY, show: true});
    };

    const handleUpdateStat = (stat: string) => () => {
        if (character) {
            const newStat = {...character.stat_id};
            newStat[stat] += 1;
            character.experience_points -= 1;
            const newChara = {...character} as unknown as CharacterModel;
            patchCharacter(newChara).then(() => {
                patchStat(newStat).then(() => {
                    refreshCharacterData(+id!)
                });
            });
        }
    }

    return (
        <div onClick={closeTooltips}>
            <h2 className="mt-4 text-center">{t('pages.character.title')} : {character ? character.name : ''}</h2>

            {(contextMenu.show && itemId) && (
                <div style={{position: 'absolute', top: contextMenu.y, left: contextMenu.x}}
                     className="context-menu">
                    <div className="menu-item"
                         onClick={closeTooltips}
                         data-bs-toggle="modal"
                         data-bs-target="#modalDetails-item">
                        <RiEyeLine className="me-3"></RiEyeLine> {t('pages.character.context-menu.detail')}
                    </div>
                    <div onClick={handleSell} className="menu-item">
                        <RiMoneyDollarCircleLine
                            className="me-3"></RiMoneyDollarCircleLine> {t('pages.character.context-menu.sell')}
                    </div>
                    {
                        context === 'equipment' &&
                        <div onClick={handlePutInBag} className="menu-item">
                            <RiBriefcase5Line
                                className="me-3"></RiBriefcase5Line> {t('pages.character.context-menu.bag')}
                        </div>
                    }
                    {
                        context === 'bag' &&
                        <div onClick={handleEquip} className="menu-item">
                            <RiShirtFill className="me-3"></RiShirtFill> {t('pages.character.context-menu.equip')}
                        </div>
                    }
                </div>
            )}

            <div className="d-flex justify-content-around flex-wrap mt-4">
                <Badge upperContent={character?.level} lowerContent={t('entities.character.level')} color="primary">
                    <RiMedalFill></RiMedalFill>
                </Badge>
                <Badge upperContent={character?.experience} lowerContent={t('entities.character.experience')}
                       color="accent-1">
                    <RiSparkling2Fill></RiSparkling2Fill>
                </Badge>
                <Badge upperContent={character?.experience_points}
                       lowerContent={t('entities.character.experience_points')} color="accent-2">
                    <RiStarFill></RiStarFill>
                </Badge>
                <Badge upperContent={character?.money} lowerContent={t('entities.character.money')} color="secondary">
                    <RiCoinFill></RiCoinFill>
                </Badge>
            </div>

            <div className="d-flex flex-column flex-lg-row mt-4 justify-content-around">

                {/*container equipment + character picture*/}
                <div className="d-flex justify-content-center m-3">
                    {/*container helmet / chestplate / gloves / boot*/}
                    <div className="d-flex flex-column">
                        <div
                            className={'item-card-space ' + `bc-${character?.equipment_id!.helmet_id?.rarity.toLowerCase()}`}
                            onContextMenu={($event) => {
                                setItemId(character?.equipment_id!.helmet_id.item_id)
                                setContext('equipment');
                                handleContextMenu($event);
                            }}>
                            {
                                character?.equipment_id!.helmet_id &&
                                <img className="img-fluid"
                                     alt="equipment-picture"
                                     data-bs-toggle="tooltip"
                                     data-bs-html="true"
                                     data-bs-title={tooltip(character.equipment_id.helmet_id)}
                                     src={character?.equipment_id!.helmet_id!.loot_id!.picture}/>
                                ||
                                <RiQuestionMark></RiQuestionMark>
                            }
                        </div>
                        <div
                            className={'item-card-space ' + `bc-${character?.equipment_id!.chestplate_id?.rarity.toLowerCase()}`}
                            onContextMenu={($event) => {
                                setItemId(character?.equipment_id!.chestplate_id.item_id)
                                setContext('equipment');
                                handleContextMenu($event);
                            }}>
                            {
                                character?.equipment_id!.chestplate_id &&
                                <img className="img-fluid"
                                     alt="equipment-picture"
                                     data-bs-toggle="tooltip"
                                     data-bs-html="true"
                                     data-bs-title={tooltip(character.equipment_id.chestplate_id)}
                                     src={character?.equipment_id!.chestplate_id!.loot_id!.picture}/>
                                ||
                                <RiQuestionMark></RiQuestionMark>
                            }
                        </div>
                        <div
                            className={'item-card-space ' + `bc-${character?.equipment_id!.gloves_id?.rarity.toLowerCase()}`}
                            onContextMenu={($event) => {
                                setItemId(character?.equipment_id!.gloves_id.item_id)
                                setContext('equipment');
                                handleContextMenu($event);
                            }}>
                            {
                                character?.equipment_id!.gloves_id &&
                                <img className="img-fluid"
                                     alt="equipment-picture"
                                     data-bs-toggle="tooltip"
                                     data-bs-html="true"
                                     data-bs-title={tooltip(character.equipment_id.gloves_id)}
                                     src={character?.equipment_id!.gloves_id!.loot_id!.picture}/>
                                ||
                                <RiQuestionMark></RiQuestionMark>
                            }
                        </div>
                        <div
                            className={'item-card-space ' + `bc-${character?.equipment_id!.boots_id?.rarity.toLowerCase()}`}
                            onContextMenu={($event) => {
                                setItemId(character?.equipment_id!.boots_id.item_id)
                                setContext('equipment');
                                handleContextMenu($event);
                            }}>
                            {
                                character?.equipment_id!.boots_id &&
                                <img className="img-fluid"
                                     alt="equipment-picture"
                                     data-bs-toggle="tooltip"
                                     data-bs-html="true"
                                     data-bs-title={tooltip(character.equipment_id.boots_id)}
                                     src={character?.equipment_id!.boots_id!.loot_id!.picture}/>
                                ||
                                <RiQuestionMark></RiQuestionMark>
                            }
                        </div>
                    </div>
                    {/*container character picture*/}
                    <div className="d-flex character-picture justify-content-center align-items-center">
                        <img src={character?.picture} alt="character picture" className="img-fluid"/>
                    </div>
                    {/*container weapons / magic items*/}
                    <div className="d-flex flex-column">
                        <div
                            className={'item-card-space ' + `bc-${character?.equipment_id!.primary_weapon_id?.rarity.toLowerCase()}`}
                            onContextMenu={($event) => {
                                setItemId(character?.equipment_id!.primary_weapon_id.item_id)
                                setContext('equipment');
                                handleContextMenu($event);
                            }}>
                            {
                                character?.equipment_id!.primary_weapon_id &&
                                <img className="img-fluid"
                                     alt="equipment-picture"
                                     data-bs-toggle="tooltip"
                                     data-bs-html="true"
                                     data-bs-title={tooltip(character.equipment_id.primary_weapon_id)}
                                     src={character?.equipment_id!.primary_weapon_id!.loot_id!.picture}/>
                                ||
                                <RiQuestionMark></RiQuestionMark>
                            }
                        </div>
                        <div
                            className={'item-card-space ' + `bc-${character?.equipment_id!.secondary_weapon_id?.rarity.toLowerCase()}`}
                            onContextMenu={($event) => {
                                setItemId(character?.equipment_id!.secondary_weapon_id.item_id)
                                setContext('equipment');
                                handleContextMenu($event);
                            }}>
                            {
                                character?.equipment_id!.secondary_weapon_id &&
                                <img className="img-fluid"
                                     alt="equipment-picture"
                                     data-bs-toggle="tooltip"
                                     data-bs-html="true"
                                     data-bs-title={tooltip(character.equipment_id.secondary_weapon_id)}
                                     src={character?.equipment_id!.secondary_weapon_id!.loot_id!.picture}/>
                                ||
                                <RiQuestionMark></RiQuestionMark>
                            }
                        </div>
                        <div
                            className={'item-card-space ' + `bc-${character?.equipment_id!.primary_magic_item_id?.rarity.toLowerCase()}`}
                            onContextMenu={($event) => {
                                setItemId(character?.equipment_id!.primary_magic_item_id.item_id)
                                setContext('equipment');
                                handleContextMenu($event);
                            }}>
                            {
                                character?.equipment_id!.primary_magic_item_id &&
                                <img className="img-fluid"
                                     alt="equipment-picture"
                                     data-bs-toggle="tooltip"
                                     data-bs-html="true"
                                     data-bs-title={tooltip(character.equipment_id.primary_magic_item_id)}
                                     src={character?.equipment_id!.primary_magic_item_id!.loot_id!.picture}/>
                                ||
                                <RiQuestionMark></RiQuestionMark>
                            }
                        </div>
                        <div
                            className={'item-card-space ' + `bc-${character?.equipment_id!.secondary_magic_item_id?.rarity.toLowerCase()}`}
                            onContextMenu={($event) => {
                                setItemId(character?.equipment_id!.secondary_magic_item_id.item_id)
                                setContext('equipment');
                                handleContextMenu($event);
                            }}>
                            {
                                character?.equipment_id!.secondary_magic_item_id &&
                                <img className="img-fluid"
                                     alt="equipment-picture"
                                     data-bs-toggle="tooltip"
                                     data-bs-html="true"
                                     data-bs-title={tooltip(character.equipment_id.secondary_magic_item_id)}
                                     src={character?.equipment_id!.secondary_magic_item_id!.loot_id!.picture}/>
                                ||
                                <RiQuestionMark></RiQuestionMark>
                            }
                        </div>
                    </div>
                </div>

                {/*container stat*/}
                <div className="d-flex my-3 mx-5">
                    <table className="table table-striped table-responsive table-bordered">
                        <tbody>
                        {
                            character && stat.map((value, index) => {
                                return (
                                    <tr key={index}>
                                        <td className="cell-sized text-center">{t('entities.stat.' + value[0])}</td>
                                        <td className="cell-sized text-center">
                                            <span>{value[1]} ({cumulativeStat[value[0]]})</span>
                                            {
                                                character.experience_points > 0 &&
                                                <button type="button"
                                                        onClick={handleUpdateStat(value[0])}
                                                        className="btn btn-primary btn-add">
                                                    <RiAddLine></RiAddLine>
                                                </button>
                                            }
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="d-flex mt-5 pb-5 flex-wrap justify-content-center">
                {
                    character?.bag_id?.size && Array.from(Array(character.bag_id.size).keys()).map((index) => {
                        return (
                            <div key={index} className={'item-card-space ' + `bc-${bagItems[index]?.rarity.toLowerCase()}`}
                                 onContextMenu={($event) => {
                                     setItemId(bagItems[index].item_id)
                                     setContext('bag');
                                     handleContextMenu($event);
                                 }}>
                                {
                                    bagItems.length > 0 && bagItems[index] &&
                                    <img className="img-fluid"
                                         alt="equipment-picture"
                                         data-bs-toggle="tooltip"
                                         data-bs-html="true"
                                         data-bs-title={tooltip(bagItems[index])}
                                         src={bagItems[index].loot_id!.picture}/>
                                    ||
                                    <RiQuestionMark></RiQuestionMark>
                                }
                            </div>
                        )
                    })
                }
            </div>

            {/*MODAL*/}
            <div className="modal modal-detail fade" id="modalDetails-item" tabIndex={-1}
                 aria-labelledby="modalDetailsLabel-item"
                 aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5"
                                id="modalDetailsLabel-item">{t('components.customTable.detail')}</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {
                                detailItem && detailItem.loot_id.picture &&
                                <div className="d-flex justify-content-center">
                                    <img src={detailItem.loot_id.picture || ''} className="img-fluid"
                                         alt="item picture"/>
                                </div>
                            }
                            {
                                detailItem && keysToShowInLoot.map((key: string, index: number) => {
                                    return (
                                        <div key={index} className="d-flex my-2">
                                            <p>
                                                <span className="fw-bold text-decoration-underline me-2">
                                                    {t('entities.lootTable.' + key)} :
                                                </span>
                                                {detailItem.loot_id[key]}
                                            </p>
                                        </div>
                                    )
                                })
                            }
                            {
                                detailItem && keysToShowInItem.map((key: string, index: number) => {
                                    return (
                                        <div key={index} className="d-flex my-2">
                                            <p>
                                                <span className="fw-bold text-decoration-underline me-2">
                                                    {t('entities.item.' + key)} :
                                                </span>
                                                {detailItem[key]}
                                            </p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary text-white"
                                    data-bs-dismiss="modal">{t('components.modal.close')}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CharacterView