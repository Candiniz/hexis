import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export const resetPassword = async (email) => {
    const auth = getAuth();

    try {
        await sendPasswordResetEmail(auth, email);
        alert("Um e-mail para redefinir sua senha foi enviado!");
    } catch (error) {
        console.error("Erro ao enviar o e-mail de recuperação:", error);
        if (error.code === "auth/user-not-found") {
            alert("Nenhum usuário encontrado com este e-mail.");
        } else if (error.code === "auth/invalid-email") {
            alert("E-mail inválido. Por favor, verifique e tente novamente.");
        } else {
            alert("Ocorreu um erro ao tentar recuperar a senha. Tente novamente.");
        }
    }
};
