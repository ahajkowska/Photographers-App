import React from "react";
import Link from 'next/link';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>Photographer's App</h1>
      </div>
      <ul className="navbar-links">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/projects">Projects</Link></li>
        <li><Link href="/tasks">Tasks</Link></li>
        <li><Link href="/gallery">Gallery</Link></li>
        <li><Link href="/idea-generator">Idea Generator</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
