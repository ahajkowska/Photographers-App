import React, { useState, useEffect } from 'react';

export default function PokemonDetails({ selectedPokemon, onBack, onFavorite }) {
    const [pokemonDetails, setPokemonDetails] = useState(null); // Pokémon details
    const [loadingDetails, setLoadingDetails] = useState(false); // Loading state

    // Fetch Pokémon details when `selectedPokemon` changes
    useEffect(() => {
        if (selectedPokemon) {
            setLoadingDetails(true);
            fetch(`https://pokeapi.co/api/v2/pokemon/${selectedPokemon.id}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch Pokémon details');
                    }
                    return response.json();
                })
                .then((data) => {
                    setPokemonDetails(data);
                    setLoadingDetails(false);
                })
                .catch(() => {
                    setPokemonDetails(null);
                    setLoadingDetails(false);
                });
        }
    }, [selectedPokemon]);

    // If no Pokémon is selected, render nothing
    if (!selectedPokemon) {
        return null;
    }

    return (
        <div className="pokemon-details">
            {loadingDetails ? (
                <p>Loading...</p>
            ) : pokemonDetails ? (
                <>
                    <h2>
                        #{pokemonDetails.id} {pokemonDetails.name}
                    </h2>
                    <img
                        src={pokemonDetails.sprites.front_default}
                        alt={pokemonDetails.name}
                    />
                    <p>
                        <strong>Types:</strong>{' '}
                        {pokemonDetails.types.map((t) => t.type.name).join(', ')}
                    </p>
                    <p>
                        <strong>Height:</strong> {pokemonDetails.height / 10} m
                    </p>
                    <p>
                        <strong>Weight:</strong> {pokemonDetails.weight / 10} kg
                    </p>
                    <p>
                        <strong>Stats:</strong>
                    </p>
                    <ul>
                        {pokemonDetails.stats.map((stat) => (
                            <li key={stat.stat.name}>
                                {stat.stat.name}: {stat.base_stat}
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <p>Unable to load Pokémon details!</p>
            )}
        </div>
    );
}
