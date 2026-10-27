
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Carrega as notícias iniciais para a memória da API.
// O arquivo JSON não será alterado pelas operações do site.
let noticias = require("./noticias.json").map((noticia) => ({
  ...noticia,
}));

let proximoId =
  noticias.reduce((maiorId, noticia) => {
    return Math.max(maiorId, noticia.id);
  }, 0) + 1;

// Listar notícias
app.get("/noticias", (req, res) => {
  res.json(noticias);
});

// Cadastrar notícia
app.post("/noticias", (req, res) => {
  const { titulo, categoria, conteudo, data, imagem } = req.body;

  if (
    !titulo?.trim() ||
    !categoria?.trim() ||
    !conteudo?.trim() ||
    !data
  ) {
    return res.status(400).json({
      mensagem: "Preencha todos os campos obrigatórios.",
    });
  }

  const noticia = {
    id: proximoId++,
    titulo: titulo.trim(),
    categoria: categoria.trim(),
    conteudo: conteudo.trim(),
    data,
    imagem: imagem?.trim() || "",
  };

  noticias.push(noticia);

  return res.status(201).json({
    mensagem: "Notícia cadastrada com sucesso!",
    noticia,
  });
});

// Editar notícia
app.put("/noticias/:id", (req, res) => {
  const id = Number(req.params.id);
  const { titulo, categoria, conteudo, data, imagem } = req.body;

  if (
    !titulo?.trim() ||
    !categoria?.trim() ||
    !conteudo?.trim() ||
    !data
  ) {
    return res.status(400).json({
      mensagem: "Preencha todos os campos obrigatórios.",
    });
  }

  const indice = noticias.findIndex(
    (noticia) => noticia.id === id
  );

  if (indice === -1) {
    return res.status(404).json({
      mensagem: "Notícia não encontrada.",
    });
  }

  const noticiaAtualizada = {
    ...noticias[indice],
    titulo: titulo.trim(),
    categoria: categoria.trim(),
    conteudo: conteudo.trim(),
    data,
    imagem: imagem?.trim() || "",
  };

  noticias[indice] = noticiaAtualizada;

  return res.json({
    mensagem: "Notícia atualizada com sucesso!",
    noticia: noticiaAtualizada,
  });
});

// Excluir notícia
app.delete("/noticias/:id", (req, res) => {
  const id = Number(req.params.id);

  const indice = noticias.findIndex(
    (noticia) => noticia.id === id
  );

  if (indice === -1) {
    return res.status(404).json({
      mensagem: "Notícia não encontrada.",
    });
  }

  const [noticiaExcluida] = noticias.splice(indice, 1);

  return res.json({
    mensagem: "Notícia excluída com sucesso!",
    noticia: noticiaExcluida,
  });
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
  console.log(`${noticias.length} notícias carregadas na memória.`);
});
