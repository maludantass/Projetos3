import React, { useState } from 'react';
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
function SecaoEventos({ titulo }) {
   return (
       <section className="events">
           <h2>{titulo}</h2>
           <div className="grid-container">
               <div className="item"></div>
               <div className="item"></div>
               <div className="item"></div>
               <div className="item"></div>
           </div>
           <button className="view-more">
               Ver mais
               <svg viewBox="0 0 24 24">
                   <path d="M7 10l5 5 5-5z" />
               </svg>
           </button>
       </section>
   );
}


function Eventos() {

    const [mostrarModal, setMostrarModal] = useState(false);
   const [form, setForm] = useState({
        titulo: '',
        dataInicio: '',
        dataFim: '',
        detalhe: '',
        link: '',
        gravado: false
        });

   const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         await fetch('http://localhost:8080/api/eventos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
            });
         setMostrarModal(false);
      } catch (error) {
         console.error('Erro ao criar evento', error);
      }
   };
    return (
            <main>
                    <div className="top-bar-eventos">
                        <button className="add-event-btn" onClick={() => setMostrarModal(true)}>+</button>
                    </div>

                    <SecaoEventos titulo="Eventos próximos" />
                    <SecaoEventos titulo="Eventos gravados" />

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
                                <input
                                    type="date"
                                    name="dataInicio"
                                    value={form.dataInicio}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="date"
                                    name="dataFim"
                                    value={form.dataFim}
                                    onChange={handleChange}
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
                                    <button type="button" onClick={() => setMostrarModal(false)}>Cancelar</button>
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

