import {useEffect, useState} from 'react'
import {authGuard} from "../utils/auth.guard.ts";
import {parseJwt} from "../utils/jwt.ts";
import {CharacterModel} from "../models/character.model.ts";
import {getCharacters} from "../services/characters.service.ts";
import {useNavigate} from "react-router-dom";

function HomeView() {
    const [username, setUsername] = useState('Hello World');
    const [characters, setCharacters] = useState<CharacterModel[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        authGuard();
        const token = localStorage.getItem('token');
        const decodedToken = parseJwt(token!);
        setUsername(decodedToken.username)
        refreshCaracters();
    }, [])

    const refreshCaracters = () => {
        getCharacters().then((data) => {
            setCharacters(data)
        });
    }

    const navigateToCharacter = (id: number) => {
        navigate(`/character/${id}`);
    }

    return (
        <>
            <h1 className="mt-4 text-center">Hello {username}</h1>
            <div className="d-flex flex-wrap justify-content-between mt-5">
                {
                    characters &&
                    characters.map((character) => {
                        return (
                            <div key={character.character_id} className="card card-character m-5"
                                 onClick={() => navigateToCharacter(character.character_id)}>
                                <img className="img-fluid background" src={character.picture} alt={character.name}/>
                                <div className="hover">
                                    <div className="character-circle mb-3">
                                        <img className="img-fluid" src={character.picture} alt={character.name}/>
                                    </div>
                                    <p>{character.name}</p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

export default HomeView