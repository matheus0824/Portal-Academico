"use client";

import { useEffect, useState } from "react";

export default function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

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
      } catch (erro) {
        setErro(
          "Não foi possível carregar as notícias. Verifique se a API está funcionando."
        );
      } finally {
        setCarregando(false);
      }
    }

    buscarNoticias();
  }, []);

  return (
    <main className="pagina-noticias">
      <h1>Notícias acadêmicas</h1>

      <p>
        Confira as notícias cadastradas no Portal Acadêmico.
      </p>

      {carregando && <p>Carregando notícias...</p>}

      {erro && <p>{erro}</p>}

      {!carregando && !erro && noticias.length === 0 && (
        <p>Nenhuma notícia cadastrada ainda.</p>
      )}

      <section className="lista-noticias">
        {noticias.map((noticia) => (
          <article
            className="card-noticia"
            key={noticia.id}
          >
            
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
              {noticia.data.split("-").reverse().join("/")}
            </small>
          </article>
        ))}
      </section>
    </main>
  );
}