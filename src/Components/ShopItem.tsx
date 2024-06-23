import {ItemModelCascade} from "../models/item.model.ts";
import {RiCoinFill} from "@remixicon/react";
import {tooltip} from "../utils/functions.ts";
import * as bootstrap from "bootstrap";
import {useEffect, useState} from "react";
import {CharacterModelCascade} from "../models/character.model.ts";
import {patchItem} from "../services/items.service.ts";
import {patchCharacter} from "../services/characters.service.ts";
import {useTranslation} from "react-i18next";

interface ShopItemProps {
    item: ItemModelCascade;
    character: CharacterModelCascade;
    updateShop: () => void;
}

function ShopItem({item, character, updateShop}: ShopItemProps) {
    const [tooltipList, setTooltipList] = useState<any[]>([]);

    const {t} = useTranslation();

    useEffect(() => {
        closeTooltips();
        setupTooltip();
    }, [item]);

    const setupTooltip = () => {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        setTooltipList(tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        }));
    }

    const closeTooltips = () => {
        if (tooltipList.length === 0) return;
        tooltipList.forEach(tooltip => {
            tooltip.hide();
        });
    }

    const buyItem = (item: ItemModelCascade) => {
        item.bag_id = character.bag_id.bag_id;
        item.owned = true;
        item.in_shop = null;

        character.money -= item.price;

        Promise.all([
            patchItem(item),
            patchCharacter(character)
        ]).then(() => {
            updateShop();
        });
    }

    return (
        <div className="shop-item mb-4">
            {
                Object.keys(item).length > 0 &&
                <>
                    <img className="img-thumbnail" src={item.loot_id?.picture} alt={item.loot_id?.name}
                         data-bs-toggle="tooltip"
                         data-bs-html="true"
                         data-bs-title={tooltip(item)}/>
                    <div className="d-flex h-100 flex-column align-items-center justify-content-center p-3">
                        <p className="w-100 text-ellipsis mb-3">{item.loot_id?.name}</p>
                        <div className="d-flex w-100 justify-content-between align-items-center">
                        <span>
                            {item.price + ' '}
                            <RiCoinFill></RiCoinFill>
                        </span>
                            <button className="btn btn-primary" disabled={character.money < item.price} onClick={() => {
                                buyItem(item)
                            }}>
                                {t('pages.shop.buy')}
                            </button>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default ShopItem;