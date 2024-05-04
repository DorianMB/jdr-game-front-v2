import {useNavigate, useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {getCharacterById} from "../services/characters.service.ts";
import {CharacterModel} from "../models/character.model.ts";
import {parseJwt} from "../utils/jwt.ts";

function CharacterView() {
    const [character, setCharacter] = useState<CharacterModel | null>(null);
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
            refreshCaracter(+id);
        }
    }, [userId]);

    const refreshCaracter = (id: number) => {
        getCharacterById(id).then((data) => {
            if (data.user_id.user_id !== userId) {
                navigate('/');
            }
            console.log('character', data);
            setCharacter(data);
        });
    }

    return (
        <div>
            <h2 className="mt-4 text-center">{t('pages.character.title')} : {character ? character.name : ''}</h2>

            <div className="d-flex justify-content-between">

                {/*container equipment + character picture*/}
                <div className="d-flex m-3">
                    {/*container helmet / chestplate / gloves / boot*/}
                    <div className="d-flex flex-column">
                        <div className="item-card-space">
                            <img src={character?.equipment_id!.helmet_id!.loot_id!.picture}/>
                        </div>
                        <div className="item-card-space"></div>
                        <div className="item-card-space"></div>
                        <div className="item-card-space"></div>
                    </div>
                    {/*container character picture*/}
                    <div className="d-flex character-picture justify-content-center align-items-center">
                        <img src={character?.picture} alt="character picture" className="img-fluid"/>
                    </div>
                    {/*container weapons / magic items*/}
                    <div className="d-flex flex-column">
                        <div className="item-card-space"></div>
                        <div className="item-card-space"></div>
                        <div className="item-card-space"></div>
                        <div className="item-card-space"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CharacterView