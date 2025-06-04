import React, { useState, useEffect } from 'react';
import './Eventos.css'; // O CSS mesclado
import Evento1 from '../images/Evento1.png'; // Ajuste o caminho se necessário
import Evento2 from '../images/Evento2.png'; // Ajuste o caminho se necessário
import Evento3 from '../images/Evento3.png'; // Ajuste o caminho se necessário
import Evento4 from '../images/Evento4.png'; // Ajuste o caminho se necessário

const imagens = [Evento1, Evento2, Evento3, Evento4];

// ModalDetalhesEvento (Permanece o mesmo da versão anterior)
function ModalDetalhesEvento({ evento, onClose }) {
  return (
    <div className="modal-overlay-detalhe-evento">
      <div className="modal-detalhado">
        <div className="modal-header">
          <button className="botao-voltar-modal" onClick={onClose}>← Voltar</button>
        </div>
        <div className="cabecalho-modal">
          <div className="texto-cabecalho">
            <h2 className="titulo-evento"><strong>{evento.titulo}</strong></h2>
            <div className="descricao-evento">
              <h4>Descrição:</h4>
              <p>{evento.detalhe}</p>
            </div>
          </div>
          {evento.imagem && (
            <img src={evento.imagem} alt="Imagem do evento" className="imagem-evento-direita" />
          )}
        </div>
        <div className="topicos-evento">
          <h4>Tópicos:</h4>
          <ul>
            {[
              "Como estruturar uma estratégia ESG robusta na área financeira",
              "Métricas e indicadores: como mensurar e reportar impacto",
              "O papel do CFO na transformação sustentável",
              "Conformidade com regulações nacionais e internacionais",
              "Finanças verdes, crédito sustentável e acesso a funding internacional"
            ].map((t, idx) => <li key={idx}>• {t}</li>)}
          </ul>
        </div>
        <div className="rodape-evento">
          <p><strong>Data:</strong> {evento.dataInicio} {evento.dataFim && evento.dataFim !== evento.dataInicio ? `- ${evento.dataFim}` : ''}</p>
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

// SecaoEventos ATUALIZADO para mostrar 4 e depois +2
function SecaoEventos({ titulo, eventos, onEventoClick }) {
  const hoje = new Date().toISOString().split('T')[0];
  
  const INITIAL_ITEMS_COUNT = 4;
  const EXPANDED_ITEMS_COUNT = 6; // 4 iniciais + 2 extras

  const [visibleItemCount, setVisibleItemCount] = useState(INITIAL_ITEMS_COUNT);

  const eventosOrdenados = [...eventos]
    .filter(evento => evento.dataFim >= hoje)
    .sort((a, b) => new Date(a.dataInicio) - new Date(b.dataInicio));

  const handleViewMoreToggle = () => {
    if (visibleItemCount === INITIAL_ITEMS_COUNT) {
      // Se mostrando 4, expande para 6 (ou o total disponível se menor que 6)
      setVisibleItemCount(Math.min(EXPANDED_ITEMS_COUNT, eventosOrdenados.length));
    } else {
      // Se expandido (mostrando mais que 4), volta para 4
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
            key={evento.id || `evento-${titulo}-${i}`} // Chave mais específica
            data-imagem={i % 4}
            onClick={() => onEventoClick({ ...evento, imagem: imagens[i % 4] })}
          >
            <h4 className="evento-titulo">{evento.titulo}</h4>
            <p className="evento-data">{evento.dataInicio} - {evento.dataFim}</p>
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
                <path d={isExpanded ? "M7 14l5-5 5 5z" : "M7 10l5 5 5-5z"} /> {/* Seta para cima se expandido, para baixo se não */}
            </svg>
        </button>
      )}
    </section>
  );
}

// Componente Eventos principal (Permanece o mesmo da versão anterior)
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
    ev.titulo.toLowerCase().includes(filtroTitulo.toLowerCase())
  );

  const eventosProximos = eventosFiltrados.filter(ev => !ev.gravado);
  const eventosGravados = eventosFiltrados.filter(ev => ev.gravado);

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
    const { name, value, type, checked } = e.target;
    setForm(prevForm => ({
        ...prevForm,
        [name]: type === 'checkbox' ? checked : (type === 'radio' ? (value === 'true') : value)
    }));
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
    setForm({
        titulo: '', dataInicio: '', dataFim: '', detalhe: '',
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
              <h5>Data de início</h5>
              <input
                type="date" name="dataInicio" value={form.dataInicio}
                onChange={(e) => {
                    const novaDataInicio = e.target.value;
                    setForm(prev => ({ ...prev, dataInicio: novaDataInicio, ...(prev.dataFim && prev.dataFim < novaDataInicio && { dataFim: "" }) }));
                }}
                min={new Date().toISOString().split("T")[0]} required
              />
              <h5>Data de término</h5>
              <input
                type="date" name="dataFim" value={form.dataFim}
                onChange={handleChange}
                min={form.dataInicio || new Date().toISOString().split("T")[0]} required
              />
              <textarea
                name="detalhe" placeholder="Detalhes"
                value={form.detalhe} onChange={handleChange} required
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