import {useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";

function CharacterView() {
    const {id} = useParams();
    const {t} = useTranslation();

    return (
        <div>
            <h2>{id}</h2>
            <p>{t('pages.character')}</p>
        </div>
    )
}

export default CharacterView