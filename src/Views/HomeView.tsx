import {useEffect, useState} from 'react'
import {authGuard} from "../utils/auth.guard.ts";
import {parseJwt} from "../utils/jwt.ts";
import axios from "axios";
import {GET_USERS} from "../utils/api.ts";
import {jwtHeader} from "../utils/header.ts";

function HomeView() {
    const [username, setUsername] = useState('Hello World');
    const [users, setUsers] = useState<{ name: string, user_id: number, mail: string, is_admin: number }[]>([]);
    // when page is show and only one time get data from back localhost:3000 with axios
    useEffect(() => {
        authGuard();
        console.log('useEffect');
        const token = localStorage.getItem('token');
        const decodedToken = parseJwt(token!);
        console.log(decodedToken);
        setUsername(decodedToken.username)
        axios.get(GET_USERS, jwtHeader(token!)).then((response) => {
            console.log(response.data);
            setUsers(response.data);
        });
    }, [])

    return (
        <>
            <div className="text-center mt-5">{username}</div>
            <table className="table table-striped">
                <thead>
                <tr>
                    <th scope="col">name</th>
                    <th scope="col">mail</th>
                    <th scope="col">is_admin</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => {
                    return (
                        <tr key={user.user_id}>
                            <td>{user.name}</td>
                            <td>{user.mail}</td>
                            <td>{user.is_admin}</td>
                        </tr>
                    )
                })
                }
                </tbody>
            </table>
        </>
    )
}

export default HomeView