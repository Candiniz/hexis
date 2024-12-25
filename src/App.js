import { Route, Routes, BrowserRouter } from "react-router-dom";
import { NicknameProvider } from "./context/NicknameContext";
import { AuthProvider } from "./context/AuthContext";
import Board from './components/Board';
import Ranking from "./components/Ranking";
import GameOver from "./components/GameOver";
import MainMenu from "./components/MainMenu"; // Adicionando o MainMenu
import RecoverPassword from "./components/RecoverPassword";
import Footer from "./components/Footer";

import './App.css';

function App() {
  return (
    <AuthProvider>
      <NicknameProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainMenu />} />
            <Route path="/game" element={<Board />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/game-over" element={<GameOver />} />
            <Route path="/recover-password" element={<RecoverPassword />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </NicknameProvider>
    </AuthProvider>
  );
}

export default App;
