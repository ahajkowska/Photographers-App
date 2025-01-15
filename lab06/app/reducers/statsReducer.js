export const statsReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_DATA':
      return { ...state, pokemon: action.payload };

    case 'CALCULATE_STATS': {
      const stats = calculateStats(action.payload);
      return { ...state, stats };
    }

    case 'SORT_DATA': {
      const sortedPokemon = [...state.pokemon].sort((a, b) => {
        if (action.payload.sortBy === 'name') return a.name.localeCompare(b.name);
        if (action.payload.sortBy === 'type') return a.types[0].type.name.localeCompare(b.types[0].type.name);
        return 0;
      });
      return { ...state, pokemon: sortedPokemon };
    }

    case 'FILTER_DATA': {
      const filteredPokemon = state.pokemon.filter((pokemon) =>
        pokemon.types.some((type) => type.type.name === action.payload.type)
      );
      return { ...state, pokemon: filteredPokemon };
    }

    case 'ADD_ACTIVITY': {
        const newActivity = { action: action.payload.action, timestamp: Date.now() };
        return { ...state, activityLog: [...(state.activityLog || []), newActivity] };
    }

    default:
      return state;
  }
};

const calculateStats = (pokemonList) => {
      
      const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
      let favoriteCount = storedFavorites.length;

    const typeCounts = pokemonList.reduce((acc, pokemon) => {
        pokemon.types.forEach((type) => {
        acc[type.type.name] = (acc[type.type.name] || 0) + 1;
        });
        return acc;
    }, {});

    const mostCommonType = Object.keys(typeCounts).reduce(
        (a, b) => (typeCounts[a] > typeCounts[b] ? a : b),
        ''
    );

    const averageStats = pokemonList.reduce((acc, pokemon) => {
        const totalStats = pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0);
        return acc + totalStats;
    }, 0) / pokemonList.length;

    const top3Pokemon = [...pokemonList]
        .sort((a, b) => {
        const totalStatsA = a.stats.reduce((sum, s) => sum + s.base_stat, 0);
        const totalStatsB = b.stats.reduce((sum, s) => sum + s.base_stat, 0);
        return totalStatsB - totalStatsA;
        })
        .slice(0, 3);

    return {
        favoriteCount,
        mostCommonType,
        averageStats: averageStats.toFixed(2),
        typeDistribution: typeCounts,
        top3Pokemon,
    };
};
