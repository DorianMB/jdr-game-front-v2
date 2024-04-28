import {parseJwt} from "./jwt.ts";

export const authGuard = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/signin';
    }
}

export const adminGuard = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/signin';
    } else {
        const user = parseJwt(token);
        if (!user.is_admin && user.is_admin === 0) {
            window.location.href = '/';
        }
    }
}