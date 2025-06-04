import React, { useState, useEffect } from 'react';
import './Eventos.css';
import Evento1 from '../images/Evento1.png';
import Evento2 from '../images/Evento2.png';
import Evento3 from '../images/Evento3.png';
import Evento4 from '../images/Evento4.png';

const imagens = [Evento1, Evento2, Evento3, Evento4];

// funcao para formatar data e hora
const formatDateTime = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

// ModalDetalhesEvento
function ModalDetalhesEvento({ evento, onClose }) {
  const getTopicosList = (topicosString) => {
    if (!topicosString) return [];
    return topicosString.split('\n').map(topic => topic.trim()).filter(topic => topic.length > 0);
  };

  const topicosDoEvento = getTopicosList(evento.topicos);

  const [tempoRestante, setTempoRestante] = useState('');
  const [statusClasse, setStatusClasse] = useState(''); 

  useEffect(() => {
    const calculateTimeRemaining = () => {
      if (!evento.dataInicio || !evento.dataFim) return '';
      const now = new Date();
      const eventStartDateTime = new Date(evento.dataInicio);
      const eventEndDateTime = new Date(evento.dataFim);

      if (now > eventEndDateTime) {
        setStatusClasse('status-concluido'); 
        return 'Evento já ocorreu';
      }

      if (now >= eventStartDateTime && now <= eventEndDateTime) {
        setStatusClasse('status-em-andamento');
        return 'EM ANDAMENTO';
      }

      const diffMs = eventStartDateTime - now;

      const diffSeconds = Math.floor(diffMs / 1000);
      const diffMinutes = Math.floor(diffSeconds / 60);
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);

      const remainingHours = diffHours % 24;
      const remainingMinutes = diffMinutes % 60;
      const remainingSeconds = diffSeconds % 60;

      let timeString = '';
      if (diffDays > 0) {
        timeString += `${diffDays} dia${diffDays > 1 ? 's' : ''} `;
      }
      if (remainingHours > 0) {
        timeString += `${remainingHours} hora${remainingHours > 1 ? 's' : ''} `;
      }
      if (remainingMinutes > 0) {
        timeString += `${remainingMinutes} minuto${remainingMinutes > 1 ? 's' : ''}`;
      }
      if (diffDays === 0 && remainingHours === 0 && remainingMinutes === 0 && remainingSeconds > 0) {
        timeString = `menos de 1 minuto`;
      }

      setStatusClasse('status-futuro');
      return `Faltam: ${timeString.trim()}`;
    };

    setTempoRestante(calculateTimeRemaining());

    const interval = setInterval(() => {
      setTempoRestante(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, [evento.dataInicio, evento.dataFim]);

  return (
    <div className="modal-overlay-detalhe-evento">
      <div className="modal-detalhado">
        <div className="modal-header">
          <button className="botao-voltar-modal" onClick={onClose}>← Voltar</button>
        </div>
        <div className="cabecalho-modal">
          <div className="texto-cabecalho">
            <h2 className="titulo-evento"><strong>{evento.titulo}</strong></h2>
            {evento.dataInicio && (
              <p className={`tempo-restante-evento ${statusClasse}`}>{tempoRestante}</p>
            )}
            <div className="descricao-evento">
              <h4>Descrição:</h4>
              <p>{evento.detalhe}</p>
            </div>
          </div>
          {evento.imagem && (
            <img src={evento.imagem} alt="Imagem do evento" className="imagem-evento-direita" />
          )}
        </div>
        {topicosDoEvento.length > 0 && (
          <div className="topicos-evento">
            <h4>Tópicos:</h4>
            <ul>
              {topicosDoEvento.map((t, idx) => <li key={idx}>• {t}</li>)}
            </ul>
          </div>
        )}
        <div className="rodape-evento">
          <p>
            <strong>Data e Hora:</strong> {formatDateTime(evento.dataInicio)}
            {evento.dataFim && evento.dataFim !== evento.dataInicio ? ` - ${formatDateTime(evento.dataFim)}` : ''}
          </p>
          {evento.link && (
            <p className="link-evento">
              <strong>https://</strong>
              <a href={evento.link} target="_blank" rel="noreferrer">{evento.link.replace(/^https?:\/\//, '')}</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// SecaoEventos
function SecaoEventos({ titulo, eventos, onEventoClick }) {
  const hoje = new Date(); 

  const INITIAL_ITEMS_COUNT = 4;
  const EXPANDED_ITEMS_COUNT = 6;

  const [visibleItemCount, setVisibleItemCount] = useState(INITIAL_ITEMS_COUNT);

  const eventosOrdenados = [...eventos]
    .filter(evento => new Date(evento.dataFim) >= hoje) 
    .sort((a, b) => new Date(a.dataInicio) - new Date(b.dataInicio));

  const handleViewMoreToggle = () => {
    if (visibleItemCount === INITIAL_ITEMS_COUNT) {
      setVisibleItemCount(Math.min(EXPANDED_ITEMS_COUNT, eventosOrdenados.length));
    } else {
      setVisibleItemCount(INITIAL_ITEMS_COUNT);
    }
  };

  const eventosVisiveis = eventosOrdenados.slice(0, visibleItemCount);

  const canShowMoreButton = eventosOrdenados.length > INITIAL_ITEMS_COUNT;
  const isExpanded = visibleItemCount > INITIAL_ITEMS_COUNT;

  return (
    <section className="events">
      <h2>{titulo}</h2>
      <div className="grid-container">
        {eventosVisiveis.map((evento, i) => (
          <div
            className="item"
            key={evento.id || `evento-${titulo}-${i}`}
            data-imagem={i % 4}
            onClick={() => onEventoClick({ ...evento, imagem: imagens[i % 4] })}
          >
          </div>
        ))}
        {eventosVisiveis.length === 0 && <p>Nenhum evento encontrado para esta categoria.</p>}
      </div>

      {canShowMoreButton && (
        <button
          className="view-more"
          onClick={handleViewMoreToggle}
          aria-expanded={isExpanded}
        >
          {isExpanded ? 'Ver menos' : 'Ver mais'}
          <svg viewBox="0 0 24 24">
            <path d={isExpanded ? "M7 14l5-5 5 5z" : "M7 10l5 5 5-5z"} />
          </svg>
        </button>
      )}
    </section>
  );
}

// Eventos
function Eventos() {
  const [mostrarModalAdicionar, setMostrarModalAdicionar] = useState(false);
  const [mostrarModalDetalhes, setMostrarModalDetalhes] = useState(false);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [todosEventos, setTodosEventos] = useState([]);
  const [filtroTitulo, setFiltroTitulo] = useState('');

  const buscarEventos = async () => {
    try {
      const resposta = await fetch('http://localhost:8080/api/eventos');
      if (!resposta.ok) throw new Error(`HTTP error! status: ${resposta.status}`);
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

  const eventosFiltrados = todosEventos.filter(ev =>
    (ev.titulo || '').toLowerCase().includes(filtroTitulo.toLowerCase())
  );

  const eventosProximos = eventosFiltrados.filter(ev => !ev.gravado);
  const eventosGravados = eventosFiltrados.filter(ev => ev.gravado);

  const [form, setForm] = useState({
    titulo: '',
    dataInicio: '', 
    dataFim: '',    
    detalhe: '',
    topicos: '',
    link: '',
    gravado: false,
    emailUsuario: localStorage.getItem('email') || ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: type === 'checkbox' ? checked : (type === 'radio' ? (value === 'true') : value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const agora = new Date();
    const dataInicioDateTime = new Date(form.dataInicio);
    const dataFimDateTime = new Date(form.dataFim);

    if (dataInicioDateTime < agora) {
      alert("A data e hora de início devem ser iguais ou posteriores a agora.");
      return;
    }
    if (dataFimDateTime < dataInicioDateTime) {
      alert("A data e hora de término não podem ser anteriores à data e hora de início.");
      return;
    }

    let emailUsuario = "sem-email";
    try {
      const userString = localStorage.getItem("user");
      if (userString) {
        const user = JSON.parse(userString);
        emailUsuario = user?.email || "sem-email";
      }
    } catch (error) {
      console.error("Erro ao parsear usuário do localStorage:", error);
    }

    const eventoComEmail = { ...form, emailUsuario };

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
        const erroData = await resposta.text();
        console.error("Erro ao salvar evento - Resposta não OK:", erroData);
        alert(`Erro ao salvar evento: ${erroData || resposta.statusText}`);
      }
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      alert(`Erro ao salvar evento: ${error.message}`);
    }
  };

  const abrirModalDetalhes = (eventoComImagem) => {
    setEventoSelecionado(eventoComImagem);
    setMostrarModalDetalhes(true);
  };

  const fecharModalDetalhes = () => {
    setMostrarModalDetalhes(false);
    setEventoSelecionado(null);
  };

  const abrirModalAdicionar = () => {
    let email = '';
    try {
      const userString = localStorage.getItem("user");
      if (userString) {
        const user = JSON.parse(userString);
        email = user?.email || '';
      }
    } catch (error) {
      console.error("Erro ao parsear usuário do localStorage para novo evento:", error);
    }

    const now = new Date();
    const nowIso = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);

    setForm({
      titulo: '', dataInicio: nowIso, dataFim: nowIso, detalhe: '', 
      topicos: '',
      link: '', gravado: false, emailUsuario: email
    });
    setMostrarModalAdicionar(true);
  };

  const fecharModalAdicionar = () => {
    setMostrarModalAdicionar(false);
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
            padding: '6px 10px', fontSize: '16px',
            borderRadius: '4px', border: '1px solid #ccc', width: '250px',
          }}
        />
      </div>

      <SecaoEventos
        titulo="Eventos Próximos"
        eventos={eventosProximos}
        onEventoClick={abrirModalDetalhes}
      />
      <SecaoEventos
        titulo="Eventos Gravados"
        eventos={eventosGravados}
        onEventoClick={abrirModalDetalhes}
      />

      {mostrarModalAdicionar && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Novo Evento</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text" name="titulo" placeholder="Título"
                value={form.titulo} onChange={handleChange} required
              />
              <h5>Data e Hora de início</h5>
              <input
                type="datetime-local" name="dataInicio" value={form.dataInicio}
                onChange={(e) => {
                  const novaDataInicio = e.target.value;
                  setForm(prev => ({ ...prev, dataInicio: novaDataInicio, ...(prev.dataFim && prev.dataFim < novaDataInicio && { dataFim: "" }) }));
                }}
                min={new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16)} // Define min como a hora atual
                required
              />
              <h5>Data e Hora de término</h5>
              <input
                type="datetime-local" name="dataFim" value={form.dataFim}
                onChange={handleChange}
                min={form.dataInicio || new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16)} // Define min como a data de início ou a hora atual
                required
              />
              <textarea
                name="detalhe" placeholder="Detalhes"
                value={form.detalhe} onChange={handleChange} required
              />
              <textarea
                name="topicos"
                placeholder="Tópicos (um por linha)"
                value={form.topicos}
                onChange={handleChange}
                rows="4"
              />
              <input
                type="text" name="link" placeholder="Link do evento (opcional)"
                value={form.link} onChange={handleChange}
              />
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>
                  Evento será gravado?
                </label>
                <div style={{ display: "flex", gap: "24px", alignItems: "center", marginBottom: "16px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <input
                      type="radio" name="gravado" value="true"
                      checked={form.gravado === true}
                      onChange={() => setForm({ ...form, gravado: true })}
                    /> Sim
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <input
                      type="radio" name="gravado" value="false"
                      checked={form.gravado === false}
                      onChange={() => setForm({ ...form, gravado: false })}
                    /> Não
                  </label>
                </div>
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-btn">Salvar</button>
                <button type="button" onClick={fecharModalAdicionar} className="cancel-btn">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {mostrarModalDetalhes && eventoSelecionado && (
        <ModalDetalhesEvento evento={eventoSelecionado} onClose={fecharModalDetalhes} />
      )}
    </main>
  );
}

export default Eventos;