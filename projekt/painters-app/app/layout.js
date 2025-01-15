// app/layout.js
import "../styles/global.css"; // Import global styles
import Navbar from "../components/Navbar"; // Shared Navbar component
import Footer from "../components/Footer"; // Shared Footer component

export const metadata = {
  title: "Painter's Hub",
  description: "Your ultimate tool for managing art projects and galleries.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main> {/* Render the current page here */}
        <Footer />
      </body>
    </html>
  );
}
