// app/layout.js
import "../styles/globals.css";
import "../styles/components.css";
import "../styles/gallery.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "Photographer's App",
  description: "Your app for managing art projects and galleries.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
