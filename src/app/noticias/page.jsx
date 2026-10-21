
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Noticias() {
  const searchParams = useSearchParams();
  const categoriaSelecionada = searchParams.get("categoria");

  const [noticias, setNoticias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [excluindoId, setExcluindoId] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);

  const [formEdicao, setFormEdicao] = useState({
    titulo: "",
    categoria: "",
    conteudo: "",
    data: "",
    imagem: "",
  });

  useEffect(() => {
    async function buscarNoticias() {
      setCarregando(true);
      setErro("");

      try {
        const resposta = await fetch("http://localhost:3001/noticias");

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

  const noticiasFiltradas = categoriaSelecionada
    ? noticias.filter(
        (noticia) =>
          noticia.categoria?.toLowerCase() ===
          categoriaSelecionada.toLowerCase()
      )
    : noticias;

  const tituloPagina = categoriaSelecionada
    ? `Notícias de ${categoriaSelecionada}`
    : "Todas as notícias";

  const descricaoPagina = categoriaSelecionada
    ? `Confira as notícias acadêmicas da categoria ${categoriaSelecionada}.`
    : "Confira todas as notícias cadastradas no Portal Acadêmico.";

  function formatarData(data) {
    if (!data) return "";

    if (data.includes("-")) {
      return data.split("-").reverse().join("/");
    }

    return data;
  }

  function iniciarEdicao(noticia) {
    setEditandoId(noticia.id);
    setMensagem("");
    setErro("");

    setFormEdicao({
      titulo: noticia.titulo || "",
      categoria: noticia.categoria || "",
      conteudo: noticia.conteudo || "",
      data: noticia.data || "",
      imagem: noticia.imagem || "",
    });
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setSalvandoEdicao(false);
    setFormEdicao({
      titulo: "",
      categoria: "",
      conteudo: "",
      data: "",
      imagem: "",
    });
  }

  function alterarCampo(event) {
    const { name, value } = event.target;

    setFormEdicao((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  async function salvarEdicao(event) {
    event.preventDefault();

    if (salvandoEdicao || editandoId === null) return;

    setMensagem("");
    setErro("");
    setSalvandoEdicao(true);

    try {
      const resposta = await fetch(
        `http://localhost:3001/noticias/${editandoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formEdicao),
        }
      );

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          resultado.mensagem || "Não foi possível editar a notícia."
        );
      }

      setNoticias((anteriores) =>
        anteriores.map((noticia) =>
          noticia.id === editandoId ? resultado.noticia : noticia
        )
      );

      setMensagem("Notícia atualizada com sucesso!");
      cancelarEdicao();
    } catch (error) {
      setErro(
        error.message === "Failed to fetch"
          ? "Não foi possível conectar à API. Verifique se o servidor está ligado."
          : error.message
      );
    } finally {
      setSalvandoEdicao(false);
    }
  }

  async function excluirNoticia(id) {
    const confirmar = window.confirm(
      "Tem certeza de que deseja excluir esta notícia?"
    );

    if (!confirmar) return;

    setMensagem("");
    setErro("");
    setExcluindoId(id);

    try {
      const resposta = await fetch(
        `http://localhost:3001/noticias/${id}`,
        { method: "DELETE" }
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

      if (editandoId === id) {
        cancelarEdicao();
      }

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
      <header className="cabecalho-interno">
        <p className="marca-interna">PORTAL ACADÊMICO</p>

        <h1>{tituloPagina}</h1>

        <p>{descricaoPagina}</p>

        <nav className="navegacao-interna" aria-label="Navegação da página">
          <Link href="/">← Página inicial</Link>
          <Link href="/noticias">Todas as notícias</Link>
          <Link href="/cadastrar">Cadastrar notícia</Link>
        </nav>
      </header>

      <div className="conteudo-noticias">
        {mensagem && (
          <p role="status" className="mensagem-sucesso">
            {mensagem}
          </p>
        )}

        {erro && (
          <p role="alert" className="mensagem-erro">
            {erro}
          </p>
        )}

        {carregando && <p>Carregando notícias...</p>}

        {!carregando && !erro && noticiasFiltradas.length === 0 && (
          <p>
            {categoriaSelecionada
              ? `Nenhuma notícia encontrada na categoria ${categoriaSelecionada}.`
              : "Nenhuma notícia cadastrada ainda."}
          </p>
        )}

        {!carregando && !erro && noticiasFiltradas.length > 0 && (
          <p className="total-noticias">
            {noticiasFiltradas.length}{" "}
            {noticiasFiltradas.length === 1
              ? "notícia encontrada"
              : "notícias encontradas"}
          </p>
        )}

        <section className="lista-noticias">
          {noticiasFiltradas.map((noticia) => (
            <article className="card-noticia" key={noticia.id}>
              {noticia.imagem && (
                <img
                  className="imagem-noticia"
                  src={noticia.imagem}
                  alt={`Imagem da notícia: ${noticia.titulo}`}
                />
              )}

              <span className="categoria">{noticia.categoria}</span>

              <h2>{noticia.titulo}</h2>

              <p>{noticia.conteudo}</p>

              <small>Publicado em: {formatarData(noticia.data)}</small>

              {editandoId === noticia.id ? (
                <form
                  className="form-edicao-noticia"
                  onSubmit={salvarEdicao}
                >
                  <h3>Editar notícia</h3>

                  <label htmlFor={`titulo-${noticia.id}`}>Título</label>
                  <input
                    id={`titulo-${noticia.id}`}
                    name="titulo"
                    type="text"
                    value={formEdicao.titulo}
                    onChange={alterarCampo}
                    required
                  />

                  <label htmlFor={`categoria-${noticia.id}`}>Categoria</label>
                  <select
                    id={`categoria-${noticia.id}`}
                    name="categoria"
                    value={formEdicao.categoria}
                    onChange={alterarCampo}
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="Pesquisa">Pesquisa</option>
                    <option value="Eventos">Eventos</option>
                    <option value="Inovação">Inovação</option>
                    <option value="Ensino">Ensino</option>
                  </select>

                  <label htmlFor={`conteudo-${noticia.id}`}>Conteúdo</label>
                  <textarea
                    id={`conteudo-${noticia.id}`}
                    name="conteudo"
                    rows={6}
                    value={formEdicao.conteudo}
                    onChange={alterarCampo}
                    required
                  />

                  <label htmlFor={`data-${noticia.id}`}>Data</label>
                  <input
                    id={`data-${noticia.id}`}
                    name="data"
                    type="date"
                    value={formEdicao.data}
                    onChange={alterarCampo}
                    required
                  />

                  <label htmlFor={`imagem-${noticia.id}`}>
                    Endereço da imagem (opcional)
                  </label>
                  <input
                    id={`imagem-${noticia.id}`}
                    name="imagem"
                    type="url"
                    value={formEdicao.imagem}
                    onChange={alterarCampo}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />

                  <div className="botoes-edicao">
                    <button type="submit" disabled={salvandoEdicao}>
                      {salvandoEdicao ? "Salvando..." : "Salvar alterações"}
                    </button>

                    <button
                      type="button"
                      onClick={cancelarEdicao}
                      disabled={salvandoEdicao}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <div className="botoes-noticia">
                  <button
                    type="button"
                    className="botao-editar"
                    onClick={() => iniciarEdicao(noticia)}
                  >
                    Editar notícia
                  </button>

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
                </div>
              )}
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
