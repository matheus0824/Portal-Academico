import Link from 'next/link';

export default function CardNoticia({
  id,
  titulo,
  categoria,
  data,
  resumo,
  imagem,
}) {
  return (
    <Link href={`/noticias/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
    </Link>
  );
}