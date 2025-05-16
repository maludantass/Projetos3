import React, { useState, useEffect } from 'react';
import './Eventos.css'; // Importa o arquivo CSS




function ItemLista() {
   return (
       <li>
           <span></span>
           <span></span>
           <span></span>
           <svg viewBox="0 0 24 24">
               <path d="M8 5v14l11-7z" />
           </svg>
       </li>
   );
}


function TopicoArtigos({ titulo }) {
   return (
       <div className="topic">
           <h3>{titulo}</h3>
           <ul>
               <ItemLista />
               <ItemLista />
               <ItemLista />
               <ItemLista />
               <ItemLista />
               <ItemLista />
           </ul>
           <button className="view-more">
               Ver mais
               <svg viewBox="0 0 24 24">
                   <path d="M7 10l5 5 5-5z" />
               </svg>
           </button>
       </div>
   );
}


function SecaoArtigos() {
   return (
       <section className="articles">
           <TopicoArtigos titulo="Artigos - Tópico W" />
           <TopicoArtigos titulo="Artigos - Tópico X" />
           <TopicoArtigos titulo="Artigos - Tópico Y" />
           <TopicoArtigos titulo="Artigos - Tópico Z" />
       </section>
   );
}

//certo
function SecaoEventos({ titulo, eventos }) {
  const hoje = new Date().toISOString().split('T')[0];

    const eventosOrdenados = [...eventos]
    .filter(evento => evento.dataFim >= hoje)
    .sort((a, b) => new Date(a.dataInicio) - new Date(b.dataInicio));

  const [mostrarTodos, setMostrarTodos] = useState(false);

  const eventosIniciais = eventosOrdenados.slice(0, 5);
  const eventosExtras = eventosOrdenados.slice(5);

  return (
    <section className="events">
      <h2>{titulo}</h2>

      <div className="grid-container">
        {/* Sempre renderiza 6 espaços */}
        {Array.from({ length: 5 }).map((_, i) => {
          const evento = eventosIniciais[i];
          return (
            <div className="item" key={i}>
              {evento ? (
                <>
                  <h4>{evento.titulo}</h4>
                  <p>{evento.dataInicio} - {evento.dataFim}</p>
                  <p>{evento.detalhe}</p>
                  {evento.link && (
                    <a href={evento.link} target="_blank" rel="noopener noreferrer">
                      Acessar
                    </a>
                  )}
                </>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Eventos extras */}
      {mostrarTodos && (
        <div className="grid-container extras">
          {eventosExtras.map((evento, index) => (
            <div className="item" key={index + 5}>
              <h4>{evento.titulo}</h4>
              <p>{evento.dataInicio} - {evento.dataFim}</p>
              <p>{evento.detalhe}</p>
              {evento.link && (
                <a href={evento.link} target="_blank" rel="noopener noreferrer">
                  Acessar
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {eventosExtras.length > 0 && (
        <button
          className="view-more"
          onClick={() => setMostrarTodos(!mostrarTodos)}
          aria-expanded={mostrarTodos}
        >
          {mostrarTodos ? 'Ver menos' : 'Ver mais'}
          <svg viewBox="0 0 24 24">
            <path d={mostrarTodos ? "M7 14l5-5 5 5z" : "M7 10l5 5 5-5z"} />
          </svg>
        </button>
      )}
    </section>
  );
}




function Eventos() {

    const [mostrarModal, setMostrarModal] = useState(false);
    const [todosEventos, setTodosEventos] = useState([]);

    useEffect(() => {
        const buscarEventos = async () => {
            try {
                const resposta = await fetch('http://localhost:8080/api/eventos');
                const dados = await resposta.json();
                setTodosEventos(dados);
            } catch (erro) {
                console.error("Erro ao buscar eventos:", erro);
            }
        };
        buscarEventos();
    }, []);

    const eventosProximos = todosEventos;
    const eventosGravados = todosEventos.filter(ev => ev.gravado);

   const [form, setForm] = useState({
        titulo: '',
        dataInicio: '',
        dataFim: '',
        detalhe: '',
        link: '',
        gravado: false,
        emailUsuario: localStorage.getItem('email') || ''
    });

   const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e) => {
        e.preventDefault();

        const hoje = new Date().toISOString().split("T")[0];

        if (form.dataInicio < hoje) {
            alert("A data de início deve ser igual ou posterior a hoje.");
            return;
        }

        if (form.dataFim < form.dataInicio) {
            alert("A data de término não pode ser anterior à data de início.");
            return;
        }

        const user = JSON.parse(localStorage.getItem("user"));
        const email = user?.email || "sem-email";
        const eventoComEmail = { ...form, emailUsuario: email };

        console.log("Dados enviados:", eventoComEmail); 

        try {
            await fetch('http://localhost:8080/api/eventos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventoComEmail)
            });
            fecharModal();
        } catch (error) {
            console.error('Erro ao criar evento', error);
        }
    };

    const fecharModal = () => {
        setMostrarModal(false);
        setForm({
            titulo: '',
            dataInicio: '',
            dataFim: '',
            detalhe: '',
            link: '',
            gravado: false,
            emailUsuario: localStorage.getItem('email') || ''
        });
    };


    return (
            <main>
                    <div className="top-bar-eventos">
                        <button className="add-event-btn" onClick={() => setMostrarModal(true)}>+</button>
                    </div>

                    <SecaoEventos titulo="Eventos próximos" eventos={eventosProximos} />
                    <SecaoEventos titulo="Eventos gravados" eventos={eventosGravados} />

                    {mostrarModal && (
                        <div className="modal-overlay">
                        <div className="modal">
                            <h3>Novo Evento</h3>
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    name="titulo"
                                    placeholder="Título"
                                    value={form.titulo}
                                    onChange={handleChange}
                                    required
                                />
                                <h5>Data de início</h5>
                                <input
                                    type="date"
                                    name="dataInicio"
                                    value={form.dataInicio}
                                    onChange={(e) => {
                                        const novaDataInicio = e.target.value;
                                        setForm({ ...form, dataInicio: novaDataInicio });

                                        //impede que a data do fim seja maior que a do inicio
                                        if (form.dataFim && form.dataFim < novaDataInicio) {
                                            setForm(prev => ({ ...prev, dataFim: "" }));
                                        }
                                    }}
                                    min={new Date().toISOString().split("T")[0]} // hoje
                                    required
                                />
                                <h5>Data de término</h5>
                                <input
                                    type="date"
                                    name="dataFim"
                                    value={form.dataFim}
                                    onChange={handleChange}
                                    min={form.dataInicio || new Date().toISOString().split("T")[0]}
                                    required
                                />
                                <textarea
                                    name="detalhe"
                                    placeholder="Detalhes"
                                    value={form.detalhe}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="link"
                                    placeholder="Link do evento"
                                    value={form.link}
                                    onChange={handleChange}
                                    />

                                    <div>
                                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                                            Evento será gravado?
                                        </label>

                                        <div style={{ display: "flex", gap: "24px", alignItems: "center", marginBottom: "16px" }}>
                                            <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                            <input
                                                type="radio"
                                                name="gravado"
                                                value="true"
                                                checked={form.gravado === true}
                                                onChange={() => setForm({ ...form, gravado: true })}
                                            />
                                            Sim
                                            </label>

                                            <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                            <input
                                                type="radio"
                                                name="gravado"
                                                value="false"
                                                checked={form.gravado === false}
                                                onChange={() => setForm({ ...form, gravado: false })}
                                            />
                                            Não
                                            </label>
                                        </div>
                                    </div>

                                <div className="modal-actions">
                                    <button type="submit">Salvar</button>
                                    <button type="button" onClick={fecharModal}>Cancelar</button>
                                </div>
                            </form>
                        </div>
                        </div>
                    )}
                </main>
            );
}


function App() {
   return (
       <div>
           <Eventos />
            <SecaoArtigos />
       </div>
   );
}


export default App;

