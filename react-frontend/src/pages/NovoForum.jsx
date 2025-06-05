import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCommunity } from '../services/forumService';
import './NovoForum.css'; // estilo opcional

const NovoForum = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCommunity({ title, description }); // chama a API
      navigate('/foruns'); // volta para a lista de fóruns
    } catch (err) {
      alert('Erro ao criar fórum. Tente novamente.');
      console.error(err);
    }
  };

  return (
    <div className="novo-forum-container">
      <h1>Criar Novo Fórum</h1>
      <form onSubmit={handleSubmit} className="novo-forum-form">
        <label htmlFor="title">Título do Fórum:</label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label htmlFor="description">Descrição:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />

        <button type="submit" className="btn-criar">Criar Fórum</button>
      </form>
    </div>
  );
};

export default NovoForum;
