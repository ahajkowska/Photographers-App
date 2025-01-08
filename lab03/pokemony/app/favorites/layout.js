export default function FavoritesLayout({ children }) {
    return (
      <div className="favorites-layout">
        <header>
          <h1>Ulubione Pokémony</h1>
        </header>
        <main>{children}</main>
      </div>
    );
  }
  