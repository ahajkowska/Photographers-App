"use client";

import { useState, useEffect } from "react";

export default function GalleryPage() {
  const [artworks, setArtworks] = useState([]);
  const [newArtwork, setNewArtwork] = useState({ title: "", image: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentArtwork, setCurrentArtwork] = useState(null);

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

  // Open modal for editing
  const handleEditArtwork = (art) => {
    setCurrentArtwork(art);
    setIsModalOpen(true);
  };

  // Update artwork title
  const handleUpdateArtwork = async () => {
    const response = await fetch("/api/artworks", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: currentArtwork._id, title: currentArtwork.title }),
    });
    const updatedArtwork = await response.json();
    setArtworks(artworks.map((art) => (art._id === updatedArtwork._id ? updatedArtwork : art)));
    setIsModalOpen(false);
    setCurrentArtwork(null);
  };


  return (
    <div>
      <h1>Gallery</h1>
      <form onSubmit={handleAddArtwork} className="upload-form">
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
      <div className="gallery-container">
        {artworks.map((art) => (
          <div key={art._id} className="gallery-item">
            <img src={art.image} alt={art.title} />
            <p>{art.title}</p>
            <div className="gallery-actions">
              <button onClick={() => handleEditArtwork(art)}>Edit</button>
              <button onClick={() => handleDeleteArtwork(art._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Artwork</h2>
            <input
              type="text"
              value={currentArtwork.title}
              onChange={(e) =>
                setCurrentArtwork({ ...currentArtwork, title: e.target.value })
              }
            />
            <div className="modal-actions">
              <button onClick={handleUpdateArtwork}>Save</button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}