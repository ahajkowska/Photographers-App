'use client';

import React, { useEffect, useState } from 'react';

export default function PokemonDetailsPage({ params }) {
    const { id } = params; // Extract the Pokémon ID from the URL
    const [pokemonDetails, setPokemonDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setPokemonDetails(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    return (
        <div className="pokemon-details">
            {loading ? (
                <p>Loading...</p>
            ) : pokemonDetails ? (
                <>
                    <h1>
                        #{pokemonDetails.id} {pokemonDetails.name}
                    </h1>
                    <img
                        src={pokemonDetails.sprites.front_default}
                        alt={pokemonDetails.name}
                    />
                    <p>
                        <strong>Types:</strong>{' '}
                        {pokemonDetails.types.map((type) => type.type.name).join(', ')}
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
                <p>Unable to load Pokémon details.</p>
            )}
        </div>
    );
}
