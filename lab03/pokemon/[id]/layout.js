// layout dla szczegółów Pokemona
// breadcrumbs, przyciski nawigacji

export default function PokemonDetailsLayout({ children }) {
    return (
        <section>
            <nav className="breadcrumbs">Breadcrumbs</nav>
            <div className="details">{children}</div>
            <div className="navigation-buttons">Przyciski nawigacji</div>
        </section>
    );
}
  