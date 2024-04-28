import {adminGuard} from "../utils/auth.guard.ts";
import {useEffect, useState} from "react";
import axios from "axios";
import {GET_USERS} from "../utils/api.ts";
import {jwtHeader} from "../utils/header.ts";
import {UserModel} from "../models/user.model.ts";

function Admin() {
    const [users, setUsers] = useState<UserModel[]>([]);

    useEffect(() => {
        adminGuard();
        const token = localStorage.getItem('token');
        axios.get(GET_USERS, jwtHeader(token!)).then((response) => {
            console.log(response.data);
            setUsers(response.data);
        });
    }, []);

    return (
        <>
            <h1 className="text-center mt-5">Admin</h1>
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
    );
}

export default Admin;