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

    const [isNavCollapsed, setIsNavCollapsed] = useState(true);

    const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

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
                    <NavLink className="navbar-brand" to="/">{title}</NavLink>
                }
                <button className="navbar-toggler" type="button"
                        aria-controls="navbarText" aria-expanded={!isNavCollapsed}
                        aria-label="Toggle navigation"
                        onClick={handleNavCollapse}>
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`}>
                    <ul className="navbar-nav mb-2 mb-lg-0 d-flex align-items-center justify-content-center">
                        {isAuth ? (
                            <>
                                <li className="nav-item">
                                    <NavLink className={"nav-link d-flex align-items-center me-2"}
                                             aria-current="page"
                                             to="/">
                                        <RiHome2Line className="me-4 me-lg-2 text-rare"></RiHome2Line>
                                        Home
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className={"nav-link d-flex align-items-center me-2"}
                                             to="/fight">
                                        <RiSwordLine className="me-4 me-lg-2 text-epic"></RiSwordLine>
                                        Fight
                                    </NavLink>
                                </li>
                                {(user && user.is_admin === 1) && (
                                    <li className="nav-item">
                                        <NavLink className={"nav-link d-flex align-items-center me-2"}
                                                 to="/admin">
                                            <RiAdminLine className="me-4 me-lg-2 text-legendary"></RiAdminLine>
                                            Admin
                                        </NavLink>
                                    </li>
                                )
                                }
                                <li className="nav-item">
                                    <div
                                        className={"nav-link d-flex align-items-center me-2 cursor-pointer"}
                                        onClick={logout}>
                                        <RiShutDownLine className="me-4 me-lg-2 text-danger"></RiShutDownLine>
                                        Logout
                                    </div>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <NavLink className={"nav-link d-flex align-items-center me-2"}
                                             to="/signin">
                                        <RiLoginCircleLine className="me-4 me-lg-2 text-common"></RiLoginCircleLine>
                                        Sign In
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className={"nav-link d-flex align-items-center me-2"}
                                             to="/signup">
                                        <RiUserAddLine className="me-4 me-lg-2 text-common"></RiUserAddLine>
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