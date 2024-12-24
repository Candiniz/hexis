import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useNickname } from "../context/NicknameContext"; // Importando o contexto
import { ref, set, get } from "firebase/database";
import { database, auth } from "../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import Background from "./Background";
import Popper from "./Popper";

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

    const [popperPosition, setPopperPosition] = useState({ top: 0, left: 0 });
    const imageRef = useRef(null);
    const popperRef = useRef(null);

    useEffect(() => {
        const updatePopperPosition = () => {
            if (imageRef.current) {
                const rect = imageRef.current.getBoundingClientRect();
                setPopperPosition({
                    top: rect.top + window.scrollY,
                    left: rect.left + window.scrollX,
                });
            }
        };
    
        window.addEventListener("load", updatePopperPosition); // Atualiza no carregamento completo
        window.addEventListener("resize", updatePopperPosition);
    
        return () => {
            window.removeEventListener("load", updatePopperPosition);
            window.removeEventListener("resize", updatePopperPosition);
        };
    }, []);
    

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
                    alert("Email já em uso. Use-o para fazer o login.");
                } else {
                    alert("Falha no login. Por favor, cheque seu email e senha.");
                }
            }
        } else {
            alert("Por favor, entre com seu nickname, email e senha para jogar!");
        }
    };

    return (
        <div className="main-menu">

            <img ref={imageRef} alt="Logo" src="/logo_hexis.png" className="logo_main" />
            <div
                ref={popperRef}
                style={{
                    position: "fixed",
                    top: `${popperPosition.top}px`,
                    left: `${popperPosition.left}px`,
                    padding: "10px",
                    borderRadius: "4px",
                }}
            >
                <Popper />
            </div>
            <div className="menu-options">
                <input
                    className="input_main"
                    type="text"
                    placeholder="Escolha um nickname (novo ou existente)"
                    value={nicknameInput}
                    onChange={(e) => setNicknameInput(e.target.value)}  // Atualiza o estado do nickname
                />
                <input
                    className="input_main"
                    type="email"
                    placeholder="Entre com seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}  // Atualiza o estado do email
                />
                <input
                    className="input_main"
                    type="password"
                    placeholder="Entre com sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <div className="btn-div">
                    <button className="menu-button" onClick={handleStart}>Vamos Jogar!</button>
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
