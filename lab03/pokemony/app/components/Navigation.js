import Link from 'next/link';

export default function Navigation() {
    return (
        <nav className="navigation">
            <ul>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/pokemon">Pokemons</Link></li>
                <li><Link href="/favorites">Favorites</Link></li>
            </ul>
        </nav>
    );
}
