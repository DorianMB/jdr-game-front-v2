import {adminGuard} from "../utils/auth.guard.ts";
import {useEffect, useState} from "react";
import axios from "axios";
import {GET_USERS} from "../utils/api.ts";
import {jwtHeader} from "../utils/header.ts";
import {UserModel} from "../models/user.model.ts";
import CustomTable from "../Components/CustomTable.tsx";

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
            <div className="card w-75 mx-auto">
                <CustomTable columns={['user_id', 'name', 'mail', 'is_admin']} data={users as []}/>
            </div>
        </>
    );
}

export default Admin;