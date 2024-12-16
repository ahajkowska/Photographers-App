'use client';

import React, { useEffect, useState } from 'react';
import PokemonDetails from '../components/PokemonDetails';


export default function MainPage() {
    const [pokemons, setPokemons] = useState([]); // Pokémon list
    const [selectedPokemon, setSelectedPokemon] = useState(null); // Selected Pokémon details
    const [favorites, setFavorites] = useState([]); // Favorite Pokémon list
    const [searchQuery, setSearchQuery] = useState(''); // Search query for Pokémon

    // Fetch Pokémon data (replace with your API or endpoint from Lab02)
    useEffect(() => {
        fetch('https://pokeapi.co/api/v2/pokemon?limit=20')
            .then((response) => response.json())
            .then((data) => {
                const formattedPokemons = data.results.map((pokemon, index) => ({
                    id: index + 1,
                    name: pokemon.name,
                    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
                }));
                setPokemons(formattedPokemons);
            });
    }, []);

    // Add Pokémon to favorites
    const addToFavorites = (pokemon) => {
        if (!favorites.some((fav) => fav.id === pokemon.id)) {
            setFavorites([...favorites, pokemon]);
        }
    };

    // Remove Pokémon from favorites
    const removeFromFavorites = (id) => {
        setFavorites(favorites.filter((pokemon) => pokemon.id !== id));
    };

    // Filter Pokémon based on search query
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button id="search-btn" onClick={() => console.log('Search Clicked')}>
                    Search
                </button>
            </div>

            <div className="main-content">
                {/* Pokémon List */}
                <div className="pokemon-list">
                    {filteredPokemons.map((pokemon) => (
                        <div
                            key={pokemon.id}
                            onClick={() => setSelectedPokemon(pokemon)}
                        >
                            <img src={pokemon.image} alt={pokemon.name} />
                            <span>{pokemon.name}</span>
                        </div>
                    ))}
                </div>

                {/* Pokémon Details */}
                {selectedPokemon && (
                    <PokemonDetails
                    selectedPokemon={selectedPokemon}
                    onBack={() => setSelectedPokemon(null)}
                    onFavorite={addToFavorites}
                />
                
                )}
            </div>

        </div>
    );
}
