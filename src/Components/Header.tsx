import {useEffect, useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {parseJwt} from "../utils/jwt.ts";
import {UserModel} from "../models/user.model.ts";
import {
    RiAdminLine,
    RiHome2Line,
    RiLoginCircleLine,
    RiShutDownLine,
    RiSwordLine,
    RiUserAddLine
} from "@remixicon/react";

function Header() {
    const [title] = useState('Loot Legends')
    const [logoUrl] = useState(['/logo1.png', '/logo2.png', '/logo3.png', '/logo4.png'])
    const [isAuth, setAuth] = useState(false)
    const [user, setUser] = useState<UserModel>()
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            if (token) {
                setAuth(true);
                setUser(parseJwt(token));
            } else {
                setAuth(false);
            }
        }

        // Check auth status on component mount
        checkAuth();

        // Listen for changes to localStorage
        window.addEventListener("TokenUpdateEvent", checkAuth, false);

        // Cleanup
        return () => {
            window.removeEventListener('TokenUpdateEvent', checkAuth);
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        setAuth(false);
        navigate('/', {replace: true});
    }

    return (
        <nav className="navbar navbar-expand-lg bg-light">
            <div className="container-fluid">
                {
                    logoUrl &&
                    <NavLink to="/" className="me-3">
                        <img
                            src={logoUrl[1]}
                            className="img-fluid logo-header"/>
                    </NavLink>
                }
                {
                    !logoUrl &&
                    <a className="navbar-brand" to="/">{title}</a>
                }
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink className={"nav-link d-flex align-items-center me-2"}
                                     aria-current="page"
                                     to="/">
                                <RiHome2Line className="me-2"></RiHome2Line>
                                Home
                            </NavLink>
                        </li>
                        {(user && user.is_admin === 1) && (
                            <li className="nav-item">
                                <NavLink className={"nav-link d-flex align-items-center me-2"}
                                         to="/admin">
                                    <RiAdminLine className="me-2"></RiAdminLine>
                                    Admin
                                </NavLink>
                            </li>
                        )
                        }
                        {isAuth ? (
                            <>
                                <li className="nav-item">
                                    <NavLink className={"nav-link d-flex align-items-center me-2"}
                                             to="/fight">
                                        <RiSwordLine className="me-2"></RiSwordLine>
                                        Fight
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className={"nav-link d-flex align-items-center me-2"} to="/"
                                             onClick={logout}>
                                        <RiShutDownLine className="me-2"></RiShutDownLine>
                                        Logout
                                    </NavLink>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <NavLink className={"nav-link d-flex align-items-center me-2"}
                                             to="/signin">
                                        <RiLoginCircleLine className="me-2"></RiLoginCircleLine>
                                        Sign In
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className={"nav-link d-flex align-items-center me-2"}
                                             to="/signup">
                                        <RiUserAddLine className="me-2"></RiUserAddLine>
                                        Sign Up
                                    </NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header;