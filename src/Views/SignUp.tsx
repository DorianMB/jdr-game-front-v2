import {useState} from 'react'
import axios from 'axios'
import {defaullHeader} from "../utils/header.ts";
import {SIGNUP} from "../utils/api.ts";
import {useNavigate} from "react-router-dom";
import {RiGamepadFill} from "@remixicon/react";

function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const signup = () => {
        console.log('login')
        axios.post(SIGNUP, {
            name: name,
            mail: email,
            password: password
        }, defaullHeader).then((response) => {
            console.log(response.data);
            navigate('/');
        });
    }

    return (
        <>
            <div className="row h-100">
                <div className="col-md-6 d-flex justify-content-center align-items-center">
                    <div
                        className="card position-relative card-inner h-75 w-75 d-flex justify-content-center align-items-center">
                        <div
                            className="position-absolute mx-auto card card-glass w-75">
                            <p className="text-center text-white font-jersey fs-2">
                                Plongez dans un univers épique avec notre jeu où chaque
                                mission est une chance de découvrir des trésors inédits
                                <RiGamepadFill size={40} color="white" className="ms-4"></RiGamepadFill>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 d-flex flex-column justify-content-center">
                    <div className="w-50 mx-auto">
                        <h1 className="text-center mb-2">S'inscrire</h1>
                        <p className="text-center mb-4">Inscrivez vous pour commencer a jouer !</p>
                        <input className=" form-control mb-3" type="text" placeholder="name" value={name}
                               onChange={(e) => setName(e.target.value)}></input>

                        <input className="form-control mb-3" type="text" placeholder="mail" value={email}
                               onChange={(e) => setEmail(e.target.value)}></input>

                        <input className="form-control mb-3" type="password" placeholder="password" value={password}
                               onChange={(e) => setPassword(e.target.value)}></input>
                        <button className=" btn btn-secondary w-100 text-white mb-3" onClick={signup}>S' inscrire
                        </button>
                        <p className="mt-3 small-text text-center">Si vous avez déjà un compte cliquez <a
                            href="/signin">ici</a> pour vous connecter</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SignUp