'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function MainPage() {
    const [pokemons, setPokemons] = useState([]); // lista pokemonow
    const router = useRouter(); // Router dla nawigacji
    const searchParams = useSearchParams(); // parametry url

    // URL
    const limit = parseInt(searchParams.get('limit')) || 20;
    const type = searchParams.get('type') || '';
    const searchQuery = searchParams.get('search') || '';

    // local state dla search input
    const [searchInput, setSearchInput] = useState(searchQuery);

    // Fetchowanie pokemonow
    useEffect(() => {
        const fetchPokemons = async () => {
            try {
                let formattedPokemons = [];

                if (type) {
                    // Fetch pokemonow --> typ
                    const typeResponse = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
                    const typeData = await typeResponse.json();
                    formattedPokemons = typeData.pokemon.map((p) => ({
                        id: p.pokemon.url.split('/').slice(-2, -1)[0],
                        name: p.pokemon.name,
                        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.pokemon.url
                            .split('/')
                            .slice(-2, -1)[0]}.png`,
                    }));
                } else {
                    // Fetch pokemonow --> limit
                    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
                    const data = await response.json();
                    formattedPokemons = data.results.map((pokemon, index) => ({
                        id: index + 1,
                        name: pokemon.name,
                        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
                    }));
                }

                // zastosuj limit do wyfiltrowanych poksów
                const limitedPokemons = formattedPokemons.slice(0, limit);
                setPokemons(limitedPokemons);
            } catch (error) {
                console.error('Error fetching Pokémon:', error);
            }
        };

        fetchPokemons();
    }, [type, limit]); // znowu zrob fetch jesli zmieni sie typ lub limit

    // gdy search query sie zmienia i zrob update url
    const handleSearchChange = (query) => {
        setSearchInput(query);
        const params = new URLSearchParams(searchParams.toString());
        if (query) {
            params.set('search', query); // dodaj/update search
        } else {
            params.delete('search'); // usun search jesli puste
        }
        router.push(`/pokemon?${params.toString()}`);
    };

    // wyfiltruj pokemony -> search query z url
    const filteredPokemons = pokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container">
            {/* Search Section */}
            <div className="search-section">
                <input
                    id="search"
                    type="text"
                    placeholder="Search Pokémon..."
                    value={searchInput}
                    onChange={(e) => handleSearchChange(e.target.value)} // update URL
                />
                <button id="search-btn">Search</button>
            </div>

            {/* Type Dropdown */}
            <div className="type-section">
                <label htmlFor="type">Filter by Type:</label>
                <select
                    id="type"
                    value={type}
                    onChange={(e) => {
                        const params = new URLSearchParams(searchParams.toString());
                        if (e.target.value) {
                            params.set('type', e.target.value); // dodaj/update type
                        } else {
                            params.delete('type'); // usun type jesli nieustawiony
                        }
                        router.push(`/pokemon?${params.toString()}`);
                    }}
                >
                    <option value="">All Types</option>
                    <option value="fire">Fire</option>
                    <option value="water">Water</option>
                    <option value="grass">Grass</option>
                    <option value="electric">Electric</option>
                    <option value="psychic">Psychic</option>
                    <option value="ice">Ice</option>
                    <option value="dragon">Dragon</option>
                    <option value="dark">Dark</option>
                    <option value="fairy">Fairy</option>
                </select>
            </div>

            {/* Limit Dropdown */}
            <div className="limit-section">
                <label htmlFor="limit">Limit Results:</label>
                <select
                    id="limit"
                    value={limit}
                    onChange={(e) => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.set('limit', e.target.value); // update limit
                        router.push(`/pokemon?${params.toString()}`);
                    }}
                >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
            </div>

            {/* Pokémon List */}
            <div className="pokemon-list">
                {filteredPokemons.map((pokemon) => (
                    <div
                        key={pokemon.id}
                        className="pokemon-card"
                        onClick={() => router.push(`/pokemon/${pokemon.id}`)} // hop do detailsów poksa
                    >
                        <img src={pokemon.image} alt={pokemon.name} />
                        <span>{pokemon.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
