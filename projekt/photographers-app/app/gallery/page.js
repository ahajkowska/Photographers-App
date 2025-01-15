"use client";

import { useState, useEffect } from "react";

export default function GalleryPage() {
  const [artworks, setArtworks] = useState([]);
  const [newArtwork, setNewArtwork] = useState({ title: "", image: "" });

  // Fetch artworks from the API
  useEffect(() => {
    fetch("/api/artworks")
      .then((res) => res.json())
      .then((data) => setArtworks(data));
  }, []);

  // Add new artwork
  const handleAddArtwork = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/artworks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newArtwork),
    });
    const savedArtwork = await response.json();
    setArtworks([...artworks, savedArtwork]);
    setNewArtwork({ title: "", image: "" });
  };

  // Delete artwork
  const handleDeleteArtwork = async (id) => {
    await fetch("/api/artworks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setArtworks(artworks.filter((art) => art._id !== id));
  };

  // Edit artwork title
  const handleEditArtwork = async (id) => {
    const updatedTitle = prompt("Edit Title:", artworks.find((art) => art._id === id).title);
    if (!updatedTitle) return;

    const response = await fetch("/api/artworks", {
      method: "PUT", // Assuming a PUT method is defined in the API for updating
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, title: updatedTitle }),
    });
    const updatedArtwork = await response.json();

    setArtworks(artworks.map((art) => (art._id === id ? updatedArtwork : art)));
  };

  return (
    <div>
      <h1>Gallery</h1>
      <form onSubmit={handleAddArtwork}>
        <input
          type="text"
          name="title"
          placeholder="Artwork Title"
          value={newArtwork.title}
          onChange={(e) => setNewArtwork({ ...newArtwork, title: e.target.value })}
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={newArtwork.image}
          onChange={(e) => setNewArtwork({ ...newArtwork, image: e.target.value })}
        />
        <button type="submit">Add Artwork</button>
      </form>
      <div>
        {artworks.map((art) => (
          <div key={art._id}>
            <img src={art.image} alt={art.title} />
            <p>{art.title}</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => handleEditArtwork(art._id)}>Edit</button>
              <button onClick={() => handleDeleteArtwork(art._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
