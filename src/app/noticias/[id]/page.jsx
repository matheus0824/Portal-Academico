'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function DetalheNoticia() {
  const params = useParams();
  const { id } = params;
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3001/noticias/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setNoticia(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Erro ao buscar notícia:', err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <p style={{ padding: '40px', textAlign: 'center' }}>A carregar...</p>;
  if (!noticia) return <p style={{ padding: '40px', textAlign: 'center' }}>Notícia não encontrada.</p>;

  return (
    <main style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <Link href="/" style={{ color: '#0070f3', textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}>
        &larr; Voltar para a página inicial
      </Link>
      
      <span style={{ display: 'block', margin: '15px 0 10px 0', fontWeight: 'bold', color: '#c92a2a', textTransform: 'uppercase', fontSize: '0.9rem' }}>
        {noticia.categoria}
      </span>
      
      <h1 style={{ fontSize: '2.5rem', marginBottom: '15px', lineHeight: '1.2' }}>{noticia.titulo}</h1>
      <p style={{ color: '#666', marginBottom: '25px', fontSize: '0.95rem' }}>Publicado em: {noticia.data}</p>
      
      {noticia.imagem && (
        <img 
          src={noticia.imagem} 
          alt={noticia.titulo} 
          style={{ width: '100%', maxHeight: '450px', objectFit: 'cover', borderRadius: '8px', marginBottom: '30px' }} 
        />
      )}
      
      <div style={{ fontSize: '1.15rem', lineHeight: '1.8', color: '#333' }}>
        <p>{noticia.conteudo}</p>
      </div>
    </main>
  );
}