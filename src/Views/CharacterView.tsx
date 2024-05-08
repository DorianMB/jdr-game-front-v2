import {useNavigate, useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {getCharacterById} from "../services/characters.service.ts";
import {CharacterModelCascade} from "../models/character.model.ts";
import {parseJwt} from "../utils/jwt.ts";
import {RiBriefcase5Line, RiEyeLine, RiMoneyDollarCircleLine, RiQuestionMark, RiShirtFill} from "@remixicon/react";
import {STATS_TYPE_LIST} from "../utils/constants.ts";
import {ItemModelCascade} from "../models/item.model.ts";
import {getItemsByBagId} from "../services/bags.service.ts";
import {equipItem, getItemById, putInBag, sellItem} from "../services/items.service.ts";

function CharacterView() {
    const [character, setCharacter] = useState<CharacterModelCascade | null>(null);
    const [stat, setStat] = useState<[string, any][]>([]);
    const [bagItems, setBagItems] = useState<ItemModelCascade[]>([]);

    const [userId, setUserId] = useState<number | null>(null);

    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, show: boolean }>({x: 0, y: 0, show: false});
    const [itemId, setItemId] = useState<number | undefined>(undefined);
    const [context, setContext] = useState<string>('');
    const [detailItem, setDetailItem] = useState<ItemModelCascade | null>(null);

    const {id} = useParams();
    const {t} = useTranslation();
    const navigate = useNavigate();

    const keysToShowInItem = ['rarity', 'price', 'level', 'strength', 'intelligence', 'speed', 'charisma', 'health', 'luck', 'charm_type', 'charm_value'];
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

    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        setContextMenu({x: event.clientX, y: event.clientY, show: true});
    };

    const refreshCharacterData = (id: number) => {
        getCharacterById(id).then((data) => {
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
        });
    }

    const refreshItemData = () => {
        if (itemId) {
            getItemById(itemId).then((data: ItemModelCascade) => {
                setDetailItem(data);
            });
        }
    }

    const handlePutInBag = () => {
        putInBag({
            item_id: itemId!,
            bag_id: character!.bag_id.bag_id!,
            equipment_id: character!.equipment_id.equipment_id!
        }).then(() => {
            refreshCharacterData(+id!)
        });
    };

    const handleEquip = () => {
        equipItem({
            item_id: itemId!,
            bag_id: character!.bag_id.bag_id!,
            equipment_id: character!.equipment_id.equipment_id!
        }).then(() => {
            refreshCharacterData(+id!)
        });
    };

    const handleSell = () => {
        sellItem({
            item_id: itemId!,
            bag_id: character!.bag_id.bag_id!,
            equipment_id: character!.equipment_id.equipment_id!,
            character_id: +id!
        }).then(() => {
            refreshCharacterData(+id!)
        });
    }

    return (
        <div>
            <h2 className="mt-4 text-center">{t('pages.character.title')} : {character ? character.name : ''}</h2>

            {contextMenu.show && (
                <div style={{position: 'absolute', top: contextMenu.y, left: contextMenu.x}}
                     className="context-menu">
                    <div className="menu-item"
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

            <div className="d-flex justify-content-around mt-4">
                <span>{t('entities.character.level')} : {character?.level}</span>
                <span>{t('entities.character.experience')} : {character?.experience}</span>
                <span>{t('entities.character.money')} : {character?.money}</span>
            </div>

            <div className="d-flex mt-4 justify-content-around">

                {/*container equipment + character picture*/}
                <div className="d-flex m-3">
                    {/*container helmet / chestplate / gloves / boot*/}
                    <div className="d-flex flex-column">
                        <div className="item-card-space" onContextMenu={($event) => {
                            handleContextMenu($event);
                            setContext('equipment');
                            setItemId(character?.equipment_id!.helmet_id.item_id)
                        }}>
                            {
                                character?.equipment_id!.helmet_id &&
                                <img className="img-fluid"
                                     src={character?.equipment_id!.helmet_id!.loot_id!.picture}/>
                                ||
                                <RiQuestionMark></RiQuestionMark>
                            }
                        </div>
                        <div className="item-card-space" onContextMenu={($event) => {
                            handleContextMenu($event);
                            setContext('equipment');
                            setItemId(character?.equipment_id!.chestplate_id.item_id)
                        }}>
                            {
                                character?.equipment_id!.chestplate_id &&
                                <img className="img-fluid"
                                     src={character?.equipment_id!.chestplate_id!.loot_id!.picture}/>
                                ||
                                <RiQuestionMark></RiQuestionMark>
                            }
                        </div>
                        <div className="item-card-space" onContextMenu={($event) => {
                            handleContextMenu($event);
                            setContext('equipment');
                            setItemId(character?.equipment_id!.gloves_id.item_id)
                        }}>
                            {
                                character?.equipment_id!.gloves_id &&
                                <img className="img-fluid"
                                     src={character?.equipment_id!.gloves_id!.loot_id!.picture}/>
                                ||
                                <RiQuestionMark></RiQuestionMark>
                            }
                        </div>
                        <div className="item-card-space" onContextMenu={($event) => {
                            handleContextMenu($event);
                            setContext('equipment');
                            setItemId(character?.equipment_id!.boots_id.item_id)
                        }}>
                            {
                                character?.equipment_id!.boots_id &&
                                <img className="img-fluid"
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
                        <div className="item-card-space" onContextMenu={($event) => {
                            handleContextMenu($event);
                            setContext('equipment');
                            setItemId(character?.equipment_id!.primary_weapon_id.item_id)
                        }}>
                            {
                                character?.equipment_id!.primary_weapon_id &&
                                <img className="img-fluid"
                                     src={character?.equipment_id!.primary_weapon_id!.loot_id!.picture}/>
                                ||
                                <RiQuestionMark></RiQuestionMark>
                            }
                        </div>
                        <div className="item-card-space" onContextMenu={($event) => {
                            handleContextMenu($event);
                            setContext('equipment');
                            setItemId(character?.equipment_id!.secondary_weapon_id.item_id)
                        }}>
                            {
                                character?.equipment_id!.secondary_weapon_id &&
                                <img className="img-fluid"
                                     src={character?.equipment_id!.secondary_weapon_id!.loot_id!.picture}/>
                                ||
                                <RiQuestionMark></RiQuestionMark>
                            }
                        </div>
                        <div className="item-card-space" onContextMenu={($event) => {
                            handleContextMenu($event);
                            setContext('equipment');
                            setItemId(character?.equipment_id!.primary_magic_item_id.item_id)
                        }}>
                            {
                                character?.equipment_id!.primary_magic_item_id &&
                                <img className="img-fluid"
                                     src={character?.equipment_id!.primary_magic_item_id!.loot_id!.picture}/>
                                ||
                                <RiQuestionMark></RiQuestionMark>
                            }
                        </div>
                        <div className="item-card-space" onContextMenu={($event) => {
                            handleContextMenu($event);
                            setContext('equipment');
                            setItemId(character?.equipment_id!.secondary_magic_item_id.item_id)
                        }}>
                            {
                                character?.equipment_id!.secondary_magic_item_id &&
                                <img className="img-fluid"
                                     src={character?.equipment_id!.secondary_magic_item_id!.loot_id!.picture}/>
                                ||
                                <RiQuestionMark></RiQuestionMark>
                            }
                        </div>
                    </div>
                </div>
                {/*container stat*/}
                <div className="d-flex m-3">
                    <table className="table table-striped table-responsive table-bordered">
                        <tbody>
                        {
                            character && stat.map((value, index) => {
                                return (
                                    <tr key={index}>
                                        <td className="cell-sized text-center">{t('entities.stat.' + value[0])}</td>
                                        <td className="cell-sized text-center">{value[1]}</td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="d-flex mt-5 flex-wrap justify-content-center">
                {
                    character?.bag_id?.length && Array.from(Array(character.bag_id.length).keys()).map((index) => {
                        return (
                            <div key={index} className="item-card-space" onContextMenu={($event) => {
                                handleContextMenu($event);
                                setContext('bag');
                                setItemId(bagItems[index].item_id)
                            }}>
                                {
                                    bagItems.length > 0 && bagItems[index] &&
                                    <img className="img-fluid"
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