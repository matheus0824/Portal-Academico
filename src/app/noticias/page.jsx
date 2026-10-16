
"use client";

import { useEffect, useState } from "react";

export default function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [excluindoId, setExcluindoId] = useState(null);

  useEffect(() => {
    async function buscarNoticias() {
      try {
        const resposta = await fetch(
          "http://localhost:3001/noticias"
        );

        if (!resposta.ok) {
          throw new Error("Não foi possível buscar as notícias.");
        }

        const dados = await resposta.json();
        setNoticias(dados);
      } catch {
        setErro(
          "Não foi possível carregar as notícias. Verifique se a API está funcionando."
        );
      } finally {
        setCarregando(false);
      }
    }

    buscarNoticias();
  }, []);

  async function excluirNoticia(id) {
    const confirmar = window.confirm(
      "Tem certeza de que deseja excluir esta notícia?"
    );

    if (!confirmar) {
      return;
    }

    setMensagem("");
    setErro("");
    setExcluindoId(id);

    try {
      const resposta = await fetch(
        `http://localhost:3001/noticias/${id}`,
        {
          method: "DELETE",
        }
      );

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          resultado.mensagem || "Não foi possível excluir a notícia."
        );
      }

      setNoticias((anteriores) =>
        anteriores.filter((noticia) => noticia.id !== id)
      );

      setMensagem("Notícia excluída com sucesso!");
    } catch (error) {
      setErro(
        error.message === "Failed to fetch"
          ? "Não foi possível conectar à API. Verifique se o servidor está ligado."
          : error.message
      );
    } finally {
      setExcluindoId(null);
    }
  }

  return (
    <main className="pagina-noticias">
      <h1>Notícias acadêmicas</h1>

      <p>
        Confira as notícias cadastradas no Portal Acadêmico.
      </p>

      {mensagem && (
        <p role="status" className="mensagem-sucesso">
          {mensagem}
        </p>
      )}

      {carregando && <p>Carregando notícias...</p>}

      {erro && (
        <p role="alert" className="mensagem-erro">
          {erro}
        </p>
      )}

      {!carregando && !erro && noticias.length === 0 && (
        <p>Nenhuma notícia cadastrada ainda.</p>
      )}

      <section className="lista-noticias">
        {noticias.map((noticia) => (
          <article className="card-noticia" key={noticia.id}>
            {noticia.imagem && (
              <img
                className="imagem-noticia"
                src={noticia.imagem}
                alt={`Imagem da notícia: ${noticia.titulo}`}
              />
            )}

            <span className="categoria">
              {noticia.categoria}
            </span>

            <h2>{noticia.titulo}</h2>

            <p>{noticia.conteudo}</p>

            <small>
              Publicado em:{" "}
              {noticia.data.includes("-")
                ? noticia.data.split("-").reverse().join("/")
                : noticia.data}
            </small>

            <button
              type="button"
              className="botao-excluir"
              onClick={() => excluirNoticia(noticia.id)}
              disabled={excluindoId === noticia.id}
            >
              {excluindoId === noticia.id
                ? "Excluindo..."
                : "Excluir notícia"}
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}
