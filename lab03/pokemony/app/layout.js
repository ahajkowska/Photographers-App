import Navigation from "./components/Navigation";

export default function RootLayout({ children }) {
    return (
        <html lang="pl">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Pokemon GO</title>
                <link rel="stylesheet" href="/styles.css" />
            </head>
            <body>
                <Navigation/>
                <main>
                    {children}
                </main>
            </body>
        </html>
    );
}
