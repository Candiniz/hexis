import React, { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { database } from "../firebase/firebaseConfig"; // Certifique-se de que esse caminho está correto

const Ranking = () => {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    // Função para buscar o ranking
    const fetchRanking = async () => {
      try {
        // Referência para os usuários no Firebase
        const usersRef = ref(database, 'users');
        const snapshot = await get(usersRef);

        if (snapshot.exists()) {
          const usersData = snapshot.val();
          let rankingList = [];

          // Itera sobre os usuários para pegar o HighestScore e o Nickname
          for (let userId in usersData) {
            const user = usersData[userId];
            for (let nickname in user.nicknames) {
              const nicknameData = user.nicknames[nickname];
              const { HighestScore, Nickname } = nicknameData;

              // Adiciona cada nickname e seu HighestScore na lista
              rankingList.push({ nickname: Nickname, highestScore: HighestScore });
            }
          }

          // Ordena o ranking pelo HighestScore de forma decrescente
          rankingList.sort((a, b) => b.highestScore - a.highestScore);

          // Atualiza o estado com o ranking
          setRanking(rankingList);
        } else {
          console.log("Nenhum dado encontrado no banco de dados.");
        }
      } catch (error) {
        console.error("Erro ao buscar o ranking:", error);
      }
    };

    fetchRanking();
  }, []);

  return (
    <div className="ranking-container">
      <h1>Ranking</h1>
      <ol>
        {ranking.map((entry, index) => (
          <li key={index}>
            {entry.nickname}: {entry.highestScore} pontos
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Ranking;
