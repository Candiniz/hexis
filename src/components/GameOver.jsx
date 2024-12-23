import React from "react";

const GameOver = () => {
    const score = localStorage.getItem("score"); // Recupera o score salvo

    return (
        <div className="game-over">
            <h1>Game Over</h1>
            <p>Your score: {score}</p>
            <button onClick={() => window.location.href = "/"}>Play Again</button>
        </div>
    );
};

export default GameOver;
