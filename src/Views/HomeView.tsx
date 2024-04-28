import {useEffect, useState} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom';
import {defaullHeader} from "../utils/header.ts";
import {BACK_PING} from "../utils/api.ts";

function HomeView() {
    const [hello, setHello] = useState('Hello World');
    const navigate = useNavigate();

    // when page is show and only one time get data from back localhost:3000 with axios
    useEffect(() => {
        console.log('useEffect');
        const token = localStorage.getItem('token');
        if (token === null) {
            axios.get(BACK_PING, defaullHeader)
                .then((response) => {
                    console.log(response.data);
                    setHello(response.data)
                });
        } else {
            const decodedToken = parseJwt(token);
            console.log(decodedToken);
            setHello(decodedToken.username)
        }
    }, [])

    const parseJwt = (token: string) => {
        if (!token) {
            return;
        }
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace("-", "+").replace("_", "/");
        return JSON.parse(window.atob(base64));
    };

    return (
        <>
            <div className={'text-center mt-5'}>{hello}</div>
            <div className={'d-flex justify-content-center align-items-center'}>
                <button className={'btn btn-primary m-2'} onClick={() => navigate('/signin')}>Sign In</button>
                <button className={'btn btn-secondary m-2'} onClick={() => navigate('/signup')}>Sign Up</button>
            </div>
        </>
    )
}

export default HomeView