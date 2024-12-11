// layout dla sekcji pokemon
// pasek filtrowania, obszar na listę/szczegóły

export default function PokemonLayout({ children }) {
    return (
      <section>
        <div className="filter-bar">Pasek filtrowania</div>
        <div className="content">{children}</div>
      </section>
    );
  }
  