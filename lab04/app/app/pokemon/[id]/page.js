'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import PokemonDetails from '../../components/PokemonDetails';

export default function PokemonDetailsPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPokemonDetails() {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await response.json();
        setPokemonDetails(data);
      } catch (error) {
        console.error('Błąd podczas pobierania szczegółów:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPokemonDetails();
  }, [id]);

  const view = searchParams.get('view');

  return (
    <div className="pokemon-details-page">
      {loading ? (
        <p>Ładowanie szczegółów...</p>
      ) : (
        <PokemonDetails
          pokemonDetails={pokemonDetails}
          loadingDetails={loading}
          onBack={() => router.push('/pokemon')}
        />
      )}
    </div>
  );
}
