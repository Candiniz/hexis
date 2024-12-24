import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useNickname } from "../context/NicknameContext"; // Importando o contexto
import { ref, set, get } from "firebase/database";
import { database, auth } from "../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import Background from "./Background";

// Função para salvar o nickname no Firebase
async function saveNickname({ nickname, e, setNickname, user }) {
    try {
        const userRef = ref(database, 'users/' + nickname);  // Caminho para os dados do usuário
        const snapshot = await get(userRef);

        if (!snapshot.exists()) {
            // Se o usuário não existe, cria o novo usuário com os valores iniciais
            await set(userRef, {
                Nickname: nickname,
                NewestScore: 0,
                HighestScore: 0,
                userId: user.uid,  // Salva o UID do usuário autenticado
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
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setNickname } = useNickname();  // Acessando o contexto
    const navigate = useNavigate();

    const handleStart = async (e) => {
        e.preventDefault(); // Previne o comportamento padrão do form
    
        if (nicknameInput && email && password) {
            try {
                // Primeiro tenta fazer login
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
    
                // Salva o nickname no Firebase após o login bem-sucedido
                await saveNickname({ nickname: nicknameInput, e, setNickname, user });
                navigate("/game");  // Navega para o jogo
    
            } catch (error) {
                // Se falhar, tenta criar o novo usuário
                if (error.code === "auth/user-not-found") {
                    try {
                        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                        const user = userCredential.user;
    
                        // Salva o nickname no Firebase após a criação do novo usuário
                        await saveNickname({ nickname: nicknameInput, e, setNickname, user });
                        navigate("/game");  // Navega para o jogo
                    } catch (createError) {
                        alert("Error creating user: " + createError.message);
                    }
                } else if (error.code === "auth/email-already-in-use") {
                    // O email já está em uso, mas o login já foi tentado acima
                    alert("Email already in use, please login.");
                } else {
                    alert("Login failed. Please check your email and password.");
                }
            }
        } else {
            alert("Please enter a nickname, email, and password to start the game!");
        }
    };

    return (
        <div className="main-menu">
            <img alt="Logo" src="/logo_hexis.png" className="logo_main" />
            <div className="menu-options">
                <input
                    className="input_main"
                    type="text"
                    placeholder="Enter your nickname"
                    value={nicknameInput}
                    onChange={(e) => setNicknameInput(e.target.value)}  // Atualiza o estado do nickname
                />
                <input
                    className="input_main"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}  // Atualiza o estado do email
                />
                <input
                    className="input_main"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}  // Atualiza o estado da senha
                />
                <div className="btn-div">
                    <button className="menu-button" onClick={handleStart}>Jogar</button>
                    <Link to="/ranking" className="menu-button-link">
                        Ranking Global
                    </Link>
                </div>
            </div>
            <Background />
        </div>
    );
}

export default MainMenu;
