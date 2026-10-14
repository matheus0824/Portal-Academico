import CardNoticia from "./components/CardNoticia";

export default function Home() {
  return (
    <main>
      <header>
        <h1>Portal Acadêmico</h1>
        <p>Informação, pesquisa e conhecimento.</p>
      </header>

      <nav>
        <a href="/">Início</a>
        <a href="/noticias">Notícias</a>
        <a href="/cadastrar">Cadastrar notícia</a>
      </nav>

      <section>
        <h2>Bem-vindo ao Portal Acadêmico!</h2>
        <p>
          Acompanhe as novidades, pesquisas e eventos
          do mundo acadêmico.
        </p>
      </section>
      <section>
        <h2>Últimas notícias</h2>

          <div className="lista-noticias">
            <CardNoticia
              titulo="Universidade desenvolve nova pesquisa"
              categoria="Pesquisa"
              data="14/10/2026"
              resumo="Conheça os avanços de uma pesquisa desenvolvida no ambiente acadêmico."
              imagem="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPibWU69JpA_LT4Yym2_Anr68XtDPku6bhvrBggMGKig&s=10"
            />

            <CardNoticia
              titulo="Semana acadêmica anuncia programação"
              categoria="Eventos"
              data="13/10/2026"
              resumo="Confira as novidades e atividades previstas para a comunidade universitária."
              imagem="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGtryb2_Ti-_gdxrjSCHTlyYG7hZYLqOhwGMNW9luurA&s"
            />

            <CardNoticia
              titulo="Projeto de inovação ganha destaque"
              categoria="Inovação"
              data="12/10/2026"
              resumo="Estudantes e pesquisadores apresentam novas ideias e soluções."
              imagem="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPaPAyO1yXPd0DbEESmZhN-e6NxFdSpBJeX-4D6e6WmQ&s=10"
            />
          </div>
      </section>


      <footer>
        <p>Portal Acadêmico - Projeto acadêmico</p>
      </footer>
    </main>
  );
}
