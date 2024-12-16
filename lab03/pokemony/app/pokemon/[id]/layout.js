import Link from 'next/link';

export default function PokemonDetailsLayout({ children }) {
    return (
        <div className="pokemon-details-layout">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
                <Link href="/pokemon">Pokemons</Link> / Details
            </nav>

            {/* Navigation Buttons */}
            <div className="navigation-buttons">
                <Link href="/pokemon">
                    <button>Back to Pokemon List</button>
                </Link>
                <Link href="/favorites">
                    <button>Go to Favorites</button>
                </Link>
            </div>

            {/* Content */}
            <div className="details-content">
                {children}
            </div>
        </div>
    );
}
