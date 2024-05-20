import ShopItem from "../Components/ShopItem.tsx";
import {useEffect, useState} from "react";
import {getShopItems} from "../services/items.service.ts";
import {ItemModelCascade} from "../models/item.model.ts";

function ShopView() {
    const [items, setItems] = useState([] as ItemModelCascade[]);

    useEffect(() => {
        getShopItems(2).then((data) => {
            setItems(data);
        });
    }, []);

    return (
        <div>
            <h1>Shop</h1>
            <div className="d-flex justify-content-around flex-wrap">
                {
                    items.map((item) => {
                        return <ShopItem item={item} characterId={2}></ShopItem>
                    })
                }
            </div>
        </div>
    );
}

export default ShopView;