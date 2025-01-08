'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PokemonList from '../components/PokemonList';

export default function PokemonPage() {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [limitFilter, setLimitFilter] = useState(20);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Fetchowanie danych Pokémonów
  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
        const { results } = await response.json();
        const detailedPokemonList = await Promise.all(
          results.map((pokemon) => fetch(pokemon.url).then((res) => res.json()))
        );
        setPokemonList(detailedPokemonList);
        setFilteredList(detailedPokemonList);
        setLoading(false);
      } catch (error) {
        console.error('Błąd podczas pobierania Pokémonów:', error);
        setLoading(false);
      }
    };
    fetchPokemonList();
  }, []);

  // Obsługa zmian parametrów URL
  useEffect(() => {
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');

    setTypeFilter(type || '');
    setSearchFilter(search || '');
    setLimitFilter(limit ? parseInt(limit, 10) : 20);

    let filtered = pokemonList;

    if (type) {
      filtered = filtered.filter((pokemon) =>
        pokemon.types.some((t) => t.type.name === type)
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchLower)
      );
    }

    if (limit) {
      filtered = filtered.slice(0, parseInt(limit, 10));
    }

    setFilteredList(filtered);
  }, [searchParams, pokemonList]);

  // Aktualizacja parametrów URL
  const updateURL = (params) => {
    const queryParams = new URLSearchParams();

    if (params.type) queryParams.set('type', params.type);
    if (params.search) queryParams.set('search', params.search);
    if (params.limit) queryParams.set('limit', params.limit);

    router.push(`/pokemon?${queryParams.toString()}`);
  };

  // Obsługa zmiany filtra typu
  const handleTypeChange = (event) => {
    const type = event.target.value;
    setTypeFilter(type);
    updateURL({ type, search: searchFilter, limit: limitFilter });
  };

  // Obsługa zmiany wyszukiwania
  const handleSearchChange = (event) => {
    const search = event.target.value;
    setSearchFilter(search);
    updateURL({ type: typeFilter, search, limit: limitFilter });
  };

  // Obsługa zmiany limitu
  const handleLimitChange = (event) => {
    const limit = event.target.value;
    setLimitFilter(limit);
    updateURL({ type: typeFilter, search: searchFilter, limit });
  };

  // Nawigacja do szczegółów Pokémona
  const handleSelectPokemon = (pokemon) => {
    router.push(`/pokemon/${pokemon.id}`);
  };

  return (
    <div className="pokemon-page">
      <div className='pokemon-search'>
        
      </div>
      <div className="filters">
        <select onChange={handleTypeChange} value={typeFilter}>
        <option value="">All Types</option>
            <option value="fire">Fire</option>
            <option value="water">Water</option>
            <option value="grass">Grass</option>
            <option value="flying">Flying</option>
        </select>
        <input
          type="text"
          placeholder="Wyszukaj po nazwie"
          value={searchFilter}
          onChange={handleSearchChange}
          className="search-input"
        />
        <select onChange={handleLimitChange} value={limitFilter}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
          <option value={40}>40</option>
          <option value={50}>50</option>
        </select>
      </div>

      <PokemonList
        onSelectPokemon={handleSelectPokemon}
        filteredList={filteredList}
        loading={loading}
      />
    </div>
  );
}
