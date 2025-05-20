import React, { useState, useEffect } from 'react';
import './Eventos.css'; 

function ModalDetalhesEvento({ evento, onClose }) {
  return (
    <div className="modal-overlay-detalhe-evento">
      <div className="modal">
        <h3>
          <button onClick={onClose} className="botao-voltar-modal">
            ← Voltar
          </button>
          <span>Detalhes do Evento</span>
        </h3>

        <div className="conteudo-modal">
          <h4>{evento.titulo}</h4>
          <p><strong>Organizadores:</strong> Nome do Organizador</p> {/* Adicione essa info ao seu objeto de evento */}
          
          <section style={{ marginTop: '16px' }}>
            <h5>Detalhes e Tópicos:</h5>
            <p>{evento.detalhe}</p>
          </section>
        </div>

        <div className="rodape-modal">
          <p><strong>Data:</strong> {evento.dataInicio} - {evento.dataFim}</p>
          {evento.link && (
            <p>
              <strong>Link:</strong> <a href={evento.link} target="_blank">{evento.link}</a>
            </p>
          )}
          <button 
            style={{
              background: '#2E7D32',
              color: 'white',
              padding: '10px 20px',
              marginTop: '16px'
            }}
          >
            Inscrever-se
          </button>
        </div>
      </div>
    </div>
  );
}

function SecaoEventos({ titulo, eventos, onEventoClick }) {
    const hoje = new Date().toISOString().split('T')[0];

    const eventosOrdenados = [...eventos]
        .filter(evento => evento.dataFim >= hoje)
        .sort((a, b) => new Date(a.dataInicio) - new Date(b.dataInicio));

    const [mostrarTodos, setMostrarTodos] = useState(false);

    const eventosIniciais = eventosOrdenados.slice(0, 4);
    const eventosExtras = eventosOrdenados.slice(4);

    return (
        <section className="events">
            <h2>{titulo}</h2>

            <div className="grid-container inicial"> {/* Adicione a classe "inicial" */}
  {Array.from({ length: 4 }).map((_, i) => { // Força 4 slots
    const evento = eventosIniciais[i];
    return (
      <div className="item" key={i} onClick={() => evento && onEventoClick(evento)}>
        {evento && (
          <>
            <h4 className="evento-titulo">{evento.titulo}</h4>
            <p className="evento-data">{evento.dataInicio} - {evento.dataFim}</p>
          </>
        )}
      </div>
    );
  })}
</div>

            {mostrarTodos && (
                <div className="grid-container extras">
                    {eventosExtras.map((evento, index) => (
                        <div className="item" key={index + 5} onClick={() => onEventoClick(evento)} style={{ cursor: 'pointer' }}>
                            <h4 className="evento-titulo">{evento.titulo}</h4>
                            <p className="evento-data">{evento.dataInicio} - {evento.dataFim}</p>
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
    const [mostrarModalAdicionar, setMostrarModalAdicionar] = useState(false);
    const [mostrarModalDetalhes, setMostrarModalDetalhes] = useState(false);
    const [eventoSelecionado, setEventoSelecionado] = useState(null);
    const [todosEventos, setTodosEventos] = useState([]);
    const [filtroTitulo, setFiltroTitulo] = useState(''); 

    const buscarEventos = async () => {
        try {
            const resposta = await fetch('http://localhost:8080/api/eventos');
            const dados = await resposta.json();
            setTodosEventos(dados);
        } catch (erro) {
            console.error("Erro ao buscar eventos:", erro);
        }
    };

    useEffect(() => {
        buscarEventos();
    }, []);

    const handleFiltroChange = (e) => {
        setFiltroTitulo(e.target.value);
    };

    const eventosProximos = todosEventos.filter(ev =>
        ev.titulo.toLowerCase().includes(filtroTitulo.toLowerCase())
    );

    const eventosGravados = todosEventos.filter(ev =>
        ev.gravado && ev.titulo.toLowerCase().includes(filtroTitulo.toLowerCase())
    );

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

        try {
            const resposta = await fetch('http://localhost:8080/api/eventos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventoComEmail)
            });

            if (resposta.ok) {
                await buscarEventos();
                fecharModalAdicionar();
            } else {
                alert("Erro ao salvar evento.");
            }
        } catch (error) {
            console.error('Erro ao criar evento', error);
            alert("Erro ao salvar evento.");
        }
    };

    const abrirModalDetalhes = (evento) => {
        setEventoSelecionado(evento);
        setMostrarModalDetalhes(true);
    };

    const fecharModalDetalhes = () => {
        setMostrarModalDetalhes(false);
        setEventoSelecionado(null);
    };

    const abrirModalAdicionar = () => {
        setMostrarModalAdicionar(true);
    };

    const fecharModalAdicionar = () => {
        setMostrarModalAdicionar(false);
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
            <div
                className="top-bar-eventos"
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                }}
            >
                <button className="add-event-btn" onClick={abrirModalAdicionar}>+</button>

                <input
                    type="text"
                    placeholder="Pesquisar por título"
                    value={filtroTitulo}
                    onChange={handleFiltroChange}
                    style={{
                        padding: '6px 10px',
                        fontSize: '16px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        width: '250px',
                    }}
                />
            </div>

            <SecaoEventos
                titulo="Eventos próximos"
                eventos={eventosProximos}
                onEventoClick={abrirModalDetalhes}
            />
            <SecaoEventos
                titulo="Eventos gravados"
                eventos={eventosGravados}
                onEventoClick={abrirModalDetalhes}
            />

            {mostrarModalAdicionar && (
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

                                    // Impede que a data do fim seja menor que a do início
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
                                <button type="button" onClick={fecharModalAdicionar}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {mostrarModalDetalhes && (
                <ModalDetalhesEvento evento={eventoSelecionado} onClose={fecharModalDetalhes} />
            )}
        </main>
    );
}

function App() {
    return (
        <div>
            <Eventos />
        </div>
    );
}

export default App;