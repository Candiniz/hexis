import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useNickname } from "../context/NicknameContext"; // Importando o contexto
import { ref, set, get } from "firebase/database";
import { useAuth } from "../context/AuthContext";
import { database } from "../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth } from "firebase/auth";
import Background from "./Background";
import Popper from "./Popper";


// Função para salvar o nickname no Firebase
async function saveNickname({ nickname, e, setNickname, user }) {

    try {
        const userRef = ref(database, 'users/' + user.uid + '/nicknames');  // Ref para os nicknames do usuário
        const snapshot = await get(userRef);

        // Verifica se o nickname já existe para o usuário
        if (!snapshot.exists() || !snapshot.val()[nickname]) {
            // Se o nickname não existe, cria o novo nickname dentro da lista do usuário
            await set(ref(database, `users/${user.uid}/nicknames/${nickname}`), {
                Nickname: nickname,
                NewestScore: 0,
                HighestScore: 0,
            });
            const userEmailRef = ref(database, `users/${user.uid}/email`);
            const userSnapshot = await get(userEmailRef);

            // Verifique se o e-mail já foi salvo no banco de dados
            if (!userSnapshot.exists()) {
                await set(userEmailRef, user.email);  // Salva o e-mail no nó do usuário
                console.log("E-mail salvo com sucesso:", user.email);
            } else {
                console.log("E-mail já está registrado para este usuário.");
            }
            console.log("Nickname saved successfully!");
        } else {
            console.log("Nickname already exists for this user.");
        }

        e.preventDefault();
        setNickname(nickname);  // Atualiza o estado com o novo nickname
    } catch (error) {
        console.error("Error saving nickname:", error);
    }
}

function MainMenu() {
    const [nicknameInput, setNicknameInput] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setNickname } = useNickname();  // Acessando o contexto
    const [nicknames, setNicknames] = useState([]); // Nicknames do usuário
    const navigate = useNavigate();
    const auth = getAuth();

    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            console.log("Usuário autenticado:", user);
        }
    }, [user]);


    async function fetchNicknamesByEmail(email) {
        try {
            const usersRef = ref(database, 'users'); // Referência ao nó de usuários
            const snapshot = await get(usersRef);

            if (snapshot.exists()) {
                const users = snapshot.val();

                // Busca pelo email correspondente
                for (let userId in users) {


                    if (users[userId].email === email) {
                        const nicknamesData = users[userId].nicknames;

                        if (nicknamesData) {
                            setNicknames(Object.keys(nicknamesData)); // Atualiza os nicknames
                            return;
                        } else {
                            console.log("Nenhum nickname encontrado para este usuário.");
                            setNicknames([]); // Nenhum nickname encontrado
                            return;
                        }
                    }
                }
            }

            console.log("E-mail não encontrado.");
            setNicknames([]); // Caso nenhum usuário seja encontrado
        } catch (error) {
            console.error("Erro ao buscar nicknames:", error);
            setNicknames([]); // Em caso de erro
        }
    }

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
        e.preventDefault();

        if (nicknameInput && email && password) {
            try {
                let userCredential = null;

                // Primeiro tenta criar o usuário
                try {
                    userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    const user = userCredential.user;

                    // Salva o nickname após a criação do usuário
                    await saveNickname({ nickname: nicknameInput, e, setNickname, user });

                    // Atualiza o nickname no localStorage e navega para o jogo com o nickname
                    localStorage.setItem("nickname", nicknameInput); // Atualiza o localStorage com o nickname
                    navigate("/game", { state: { nickname: nicknameInput } }); // Envia o nickname para a página do jogo
                } catch (createError) {
                    if (createError.code === "auth/email-already-in-use") {
                        // Se o email já estiver em uso, faz login
                        try {
                            userCredential = await signInWithEmailAndPassword(auth, email, password);

                            // Aguarde até que o auth.currentUser seja atualizado
                            if (!auth.currentUser) {
                                await new Promise(resolve => setTimeout(resolve, 1000)); // Aguarda 1 segundo para garantir a atualização do estado do usuário
                            }

                            // Agora que o usuário está autenticado, você pode buscar os nicknames
                            await fetchNicknamesByEmail(email);

                            // Atualiza o nickname no localStorage e navega para o jogo com o nickname
                            localStorage.setItem("nickname", nicknameInput); // Atualiza o localStorage com o nickname
                            navigate("/game", { state: { nickname: nicknameInput } }); // Envia o nickname para a página do jogo
                        } catch (loginError) {
                            alert("Falha no login. Por favor, cheque seu email e senha.");
                            return;
                        }
                    } else {
                        alert("Erro ao tentar criar o usuário: " + createError.message);
                        return;
                    }
                }
            } catch (error) {
                console.error("Erro ao processar o login/criação:", error);
                alert("Erro ao tentar realizar login ou criar usuário.");
            }
        } else {
            alert("Por favor, entre com seu nickname, email e senha para jogar!");
        }
    };





    return (
        <div className="main-menu">

            <img ref={imageRef} alt="Logo" src="/logo_hexis2.png" className="logo_main" />
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
                    type="email"
                    placeholder="Entre com seu email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        fetchNicknamesByEmail(e.target.value); // Busca os nicknames associados
                    }}
                />
                <input
                    className="input_main"
                    type="password"
                    placeholder="Entre com sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    style={{ marginTop: "10px" }}
                    className="input_main"
                    type="text"
                    placeholder="Escolha um nickname (novo ou existente)"
                    value={nicknameInput}
                    onChange={(e) => setNicknameInput(e.target.value)}
                    list="nickname-suggestions"
                />
                <datalist id="nickname-suggestions">
                    {nicknames.map((nickname, index) => (
                        <option key={index} value={nickname}>
                            {nickname}
                        </option>
                    ))}
                </datalist>
                <div className="btn-div">
                    <button className="menu-button" onClick={handleStart}>Jogar!</button>
                    <Link to="/ranking" className="menu-button-link">
                        Ranking Global
                    </Link>
                </div>
                <p>
                    <Link to="/recover-password" className="recover_password">Esqueceu sua senha?</Link>
                </p>
            </div>
            <Background />
        </div>
    );
}

export default MainMenu;
