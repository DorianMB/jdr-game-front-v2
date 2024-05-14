import {useState} from 'react'
import axios from 'axios'
import {defaullHeader} from "../utils/header.ts";
import {SIGNIN} from "../utils/api.ts";
import {useNavigate} from "react-router-dom";
import {RiGamepadFill} from "@remixicon/react";

function SignInView() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [card, setCard] = useState<HTMLElement | null>(null);
    const navigate = useNavigate();

    const login = () => {
        axios.post(SIGNIN, {
            mail: email,
            password: password
        }, defaullHeader).then((response) => {
            localStorage.setItem('token', response.data);
            const evt = new CustomEvent("TokenUpdateEvent", {detail: "Token updated"});
            window.dispatchEvent(evt);
            navigate('/');
        });
    }

    const parallax = (e: MouseEvent) => {
        if (card) {
            // calculate the center of the window
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            // calculate the distance between the center of the window and the mouse cursor
            const distanceX = e.clientX - centerX;
            const distanceY = e.clientY - centerY;
            card.style.backgroundPositionX = 50 + (distanceX / 50) + '%';
            card.style.backgroundPositionY = 50 + (distanceY / 50) + '%';
        } else {
            setCard(document.getElementById('card-parallax'))
        }
    }
    window.onmousemove = parallax;

    return (
        <>
            <div className="row h-100">
                <div className="col-lg-6 d-flex p-5 flex-column justify-content-center">
                    <div className="w-50 mx-auto">
                        <h1 className="text-center mb-2">Connexion</h1>
                        <p className="text-center mb-4">Connectez vous avec votre compte</p>
                        <input className="form-control mb-3" type="text" placeholder="mail" value={email}
                               onChange={(e) => setEmail(e.target.value)}></input>
                        <input className="form-control mb-3" type="password" placeholder="password" value={password}
                               onChange={(e) => setPassword(e.target.value)}></input>
                        <button className="btn btn-primary w-100 text-white mb-3" onClick={login}>Login</button>
                        <p className="mt-3 small-text text-center">Si vous n'avez pas de compte cliquez <a
                            href="/signup">ici</a> pour en créer
                            un</p>
                    </div>
                </div>
                <div className="col-lg-6 d-flex h-100 justify-content-center align-items-center">
                    <div
                        id="card-parallax"
                        className="card position-relative card-inner h-75 w-75 d-flex justify-content-center align-items-center">
                        <div
                            className="position-absolute mx-auto card card-glass w-75 p-3">
                            <p className="text-center text-white font-jersey fs-8">
                                Plongez dans un univers épique avec notre jeu où chaque
                                mission est une chance de découvrir des trésors inédits
                                <RiGamepadFill size={40} color="white" className="ms-4"></RiGamepadFill>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SignInView