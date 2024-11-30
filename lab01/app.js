const apiBase = "https://pokeapi.co/api/v2/pokemon";
const loader = document.getElementById("loader");
const pokemonList = document.getElementById("list");
const pokemonDetails = document.getElementById("details");

// funkcja async do pobierania listy Pokemonów z PokeAPI
async function fetchPokemonList() {
  try {
    loader.style.display = "block" // element staje się widoczny na stronie
    const response = await fetch(`${apiBase}?limit=20`);
    if (!response.ok) throw new Error("Nie udało się pobrać listy Pokemonów");

    const data = await response.json();

    loader.style.display = "none"; // element staje się niewidoczny na stronie
    //console.log(data)
    displayPokemonList(data.results);
  }
  catch(error) {
    loader.style.display = "none";
    pokemonList.innerHTML = `<p>Błąd: ${error.message}</p>`;  
  }
}

// wyświetlenie listy pierwszych 20 Pokemonów
function displayPokemonList(pokemons) {
  pokemonList.innerHTML = "";
  pokemons.forEach((pokemon, i) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i + 1}.png" alt="${pokemon.name}">
      ${i + 1}. ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
    `;

    listItem.addEventListener("click", () => fetchPokemonDetails(i + 1));
    pokemonList.appendChild(listItem);
  }); 
}

// funkcja do pobierania szczegółów pojedynczego Pokemona
async function fetchPokemonDetails(id) {
  try {
    pokemonDetails.innerHTML = `<p>Ładowanie...</p>`;

    const response = await fetch(`${apiBase}/${id}`);
    if (!response.ok) throw new Error("Nie udało się pobrać szczegółów Pokemona");

    const data = await response.json();
    displayPokemonDetails(data)
  }
  catch (error) {
    pokemonDetails.innerHTML = `<p>Błąd: ${error.message}</p>`;
  }
}

function displayPokemonDetails(pokemon) {
  const types = pokemon.types.map((type) => type.type.name).join(", ");
  const stats = pokemon.stats
    .map((stat) => `<li>${stat.stat.name}: ${stat.base_stat}</li>`)
    .join("");

  pokemonDetails.innerHTML = `
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
    <p><strong>Typy:</strong> ${types}</p>
    <p><strong>Wzrost:</strong> ${pokemon.height / 10} m</p>
    <p><strong>Waga:</strong> ${pokemon.weight / 10} kg</p>
    <ul><strong>Statystyki:</strong>${stats}</ul>
  `;
}

fetchPokemonList();
