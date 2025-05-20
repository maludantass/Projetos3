import React from 'react';
import './Biblioteca.css';

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

function Biblioteca() {
    return (
        <div>
            <SecaoArtigos />
        </div>
    );
}
export default Biblioteca;