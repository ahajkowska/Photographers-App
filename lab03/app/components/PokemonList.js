'use client';

function PokemonList({ onSelectPokemon, filteredList = [], loading }) {
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
            <div key={pokemon.id} className="pokemon-card" onClick={() => onSelectPokemon(pokemon)}>
              <img
                src={pokemon.sprites.front_default}
                width="80"
                height="80"
                alt={pokemon.name}
                onClick={() => onSelectPokemon(pokemon)}
              />
              <span>{pokemon.name}</span>
              <button className="favorite-btn" onClick={(e) => {
                addToFavorites(pokemon);
              }}>
                Dodaj do ulubionych
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PokemonList;
