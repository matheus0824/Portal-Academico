export default function CardNoticia({
  titulo,
  categoria,
  data,
  resumo,
  imagem,
}) {
  return (
    <article className="card-noticia">
      <img
        className="imagem-noticia"
        src={imagem}
        alt={titulo}
      />

      <span className="categoria">
        {categoria}
      </span>

      <h3>{titulo}</h3>

      <p>{resumo}</p>

      <small>Publicado em: {data}</small>
    </article>
  );
}
