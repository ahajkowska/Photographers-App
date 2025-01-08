// layout dla pokemonów
export default function PokemonLayout({ children }) {
    return (
        <div className="pokemon-layout">
            <h1>Pokemony</h1>
            {children}
        </div>
    );
}
