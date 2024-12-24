import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useNickname } from "../context/NicknameContext"; // Importando o contexto
import { ref, set, get } from "firebase/database";
import { database } from "../firebase/firebaseConfig";

// Função para salvar o nickname no Firebase
async function saveNickname({ nickname, e, setNickname }) {
    try {
        const userRef = ref(database, 'users/' + nickname);  // Caminho para os dados do usuário
        const snapshot = await get(userRef);

        if (!snapshot.exists()) {
            // Se o usuário não existe, cria o novo usuário com os valores iniciais
            await set(userRef, {
                Nickname: nickname,
                NewestScore: 0,
                HighestScore: 0,
            });
            console.log("Nickname saved successfully!");
        } else {
            // Se o usuário já existe, não sobrescreve os scores
            console.log("Nickname already exists. No need to overwrite scores.");
        }

        e.preventDefault(); // Previne o comportamento padrão
        setNickname(nickname);  // Atualiza o state com o nickname
    } catch (error) {
        console.error("Error saving nickname:", error);
    }
}

function MainMenu() {
    const [nicknameInput, setNicknameInput] = useState("");
    const { setNickname } = useNickname();  // Acessando o contexto
    const navigate = useNavigate();

    const handleStart = async (e) => {
        e.preventDefault(); // Previne o comportamento padrão de submit de um formulário
        if (nicknameInput) {
            await saveNickname({ nickname: nicknameInput, e, setNickname }); // Passa o nickname e o evento para a função
            navigate("/game");  // Navega para o jogo
        } else {
            alert("Please enter a nickname to start the game!");
        }
    };

    return (
        <div className="main-menu">
            <h1>Bem-vindo ao Hexis</h1>
            <div className="menu-options">
                <input
                    type="text"
                    placeholder="Enter your nickname"
                    value={nicknameInput}
                    onChange={(e) => setNicknameInput(e.target.value)}  // Atualiza o estado do nickname
                />
                <div>
                    <button className="menu-button" onClick={handleStart}>Jogar</button>
                    <Link to="/ranking">
                        <button className="menu-button">Ranking Global</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default MainMenu;
