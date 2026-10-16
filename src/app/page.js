
"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [noticias, setNoticias] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarNoticias() {
      try {
        const resposta = await fetch(
          "http://localhost:3001/noticias"
        );

        if (!resposta.ok) {
          throw new Error("Erro ao buscar notícias");
        }

        const dados = await resposta.json();
        setNoticias(dados);
      } catch (erro) {
        console.error("Erro ao carregar notícias:", erro);
      } finally {
        setCarregando(false);
      }
    }

    buscarNoticias();
  }, []);

  const ordenarPorData = (lista) =>
    [...lista].sort((a, b) =>
      b.data.localeCompare(a.data)
    );

  const recentes = ordenarPorData(noticias);
  const destaque = recentes[0];
  const outrasNoticias = recentes.slice(1, 5);

  const categorias = [
    "Pesquisa",
    "Eventos",
    "Inovação",
    "Ensino",
  ];

  function formatarData(data) {
    if (!data) return "";

    if (data.includes("-")) {
      return data.split("-").reverse().join("/");
    }

    return data;
  }

  return (
    <main className="pagina-inicial">
      <header className="cabecalho-jornal">
        <p className="marca-superior">
          INFORMAÇÃO, PESQUISA E CONHECIMENTO
        </p>

        <h1>Portal Acadêmico</h1>

        <p>
          As novidades que movimentam o mundo universitário.
        </p>
      </header>

      <nav className="menu-jornal">
        <a href="/">Início</a>
        <a href="/noticias">Todas as notícias</a>
        {categorias.map((categoria) => (
          <a
            href={`/noticias?categoria=${encodeURIComponent(categoria)}`}
            key={categoria}
          >
            {categoria}
          </a>
        ))}
        <a href="/cadastrar">Cadastrar notícia</a>
      </nav>

      <div className="conteudo-jornal">
        <div className="titulo-secao">
          <h2>Em destaque</h2>
          <span>PORTAL ACADÊMICO</span>
        </div>

        {carregando && (
          <p>Carregando as principais notícias...</p>
        )}

        {!carregando && !destaque && (
          <p>
            Nenhuma notícia disponível no momento.
          </p>
        )}

        {destaque && (
          <section className="area-destaques">
            <article className="noticia-principal">
              {destaque.imagem && (
                <img
                  src={destaque.imagem}
                  alt={destaque.titulo}
                />
              )}

              <div className="texto-destaque">
                <span className="editoria">
                  {destaque.categoria}
                </span>

                <h2>{destaque.titulo}</h2>

                <p>{destaque.conteudo}</p>

                <small>
                  Publicado em: {formatarData(destaque.data)}
                </small>
              </div>
            </article>

            <div className="manchetes-secundarias">
              {outrasNoticias.map((noticia) => (
                <article
                  className="manchete"
                  key={noticia.id}
                >
                  {noticia.imagem && (
                    <img
                      src={noticia.imagem}
                      alt={noticia.titulo}
                    />
                  )}

                  <div>
                    <span className="editoria">
                      {noticia.categoria}
                    </span>

                    <h3>{noticia.titulo}</h3>

                    <small>
                      {formatarData(noticia.data)}
                    </small>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <div className="titulo-secao">
          <h2>Últimas notícias</h2>
          <a href="/noticias">Ver todas →</a>
        </div>

        <section className="grade-jornal">
          {recentes.slice(0, 8).map((noticia) => (
            <article className="noticia-resumo" key={noticia.id}>
              {noticia.imagem && (
                <img
                  src={noticia.imagem}
                  alt={noticia.titulo}
                  loading="lazy"
                />
              )}

              <span className="editoria">
                {noticia.categoria}
              </span>

              <h3>{noticia.titulo}</h3>

              <p>{noticia.conteudo}</p>

              <small>
                {formatarData(noticia.data)}
              </small>
            </article>
          ))}
        </section>

        {categorias.map((categoria) => {
          const lista = recentes
            .filter((noticia) => noticia.categoria === categoria)
            .slice(0, 3);

          if (lista.length === 0) return null;

          return (
            <section
              className="secao-editoria"
              key={categoria}
            >
              <div className="titulo-secao">
                <h2>{categoria}</h2>
                <a
                  href={`/noticias?categoria=${encodeURIComponent(categoria)}`}
                >
                  Mais notícias →
                </a>
              </div>

              <div className="grade-jornal">
                {lista.map((noticia) => (
                  <article
                    className="noticia-resumo"
                    key={noticia.id}
                  >
                    {noticia.imagem && (
                      <img
                        src={noticia.imagem}
                        alt={noticia.titulo}
                        loading="lazy"
                      />
                    )}

                    <h3>{noticia.titulo}</h3>

                    <p>{noticia.conteudo}</p>

                    <small>
                      {formatarData(noticia.data)}
                    </small>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <footer className="rodape-jornal">
        <h2>Portal Acadêmico</h2>
        <p>Informação, pesquisa e conhecimento.</p>
        <a href="/noticias">Todas as notícias</a>
        {" · "}
        <a href="/cadastrar">Cadastrar notícia</a>
      </footer>
    </main>
  );
}
