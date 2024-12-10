let selectedPokemon = null; // wybrany pokemon
let pokemonList = []; // lista poksów z api
let filteredList = []; // przefiltrowane w czasie szukania poksy
let loading = true; // bool do informacji o ładowaniu
let pokemonDetails = null; // przechowywanie szczegółów o wybranym poksie
let loadingDetails = true; // bool do informacji o ładowaniu


function rerenderApp() {
    ReactDOM.render(<App />, document.getElementById('root'));
}

// pobieranie listy pokemonów
async function fetchPokemonList() {
  if (!loading) return; // zeby nie renderowac niepotrzebnie znowu aplikacji, gdy jest wszystko ok
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
      const { results } = await response.json();

      pokemonList = await Promise.all(
        results.map((pokemon) => fetch(pokemon.url).then((res) => res.json()))
      ); // zmienna wypełniona poksami z api

      filteredList = pokemonList; // poczatkowo filteredList to pokemonList
      loading = false;
      rerenderApp();
    } catch (error) {
      console.error('Błąd podczas pobierania Pokémonów', error);
      loading = false; // po załadowaniu znowu switch na false
      rerenderApp();
    }
}

// pobieranie szczegółow pokemona
async function fetchPokemonDetails(pokemon) {
  loadingDetails = true;
  pokemonDetails = null; // resetuje detale zeby zaraz je przypisać na nowo
  rerenderApp();

  try {
    const { name, id, sprites, types, height, weight, stats } = pokemon;
    pokemonDetails = { name, id, sprites, types, height, weight, stats };
  } catch (error) {
    console.error('Błąd podczas pobierania szczegółów Pokémona', error);
  } finally {
    loadingDetails = false;
    rerenderApp();
  }
}

// wyswietla liste pokemonow
function PokemonList({ onSelectPokemon, filteredList, loading }) {
  return (
    <div className="pokemon-list">
      {loading ? (
        <p>Ładowanie...</p>
      ) : filteredList.length === 0 ? (
        <p>Nie ma takiego Pokémona w liście!</p>
      ) : (
        // tworzenie przefiltrowanej listy
        filteredList.map((pokemon) => (
          <div key={pokemon.id} onClick={() => onSelectPokemon(pokemon)}>
            <img src={pokemon.sprites.front_default} width="80" height="80" alt={pokemon.name} />
            <span>
              {pokemon.id}. {pokemon.name}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

// Wyświetlanie szczegółów pokemona, przekazujemy zawartosc zmiennej selectedPokemon

function PokemonDetails({ selectedPokemon }) {
  if (!pokemonDetails && selectedPokemon) {
    fetchPokemonDetails(selectedPokemon);
  }

  return (
    <div className="pokemon-details">
      {loadingDetails ? (
        <p>Ładowanie...</p>
      ) : pokemonDetails ? (
        <>
          <h2>
            #{pokemonDetails.id} {pokemonDetails.name}
          </h2>
          <img src={pokemonDetails.sprites.front_default} alt={pokemonDetails.name} />
          <p>
            <strong>Typy:</strong> {pokemonDetails.types.map((t) => t.type.name).join(', ')}
          </p>
          <p>
            <strong>Wzrost:</strong> {pokemonDetails.height / 10} m
          </p>
          <p>
            <strong>Waga:</strong> {pokemonDetails.weight / 10} kg
          </p>
          <p>
            <strong>Statystyki:</strong>
          </p>
          <ul>
            {pokemonDetails.stats.map((s) => (
              <li key={s.stat.name}>
                {s.stat.name}: {s.base_stat}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Nie ma takiego Pokémona!</p>
      )}
    </div>
  );
}

// Szukanie pokemonów, z 3 argumentami 
// onSearch = funkcja która obsługuje zdarzenie gdy użytkownik coś wpisuje
// onSelectPokemon = gdy wybiera pokemona

function PokemonSearch({ onSearch, onSelectPokemon, pokemonList }) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      const searchInput = event.target.value.trim().toLowerCase();
      if (searchInput) {
        const matchedPokemon = pokemonList.find(
          (pokemon) =>
            pokemon.name === searchInput || pokemon.id.toString() === searchInput
        );
        // jeśli znajdzie pokemona to fetchuje dane
        if (matchedPokemon) {
          onSelectPokemon(matchedPokemon);
        }
      }
    }
  };

  return (
    <div className="search-section">
      <input
        type="text"
        id="search"
        placeholder="Wyszukaj Pokémona..."
        onChange={onSearch}
        onKeyDown={handleKeyDown}
        className="search-input"
      />
      <button
        id="search-btn"
        onClick={() => {
          const searchInput = document.getElementById('search').value.trim().toLowerCase();
          if (searchInput) {
            const matchedPokemon = pokemonList.find(
              (pokemon) =>
                pokemon.name === searchInput || pokemon.id.toString() === searchInput
            );
            //jeśli znajdzie pokemona to wyświetla detale
            if (matchedPokemon) {
              onSelectPokemon(matchedPokemon);
            }
          }
        }}
      >
        Szukaj
      </button>
    </div>
  );
}

function App() {
  if (pokemonList.length === 0 && loading) {
    fetchPokemonList();
  }
  // filtrowanie listy z pokemonami w miarę wpisywania
  const handleSearch = (event) => {
    const searchInput = event.target.value.trim().toLowerCase();
    filteredList = pokemonList.filter(
      (pokemon) =>
        pokemon.name.startsWith(searchInput) || pokemon.id.toString().startsWith(searchInput)
    );
    rerenderApp();
  };
  // fetchowanie danych o pokemonie
  const handleSelectPokemon = (pokemon) => {
    selectedPokemon = pokemon;
    fetchPokemonDetails(pokemon);
  };

  // wyświetlanie details pod warunkiem, że użytkownik je wybrał
  return (
    <div className="app">
      <PokemonSearch
        onSearch={handleSearch}
        onSelectPokemon={handleSelectPokemon}
        pokemonList={pokemonList}
      />
      <div className="main-content">
        <PokemonList
          onSelectPokemon={handleSelectPokemon}
          filteredList={filteredList}
          loading={loading}
        />
        {selectedPokemon && <PokemonDetails selectedPokemon={selectedPokemon} />}
      </div>
    </div>
  );
}

rerenderApp();