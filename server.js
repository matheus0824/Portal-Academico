
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let noticias = [];
let proximoId = 1;

app.get("/noticias", (req, res) => {
  res.json(noticias);
});

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

  res.status(201).json({
    mensagem: "Notícia cadastrada com sucesso!",
    noticia,
  });
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
