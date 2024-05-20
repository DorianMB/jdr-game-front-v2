import {ItemModelCascade} from "../models/item.model.ts";
import {RiCoinFill} from "@remixicon/react";

interface ShopItemProps {
    item: ItemModelCascade;
    characterId: number;
}

function ShopItem({item, characterId}: ShopItemProps) {
    return (
        <div className="shop-item mb-4">
            {
                Object.keys(item).length > 0 &&
                <>
                    <img className="img-thumbnail" src={item.loot_id.picture} alt={item.loot_id.name}/>
                    <div className="d-flex h-100 flex-column align-items-center justify-content-center p-3">
                        <p className="w-100 text-ellipsis mb-3">{item.loot_id.name}</p>
                        <div className="d-flex w-100 justify-content-between align-items-center">
                        <span>
                            {item.price + ' '}
                            <RiCoinFill></RiCoinFill>
                        </span>
                            <button className="btn btn-primary" onClick={() => {
                                console.log(characterId)
                            }}>
                                Acheter
                            </button>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default ShopItem;