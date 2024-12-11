// główny layout z nawigacją

import Navigation from "@/components/Navigation";


export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
            <Navigation />
            <main>{children}</main>
            </body>
        </html>
    );
}