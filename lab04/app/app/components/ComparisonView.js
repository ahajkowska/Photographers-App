'use client';

function ComparisonView({ comparison, onClearComparison }) {
  const { pokemon1, pokemon2 } = comparison;

  return (
    <div className="comparison-view">
      <h2>Porównanie Pokémonów</h2>
      <div className="comparison-container">
        {pokemon1 && (
          <div className="pokemon-comparison-card">
            <h3>#{pokemon1.id} {pokemon1.name}</h3>
            <img src={pokemon1.sprites.front_default} alt={pokemon1.name} />
            <ul>
              <li>HP: {pokemon1.stats.find((stat) => stat.stat.name === 'hp').base_stat}</li>
              <li>Attack: {pokemon1.stats.find((stat) => stat.stat.name === 'attack').base_stat}</li>
              <li>Defense: {pokemon1.stats.find((stat) => stat.stat.name === 'defense').base_stat}</li>
              <li>Type: {pokemon1.types.map((type) => type.type.name).join(', ')}</li>
            </ul>
          </div>
        )}
        {pokemon2 && (
          <div className="pokemon-comparison-card">
            <h3>#{pokemon2.id} {pokemon2.name}</h3>
            <img src={pokemon2.sprites.front_default} alt={pokemon2.name} />
            <ul>
              <li>HP: {pokemon2.stats.find((stat) => stat.stat.name === 'hp').base_stat}</li>
              <li>Attack: {pokemon2.stats.find((stat) => stat.stat.name === 'attack').base_stat}</li>
              <li>Defense: {pokemon2.stats.find((stat) => stat.stat.name === 'defense').base_stat}</li>
              <li>Type: {pokemon2.types.map((type) => type.type.name).join(', ')}</li>
            </ul>
          </div>
        )}
      </div>
      <button onClick={onClearComparison} className="clear-comparison-btn">
        Wyczyść porównanie
      </button>
    </div>
  );
}

export default ComparisonView;
