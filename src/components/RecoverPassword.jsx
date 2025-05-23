import React, { useState } from "react";
import { resetPassword } from "../firebase/firebasePassword"; // Altere para o caminho correto
import Background from "./Background";

const RecoverPassword = () => {
    const [email, setEmail] = useState("");

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (email) {
            await resetPassword(email);
        } else {
            alert("Por favor, insira seu e-mail.");
        }
    };

    return (
        <div className="resetPasswordForm">
            <h2>Recuperar Senha</h2>
            <form onSubmit={handleResetPassword} className="">
                <input
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit">Enviar e-mail de recuperação</button>
            </form>
            <img alt="Sad Player" src="/sadWhite.png" className="sad" />
            <Background />
        </div>
    );
};

export default RecoverPassword;
