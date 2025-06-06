import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCommunity } from '../services/forumService';
import './NovoForum.css'; 

const NovoForum = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Pega os dados do usuário do localStorage
    const storedUser = localStorage.getItem('user'); // ou 'currentUser' se você padronizou

    if (!storedUser) {
      alert('Você precisa estar logado para criar um fórum.');
      navigate('/login'); 
      return;
    }

    const user = JSON.parse(storedUser);
    
    // 2. Verifica se o ID do usuário existe
    if (!user || !user.id) {
        alert('ID do usuário não encontrado. Faça o login novamente.');
        navigate('/login');
        return;
    }
    const authorId = user.id;

    // 3. Prepara os dados do corpo da requisição (apenas title e description)
    const communityData = {
      title: title,
      description: description
    };

    try {
      // 4. Chama a função do serviço passando o ID e os dados separadamente
      await createCommunity(authorId, communityData);
      alert('Fórum criado com sucesso!');
      navigate('/foruns');
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