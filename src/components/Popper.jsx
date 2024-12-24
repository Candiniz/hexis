import React from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // Estilos padrão do Tippy.js
import { TbHelpHexagon  } from "react-icons/tb";


function TippyExample() {
    return (
        <div className="">
            {/* Botão com Tippy.js */}
            <Tippy
                content={
                    <div className="popper_txt" style={{ padding: "10px", textAlign: "center" }}>
                        Bem vindo! Hexis é um jogo feito por mim em React.js baseado no jogo Trigon. 
                        <br /><br />
                        
                        Para começar, escolha um nickname, insira seu melhor email (não enviaremos nada) e crie uma senha. Caso seja sua primeira vez, sua conta será <span>criada automaticamente</span>, mas se já tiver uma conta, o sistema irá te <span>logar automaticamente</span> com suas credenciais. 
                        <br /><br />
                        
                        <span>Você pode cadastrar quantos nicknames quiser em seu cadastro</span>, mas não pode usar nicknames cadastrados por outros jogadores. Veja o ranking e tente superar os melhores! 
                        <br /><br />

                        <span>Boa sorte!</span>
                    </div>
                } // O conteúdo do popover
                placement="bottom" // Posicionamento em relação ao botão
                trigger="click" // Evento que ativa o popover
                interactive={true} // Permite interação com o popover
                theme="custom"
            >
                <button className="tippy_btn"><TbHelpHexagon  /></button>
            </Tippy>
        </div>
    );
}

export default TippyExample;
