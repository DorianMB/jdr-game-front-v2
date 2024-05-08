import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {parseJwt} from "../utils/jwt.ts";
import {UserModel} from "../models/user.model.ts";

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

    const active = (path: string) => {
        return window.location.pathname === path ? 'active' : '';
    }

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
                    <a href="/">
                        <img
                            src={logoUrl[1]}
                            className="img-fluid logo-header"/>
                    </a>
                }
                {
                    !logoUrl &&
                    <a className="navbar-brand" href="/">{title}</a>
                }
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false"
                        aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className={"nav-link " + active('/')} aria-current="page" href="/">Home</a>
                        </li>
                        {(user && user.is_admin === 1) && (
                            <li className="nav-item">
                                <a className={"nav-link " + active('/admin')} href="/admin">Admin</a>
                            </li>
                        )
                        }
                        {isAuth ? (
                            <>
                                <li className="nav-item">
                                    <a className={"nav-link " + active('/fight')} href="/fight">Combat</a>
                                </li>
                                <li className="nav-item">
                                    <a className={"nav-link " + active('/')} href="/" onClick={logout}>Logout</a>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <a className={"nav-link " + active('/signin')} href="/signin">Sign In</a>
                                </li>
                                <li className="nav-item">
                                    <a className={"nav-link " + active('/signup')} href="/signup">Sign Up</a>
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