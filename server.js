
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const arquivoNoticias = path.join(__dirname, "noticias.json");

// Carrega as notícias salvas no arquivo JSON.
function carregarNoticias() {
  try {
    const conteudo = fs.readFileSync(arquivoNoticias, "utf8");
    return JSON.parse(conteudo);
  } catch (erro) {
    console.error("Erro ao carregar noticias.json:", erro.message);
    return [];
  }
}

let noticias = carregarNoticias();

let proximoId =
  noticias.reduce((maiorId, noticia) => {
    return Math.max(maiorId, noticia.id);
  }, 0) + 1;

// Salva a lista atualizada no arquivo JSON.
function salvarNoticias() {
  fs.writeFileSync(
    arquivoNoticias,
    JSON.stringify(noticias, null, 2),
    "utf8"
  );
}

// Listar notícias
app.get("/noticias", (req, res) => {
  res.json(noticias);
});

// Cadastrar notícia
app.post("/noticias", (req, res) => {
  const { titulo, categoria, conteudo, data, imagem } = req.body;

  if (!titulo || !categoria || !conteudo || !data) {
    return res.status(400).json({
      mensagem: "Preencha todos os campos obrigatórios.",
    });
  }

  const noticia = {
    id: proximoId++,
    titulo,
    categoria,
    conteudo,
    data,
    imagem: imagem || "",
  };

  noticias.push(noticia);

  try {
    salvarNoticias();

    res.status(201).json({
      mensagem: "Notícia cadastrada com sucesso!",
      noticia,
    });
  } catch (erro) {
    noticias.pop();
    proximoId--;

    res.status(500).json({
      mensagem: "Erro ao salvar a notícia no arquivo JSON.",
    });
  }
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

  try {
    salvarNoticias();

    res.json({
      mensagem: "Notícia excluída com sucesso!",
      noticia: noticiaExcluida,
    });
  } catch (erro) {
    noticias.splice(indice, 0, noticiaExcluida);

    res.status(500).json({
      mensagem: "Erro ao salvar a exclusão no arquivo JSON.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
  console.log(`${noticias.length} notícias carregadas do arquivo JSON.`);
});
