import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNickname } from "../context/NicknameContext"; // Acessando o contexto
import { ref, get, set } from "firebase/database";
import { database } from "../firebase/firebaseConfig";
import { getAuth } from "firebase/auth";

const GameOver = () => {
  const [newestScore, setNewestScore] = useState(null);
  const [highestScore, setHighestScore] = useState(null);
  const location = useLocation();
  const { score } = location.state || {}; // Pegando o score enviado pelo Board
  const { nickname } = useNickname();  // Acessando o nickname do contexto
  const [user, setUser] = useState(null);  // Estado para armazenar o usuário autenticado

  // Verifica o usuário autenticado assim que o componente é montado
  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);  // Atualiza o estado com o usuário autenticado
    }
  }, []);

  async function updateScores(nickname, newestScore) {
    try {
      const userRef = ref(database, 'users/' + nickname);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userData = snapshot.val();

        // Verifica se o novo score é maior que o HighestScore atual
        const updatedHighestScore = (newestScore > userData.HighestScore)
          ? newestScore  // Se o novo score for maior, atualiza o HighestScore
          : userData.HighestScore;  // Caso contrário, mantém o valor atual do HighestScore

        // Atualiza o NewestScore e o HighestScore
        await set(userRef, {
          ...userData,
          NewestScore: newestScore,  // Atualiza o NewestScore
          HighestScore: updatedHighestScore,  // Atualiza o HighestScore apenas se necessário
        });

        console.log("Scores updated successfully!");
        return { NewestScore: newestScore, HighestScore: updatedHighestScore };
      } else {
        console.log("No data available for this user.");
        return null;
      }
    } catch (error) {
      console.error("Error updating scores:", error);
      return null;
    }
  }

  useEffect(() => {
    if (nickname && score !== undefined && user) {
      // Atualiza os scores apenas se o usuário estiver autenticado
      updateScores(nickname, score).then((updatedScores) => {
        if (updatedScores) {
          setNewestScore(updatedScores.NewestScore);
          setHighestScore(updatedScores.HighestScore);
        }
      });
    }
  }, [nickname, score, user]); // Reexecuta quando o nickname, score ou user mudarem

  return (
    <div className="game-over">
      <h1>Game Over</h1>
      {newestScore !== null ? (
        <p>Your Newest Score: {newestScore}</p>
      ) : (
        <p>No score available</p>
      )}
      {highestScore !== null ? (
        <p>Your Highest Score: {highestScore}</p>
      ) : (
        <p>No highest score available</p>
      )}
      <button onClick={() => window.location.href = "/"}>Play Again</button>
    </div>
  );
};

export default GameOver;
