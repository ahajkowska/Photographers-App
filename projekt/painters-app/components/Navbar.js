import React from "react";
import Link from 'next/link';
// import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h1>Painter's Hub</h1>
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/projects">Projects</Link></li>
        <li><Link href="/gallery">Gallery</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
