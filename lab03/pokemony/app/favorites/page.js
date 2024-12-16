'use client';

import React, { useEffect, useState } from 'react';

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState([]); // Favorite Pokémon list

    // Load favorites from localStorage on page load
    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites);
    }, []);

    // Remove Pokémon from favorites
    const removeFromFavorites = (id) => {
        const updatedFavorites = favorites.filter((pokemon) => pokemon.id !== id);
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    return (
        <div className="container">
            {favorites.length === 0 ? (
                <p>No favorites added yet!</p>
            ) : (
                <ul className="favorites-list">
                    {favorites.map((pokemon) => (
                        <li key={pokemon.id} className="pokemon-card">
                            <img src={pokemon.image} alt={pokemon.name} />
                            <span>{pokemon.name}</span>
                            <button onClick={() => removeFromFavorites(pokemon.id)}>
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
