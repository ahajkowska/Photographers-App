'use client';

function PokemonDetails({ pokemonDetails, loadingDetails, onBack }) {
  if (!pokemonDetails && loadingDetails) {
    return <p>Ładowanie szczegółów Pokémona...</p>;
  }

  if (!pokemonDetails) {
    return <p>Nie znaleziono szczegółów Pokémona.</p>;
  }

  const { name, id, sprites, types, height, weight, stats } = pokemonDetails;

  return (
    <div className="pokemon-details">
      {/* Breadcrumbs */}
      <nav className="breadcrumbs">
        <span onClick={onBack} className="breadcrumb-link">Lista Pokémonów</span> /{' '}
        <span className="breadcrumb-current">{name}</span>
      </nav>

      {/* Szczegóły Pokémona */}
      <h2>
        #{id} {name}
      </h2>
      <img src={sprites.front_default} alt={name} className="pokemon-sprite" />
      <p>
        <strong>Typy:</strong> {types.map((t) => t.type.name).join(', ')}
      </p>
      <p>
        <strong>Wzrost:</strong> {height / 10} m
      </p>
      <p>
        <strong>Waga:</strong> {weight / 10} kg
      </p>
      <p>
        <strong>Statystyki:</strong>
      </p>
      <ul>
        {stats.map((s) => (
          <li key={s.stat.name}>
            {s.stat.name}: {s.base_stat}
          </li>
        ))}
      </ul>

      {/* Nawigacja */}
      <div className="navigation-buttons">
        <button className="nav-button" onClick={onBack}>Powrót</button>
      </div>
    </div>
  );
}

export default PokemonDetails;
