'use client';

function PokemonList({ onSelectPokemon, onAddToComparison, filteredList = [], loading }) {
  const addToFavorites = (pokemon) => {
    const existingFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (existingFavorites.some((fav) => fav.id === pokemon.id)) {
      alert(`${pokemon.name} jest już w ulubionych!`);
      return;
    }

    // Dodajemy typ Pokémona, jeśli jest dostępny (ułatwia sortowanie)
    const updatedPokemon = {
      id: pokemon.id,
      name: pokemon.name,
      img: pokemon.sprites.front_default,
      type: pokemon.types ? pokemon.types[0].type.name : 'Unknown', // Dodaj typ
    };

    const updatedFavorites = [...existingFavorites, updatedPokemon];
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    alert(`${pokemon.name} został dodany do ulubionych!`);
  };

  return (
    <div className="pokemon-section">
      <div className="pokemon-list">
        {loading ? (
          <p>Ładowanie...</p>
        ) : filteredList.length === 0 ? (
          <p>Nie znaleziono Pokémonów!</p>
        ) : (
          filteredList.map((pokemon) => (
            <li key={pokemon.id} className="pokemon-card" onClick={() => onSelectPokemon(pokemon)}>
              <img
                src={pokemon.sprites.front_default}
                width="80"
                height="80"
                alt={pokemon.name}
                onClick={() => onSelectPokemon(pokemon)}
                className="pokemon-image"
              />
              <div className="pokemon-details">
                <span>#{pokemon.id} {pokemon.name}</span>
                <button className="favorite-btn" onClick={(e) => {
                  addToFavorites(pokemon);
                }}>
                  Dodaj do ulubionych
                </button>
                <button
                  className="favorite-btn"
                  onClick={() => onAddToComparison(pokemon)}
                >
                  Porównaj
                </button>
              </div>
            </li>
          ))
        )}
      </div>
    </div>
  );
}

export default PokemonList;
