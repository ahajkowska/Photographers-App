import Link from 'next/link'; //nawigacja między różnymi trasami

export default function Navigation() {
    return (
        <nav>
            <ul>
                <li><Link href="/">Strona główna</Link></li>
                <li><Link href="/pokemon">Pokemony</Link></li>
                <li><Link href="/favorites">Ulubione</Link></li>
            </ul>
        </nav>
    )
}