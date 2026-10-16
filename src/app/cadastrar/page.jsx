
"use client";

import { useState } from "react";

export default function CadastrarNoticia() {
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function cadastrarNoticia(event) {
    event.preventDefault();

    setMensagem("");
    setErro(false);
    setCarregando(true);

    const formulario = event.currentTarget;
    const dados = new FormData(formulario);

    const noticia = {
      titulo: dados.get("titulo"),
      categoria: dados.get("categoria"),
      conteudo: dados.get("conteudo"),
      data: dados.get("data"),
      imagem: dados.get("imagem"),
    };

    try {
      const resposta = await fetch(
        "http://localhost:3001/noticias",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(noticia),
        }
      );

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          resultado.mensagem || "Não foi possível cadastrar."
        );
      }

      setMensagem(resultado.mensagem);
      formulario.reset();
    } catch (error) {
      setErro(true);
      setMensagem(
        error.message === "Failed to fetch"
          ? "Não foi possível conectar à API. Verifique se o servidor está ligado."
          : error.message
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="pagina-cadastro">
      <h1>Cadastrar notícia</h1>

      <p>
        Preencha os campos abaixo para registrar
        uma notícia acadêmica.
      </p>

      <form onSubmit={cadastrarNoticia}>
        
        <label htmlFor="imagem">Endereço da imagem</label>
            <input
                type="url"
                id="imagem"
                name="imagem"
                placeholder="https://exemplo.com/imagem.jpg"
            />
            <small>
                Cole o endereço de uma imagem relacionada à notícia.
            </small>


        <label htmlFor="titulo">Título</label>
        <input
          type="text"
          id="titulo"
          name="titulo"
          placeholder="Digite o título da notícia"
          required
        />

        <label htmlFor="categoria">Categoria</label>
        <select
          id="categoria"
          name="categoria"
          defaultValue=""
          required
        >
          <option value="" disabled>
            Selecione uma categoria
          </option>
          <option value="Pesquisa">Pesquisa</option>
          <option value="Eventos">Eventos</option>
          <option value="Inovação">Inovação</option>
          <option value="Ensino">Ensino</option>
        </select>

        <label htmlFor="conteudo">Conteúdo</label>
        <textarea
          id="conteudo"
          name="conteudo"
          rows="6"
          placeholder="Escreva o conteúdo da notícia"
          required
        />

        <label htmlFor="data">Data</label>
        <input
          type="date"
          id="data"
          name="data"
          required
        />

        <button type="submit" disabled={carregando}>
          {carregando ? "Cadastrando..." : "Cadastrar notícia"}
        </button>

        {mensagem && (
          <p role="status" style={{ color: erro ? "red" : "green" }}>
            {mensagem}
          </p>
        )}

        
      </form>
            
        <a href="/" className="botao-voltar">
        Voltar à página inicial
        </a>
    </main>
  );
}
