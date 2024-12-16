'use client';

import { useState, useEffect } from 'react';

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavorites(storedFavorites);
    }, []);

    return (
        <div>
            <h1>Your Favorite Pokémons</h1>
            <ul>
                {favorites.map((pokemon) => (
                    <li key={pokemon.id}>
                        <img src={pokemon.image} alt={pokemon.name} />
                        <p>{pokemon.name}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
