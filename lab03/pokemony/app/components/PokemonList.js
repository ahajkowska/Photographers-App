import Link from 'next/link';

export default function PokemonList({ pokemons, onSelect, favorites, onAddToFavorites }) {
    return (
        <div className="pokemon-list">
            {pokemons.map((pokemon) => (
                <div key={pokemon.id} className="pokemon-card">
                    <Link href={`/pokemon/${pokemon.id}`}>
                        <img src={pokemon.image} alt={pokemon.name} />
                    </Link>
                    <div className="pokemon-info">
                        <Link href={`/pokemon/${pokemon.id}`}>
                            <span>{pokemon.name}</span>
                        </Link>
                        {!favorites.some((fav) => fav.id === pokemon.id) && (
                            <button
                                className="heart-button"
                                onClick={() => onAddToFavorites(pokemon)}
                            >
                                ❤️
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
