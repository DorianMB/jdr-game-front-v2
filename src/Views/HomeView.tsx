import {useEffect, useState} from 'react'
import {authGuard} from "../utils/auth.guard.ts";
import {parseJwt} from "../utils/jwt.ts";

function HomeView() {
    const [username, setUsername] = useState('Hello World');
    // when page is show and only one time get data from back localhost:3000 with axios
    useEffect(() => {
        authGuard();
        console.log('useEffect');
        const token = localStorage.getItem('token');
        const decodedToken = parseJwt(token!);
        console.log(decodedToken);
        setUsername(decodedToken.username)
    }, [])

    return (
        <>
            <h1>Hello {username}</h1>
        </>
    )
}

export default HomeView