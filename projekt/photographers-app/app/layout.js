import "../styles/globals.css";
import "../styles/components.css";
import "../styles/gallery.css";
import "../styles/projects.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ThemeProvider } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

export const metadata = {
  title: "Photographers App",
  description: "Your app for managing art projects and galleries.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Navbar />
          <ThemeToggle />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
