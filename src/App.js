import { Route, Routes, BrowserRouter, Link } from "react-router-dom";

import Board from './components/Board';
import Ranking from "./components/Ranking";
import GameOver from "./components/GameOver";
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/game" element={<Board />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/game-over" element={<GameOver />} />
      </Routes>
    </BrowserRouter>
  );
}

function MainMenu() {
  return (
    <div className="main-menu">
      <h1>Bem-vindo ao Jogo</h1>
      <div className="menu-options">
        <Link to="/game">
          <button className="menu-button">Jogar</button>
        </Link>
        <Link to="/ranking">
          <button className="menu-button">Ranking Global</button>
        </Link>
      </div>
    </div>
  );
}

export default App;
