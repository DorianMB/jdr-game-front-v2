import ShopItem from "../Components/ShopItem.tsx";
import {useEffect, useState} from "react";
import {getShopItems} from "../services/items.service.ts";
import {ItemModelCascade} from "../models/item.model.ts";
import {getCharacterByUserId} from "../services/characters.service.ts";
import {authGuard} from "../utils/auth.guard.ts";
import {parseJwt} from "../utils/jwt.ts";
import {CharacterModelCascade} from "../models/character.model.ts";

function ShopView() {
    const [decodedToken, setDecodedToken] = useState<{ username: string, sub: number } | null>(null);
    const [characters, setCharacters] = useState([] as CharacterModelCascade[]);
    const [selectedChara, setSelectedChara] = useState({} as CharacterModelCascade);
    const [items, setItems] = useState([] as ItemModelCascade[]);
    const [show, setShow] = useState(false);

    useEffect(() => {
        authGuard();
        const token = localStorage.getItem('token');
        const decodedToken = parseJwt(token!);
        setDecodedToken(decodedToken)
    }, []);

    useEffect(() => {
        if (decodedToken) {
            getCharacterByUserId(decodedToken.sub).then((data) => {
                setCharacters(data);
            });
        }
    }, [decodedToken]);

    useEffect(() => {
        if (!selectedChara.character_id) return;
        updateShop();
    }, [selectedChara]);

    const selectCharacter = (id: any) => {
        id = Number(id);
        const character = characters.find((character) => character.character_id === id);
        setSelectedChara(character!);
    }

    const updateShop = () => {
        setShow(false);
        getShopItems(selectedChara.character_id).then((data) => {
            setItems(data);
            setTimeout(() => {
                setShow(true);
            }, 1000);
        });
    }

    return (
        <div className="d-flex flex-column justify-content-center align-items-center">
            <h1 className="mt-4 text-center">Shop</h1>
            <select className="form-select w-50 mt-4"
                    defaultValue={0}
                    onChange={(e) => {
                        selectCharacter(e.target.value)
                    }}
                    disabled={characters.length <= 0}>
                <option value={0} disabled>Choisir un personnage</option>
                {
                    characters.map((character) => {
                        return <option value={character.character_id}
                                       key={character.character_id}>{character.name}</option>
                    })
                }
            </select>
            {
                items.length > 0 && show &&
                <div className="d-flex justify-content-around flex-wrap mt-5 w-100">
                    {
                        items.map((item) => {
                            return <ShopItem item={item} character={selectedChara} key={item.item_id}
                                             updateShop={updateShop}></ShopItem>
                        })
                    }
                </div>
            }
        </div>
    );
}

export default ShopView;