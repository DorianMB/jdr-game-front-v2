import {Route, Routes} from 'react-router-dom';
import HomeView from './Views/HomeView';
import SignInView from "./Views/SignInView.tsx";
import SignUpView from "./Views/SignUpView.tsx";
import AdminView from "./Views/AdminView.tsx";
import Header from "./Components/Header.tsx";
import CharacterView from "./Views/CharacterView.tsx";
import FightView from "./Views/FightView.tsx";

const version = import.meta.env.VITE_APP_VERSION;

function App() {
    return (
        <>
            <Header></Header>
            <Routes>
                <Route path="/" element={<HomeView/>}/>
                <Route path="/signin" element={<SignInView/>}/>
                <Route path="/signup" element={<SignUpView/>}/>
                <Route path="/admin" element={<AdminView/>}/>
                <Route path="/character/:id" element={<CharacterView/>}/>
                <Route path="/fight" element={<FightView/>}/>
            </Routes>
            <span className="badge bg-uncommon badge-version">{version}</span>
        </>
    )
}

export default App
