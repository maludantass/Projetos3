import React from "react";
import Faq from "./Faq"; // Importa o componente de FAQ

const Ajuda = () => {
    return (
        <div className="ajuda-container">
            <h1>Ajuda e FAQ´s</h1>
            <p>Conteúdo de ajuda</p>

            <hr style={{ margin: "20px 0" }} />
            <h2>Perguntas Frequentes</h2>

            <Faq /> {/* aqui FAQ aparece dentro da página de ajuda*/}
        </div>
    );
};

export default Ajuda;
