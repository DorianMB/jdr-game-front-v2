import {useNavigate, useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {getCharacterById} from "../services/characters.service.ts";
import {CharacterModelCascade} from "../models/character.model.ts";
import {parseJwt} from "../utils/jwt.ts";
import {RiQuestionMark} from "@remixicon/react";
import {STATS_TYPE_LIST} from "../utils/constants.ts";
import {ItemModelCascade} from "../models/item.model.ts";
import {getItemsByBagId} from "../services/bags.service.ts";

function CharacterView() {
    const [character, setCharacter] = useState<CharacterModelCascade | null>(null);
    const [stat, setStat] = useState<[string, any][]>([]);
    const [bagItems, setBagItems] = useState<ItemModelCascade[]>([]);
    const [userId, setUserId] = useState<number | null>(null);

    const {id} = useParams();
    const {t} = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token === null) {
            navigate('/signin');
        } else {
            const decodedToken = parseJwt(token!);
            console.log(decodedToken);
            setUserId(decodedToken.sub);
        }
    }, []);

    useEffect(() => {
        if (userId && id) {
            refreshCharacterData(+id);
        }
    }, [userId]);

    const refreshCharacterData = (id: number) => {
        getCharacterById(id).then((data) => {
            if (data.user_id.user_id !== userId) {
                navigate('/');
            }
            console.log('character', data);
            setCharacter(data);
            const statList = Object.entries(data.stat_id).filter(s => {
                return STATS_TYPE_LIST.includes(s[0].toString())
            });
            setStat(statList);
            getItemsByBagId(data.bag_id.bag_id).then((items) => {
                console.log('items', items);
                setBagItems(items);
            });
        });
    }

    return (
        <div>
            <h2 className="mt-4 text-center">{t('pages.character.title')} : {character ? character.name : ''}</h2>

            <div className="d-flex mt-5 justify-content-around">

                {/*container equipment + character picture*/}
                <div className="d-flex m-3">
                    {/*container helmet / chestplate / gloves / boot*/}
                    <div className="d-flex flex-column">
                        <div className="item-card-space">
                            {
                                character?.equipment_id!.helmet_id &&
                                <img className="img-fluid" src={character?.equipment_id!.helmet_id!.loot_id!.picture}/>
                                ||
                                <RiQuestionMark></RiQuestionMark>
                            }
                        </div>
                        <div className="item-card-space">
                            {
                                character?.equipment_id!.chestplate_id &&
                                <img className="img-fluid"
                                     src={character?.equipment_id!.chestplate_id!.loot_id!.picture}/>
                                ||
                                <RiQuestionMark></RiQuestionMark>
                            }
                        </div>
                        <div className="item-card-space">
                            {
                                character?.equipment_id!.gloves_id &&
                                <img className="img-fluid" src={character?.equipment_id!.gloves_id!.loot_id!.picture}/>
                                ||
                                <RiQuestionMark></RiQuestionMark>
                            }
                        </div>
                        <div className="item-card-space">
                            {
                                character?.equipment_id!.boots_id &&
                                <img className="img-fluid" src={character?.equipment_id!.boots_id!.loot_id!.picture}/>
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
                        <div className="item-card-space">
                            {
                                character?.equipment_id!.primary_weapon_id &&
                                <img className="img-fluid"
                                     src={character?.equipment_id!.primary_weapon_id!.loot_id!.picture}/>
                                ||
                                <RiQuestionMark></RiQuestionMark>
                            }
                        </div>
                        <div className="item-card-space">
                            {
                                character?.equipment_id!.secondary_weapon_id &&
                                <img className="img-fluid"
                                     src={character?.equipment_id!.secondary_weapon_id!.loot_id!.picture}/>
                                ||
                                <RiQuestionMark></RiQuestionMark>
                            }
                        </div>
                        <div className="item-card-space">
                            {
                                character?.equipment_id!.primary_magic_item_id &&
                                <img className="img-fluid"
                                     src={character?.equipment_id!.primary_magic_item_id!.loot_id!.picture}/>
                                ||
                                <RiQuestionMark></RiQuestionMark>
                            }
                        </div>
                        <div className="item-card-space">
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
                            <div key={index} className="item-card-space">
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
        </div>
    )
}

export default CharacterView