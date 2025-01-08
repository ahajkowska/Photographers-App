'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState([]); // Lista ulubionych Pokémonów
    const searchParams = useSearchParams(); // Hook do odczytu parametrów URL
    const router = useRouter(); // Hook do aktualizacji URL

    // Wczytaj ulubione z localStorage po załadowaniu strony
    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites);
    }, []);

    // Usuń Pokémona z ulubionych
    const removeFromFavorites = (id) => {
        const updatedFavorites = favorites.filter((pokemon) => pokemon.id !== id);
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    // Sortuj listę na podstawie parametru "sort" z URL
    const getSortedFavorites = () => {
        const sortParam = searchParams.get('sort') || 'name'; // Domyślnie sortuj po nazwie
        const sortedFavorites = [...favorites];

        if (sortParam === 'name') {
            sortedFavorites.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortParam === 'type') {
            sortedFavorites.sort((a, b) => (a.type || '').localeCompare(b.type || ''));
        }

        return sortedFavorites;
    };

    // Obsługa zmiany sortowania
    const handleSortChange = (sortBy) => {
        const currentUrl = new URL(window.location);
        currentUrl.searchParams.set('sort', sortBy);
        router.push(currentUrl.toString()); // Zaktualizuj URL
    };

    return (
        <div className="container">
            {/* Sortowanie */}
            <div className="pokemon-search">
                <select
                    id="sortSelect"
                    onChange={(e) => handleSortChange(e.target.value)}
                    value={searchParams.get('sort') || 'name'}
                >
                    <option value="name">Sort by Name</option>
                    <option value="type">Sort by Type</option>
                </select>
            </div>

            {/* Lista ulubionych Pokémonów */}
            {favorites.length === 0 ? (
                <p>No favorites added yet!</p>
            ) : (
                <ul className="favorites-list">
                    {getSortedFavorites().map((pokemon) => (
                        <li key={pokemon.id} className="pokemon-card">
                            <img
                                src={pokemon.img}
                                alt={pokemon.name}
                                width="80"
                                height="80"
                                className="pokemon-image"
                            />
                            <div className="pokemon-details">
                                <span>{pokemon.name}</span>
                                <button
                                    className="remove-button"
                                    onClick={() => removeFromFavorites(pokemon.id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
