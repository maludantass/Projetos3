import React, { useState } from 'react';
import './Faq.css';

function Faq() {
    const perguntas = [
        {
            pergunta: 'O que é a BRASFI, e qual a sua missão com o público?',
            resposta: 'As informações institucionais sobre a BRASFI — Aliança Brasileira de Finanças e Investimentos Sustentáveis — estão disponíveis na página inicial do site. A BRASFI tem como missão promover a conexão entre pessoas e organizações comprometidas com a transformação do mercado financeiro por meio de práticas sustentáveis, oferecendo acesso a conteúdos, eventos e iniciativas voltadas ao desenvolvimento de finanças responsáveis no Brasil.'
        },
        {
            pergunta: 'Quem pode participar da BRASFI?',
            resposta: 'A BRASFI é aberta a todas as pessoas e organizações interessadas em finanças e investimentos sustentáveis. Nossa comunidade acolhe profissionais, estudantes, pesquisadores, empreendedores e demais indivíduos que desejam se engajar com práticas financeiras responsáveis e contribuir para a transformação sustentável do mercado financeiro brasileiro.'
        },
        {
            pergunta: 'Quais recursos estão disponíveis na plataforma?',
            resposta: 'A plataforma da BRASFI disponibiliza acesso a artigos, publicações, eventos, fóruns de discussão e iniciativas colaborativas voltadas ao avanço das finanças sustentáveis no Brasil.'
        },
        {
            pergunta: 'Onde posso acessar os conteúdos e materiais disponibilizados?',
            resposta: 'Os eventos e iniciativas são divulgados periodicamente na seção dedicada da plataforma.'
        },
        {
            pergunta: 'Estou com dificuldades técnicas. Como proceder?',
            resposta: 'Em caso de instabilidade ou dificuldades de acesso, orientamos que entre em contato com nossa equipe técnica por meio dos contatosdisponíveis na seção “Home”.'
        },
        {
            pergunta: 'Como posso me cadastrar na plataforma?',
            resposta: 'Você pode se cadastrar clicando no botão "Login" no menu superior, e depois na opção "Cadastre-se", preenchendo seus dados.'
        },
        {
            pergunta: 'Como entrar em contato com o suporte?',
            resposta: 'Nosso suporte está disponível por e-mail e nos telefones disponíveis na home page.'
        }
    ];

    const [aberta, setAberta] = useState(null);

    const toggleResposta = (index) => {
        setAberta(aberta === index ? null : index);
    };

    return (
        <div className="faq-container">
            <h1>Perguntas Frequentes (FAQ)</h1>
            {perguntas.map((item, index) => (
                <div key={index} className="faq-item">
                    <button onClick={() => toggleResposta(index)} className="faq-pergunta">
                        {item.pergunta}
                        <span>{aberta === index ? '▲' : '▼'}</span>
                    </button>
                    {aberta === index && <p className="faq-resposta">{item.resposta}</p>}
                </div>
            ))}
        </div>
    );
}

export default Faq;
