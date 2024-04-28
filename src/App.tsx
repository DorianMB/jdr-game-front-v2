import {Route, Routes} from 'react-router-dom';
import HomeView from './Views/HomeView';
import './assets/styles/pages/App.scss'
import SignIn from "./Views/SignIn.tsx";
import SignUp from "./Views/SignUp.tsx";
import Header from "./Components/Header.tsx";

function App() {
    return (
        <>
            <Header></Header>
            <Routes>
                <Route path="/" element={<HomeView/>}/>
                <Route path="/signin" element={<SignIn/>}/>
                <Route path="/signup" element={<SignUp/>}/>
            </Routes>
        </>
    )
}

export default App
