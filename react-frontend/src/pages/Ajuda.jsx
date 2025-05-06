import React from "react";
import Faq from "./Faq"; //componente de FAQ

const Ajuda = () => {
    return (
        <div className="ajuda-container">

            <hr style={{ margin: "20px 0" }} />
            <h2>Perguntas Frequentes</h2>

            <Faq /> {/* aqui FAQ aparece dentro da página de ajuda*/}
        </div>
    );
};

export default Ajuda;
