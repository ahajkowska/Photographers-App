export default function PokemonDetailsLayout({ children }) {
    return (
        <div className="pokemon-layout">
            <h1>Szczegóły Pokemona</h1>
            {children}
        </div>
    );
}
