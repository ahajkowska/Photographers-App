// StatsPanel.js
"use client";
import { useReducer, useEffect } from 'react';
import { statsReducer } from '../reducers/statsReducer';
import { useStatsContext } from '../context/StatsContext';

const StatsPanel = () => {
  const [state, dispatch] = useReducer(statsReducer, { pokemon: [], stats: {}, activityLog: [] });
  const { numberFormat, sortBy, viewType } = useStatsContext();

  useEffect(() => {
    async function fetchPokemon() {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=50');
      const data = await response.json();
      const detailedData = await Promise.all(
        data.results.map((pokemon) =>
          fetch(pokemon.url).then((res) => res.json())
        )
      );
      dispatch({ type: 'LOAD_DATA', payload: detailedData });
      dispatch({ type: 'CALCULATE_STATS', payload: detailedData });
    }
    fetchPokemon();
  }, []);

  const { favoriteCount, mostCommonType, averageStats, typeDistribution, top3Pokemon } = state.stats;

  return (
    <div className={`stats-panel ${viewType}`}>
      <h2>Statystyki Pokémonów</h2>
      <p>Liczba ulubionych Pokémonów: {favoriteCount !== undefined ? favoriteCount : 'Ładowanie...'}</p>
      <p>Najczęstszy typ Pokémonów: {mostCommonType || 'Ładowanie...'}</p>
      <p>
        Średnia ocena:
        {numberFormat === 'decimal'
          ? `averageStats`
          : averageStats || 'Ładowanie...'}
      </p>

      <h3>Szczegółowe statystyki</h3>
      <p>Top 3 Pokémony:</p>
      <ul>
        {top3Pokemon?.map((pokemon) => (
          <li key={pokemon.id}>
            {pokemon.name} - {pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0)} punktów
          </li>
        ))}
      </ul>

      <p>Rozkład typów:</p>
      <ul>
        {Object.entries(typeDistribution || {}).map(([type, count]) => (
          <li key={type}>
            {type}: {count} Pokémonów
          </li>
        ))}
      </ul>

      <h3>Historia aktywności:</h3>
      <ul>
        {state.activityLog?.map((log, index) => (
          <li key={index}>
            {log.action} - {new Date(log.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StatsPanel;
