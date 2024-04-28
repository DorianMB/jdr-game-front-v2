import {useState} from 'react'
import axios from 'axios'
import {defaullHeader} from "../utils/header.ts";
import {SIGNUP} from "../utils/api.ts";
import {useNavigate} from "react-router-dom";

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
            <div className={'d-flex flex-column justify-content-center align-items-center w-50 mx-auto mt-5'}>
                <input className={'form-control'} type="text" placeholder="name" value={name}
                       onChange={(e) => setName(e.target.value)}></input>
                <input className={'form-control'} type="text" placeholder="mail" value={email}
                       onChange={(e) => setEmail(e.target.value)}></input>
                <input className={'form-control'} type="password" placeholder="password" value={password}
                       onChange={(e) => setPassword(e.target.value)}></input>
                <button className={'btn btn-primary'} onClick={signup}>S'inscrire</button>
            </div>
        </>
    )
}

export default SignUp