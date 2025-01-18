"use client";

import { useState, useEffect } from "react";

export default function GalleryPage() {
  const [photos, setPhotos] = useState([]);
  const [newPhoto, setNewPhoto] = useState({ title: "", image: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setLoggedInUserId(userId);
    fetchPhotos();
  }, []);

  // Fetch photos from the backend
  const fetchPhotos = async () => {
    try {
      const response = await fetch("/api/photos");
      if (!response.ok) {
        throw new Error("Failed to fetch photos");
      }
      const data = await response.json();
      setPhotos(data);
    } catch (error) {
      console.error("Error fetching photos:", error.message);
    }
  };
  

  // Add new photo
  const handleAddPhoto = async (e) => {
    e.preventDefault();

    if (!newPhoto.title || !newPhoto.image) {
      alert("Please provide a title and image URL.");
      return;
    }

    const response = await fetch("/api/photos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title:newPhoto.title, imageUrl: newPhoto.image, userId: loggedInUserId }),
    });
    const savedPhoto = await response.json();
    setPhotos([...photos, savedPhoto]);
    setNewPhoto({ title: "", image: "" });
  };

  const handleDeletePhoto = async (photoId) => {
    const url = `/api/photos/${photoId}`;
    console.log("DELETE Request URL:", url); // Debug log
  
    const response = await fetch(url, { method: "DELETE" });
  
    if (response.ok) {
      console.log("Photo deleted successfully");
      setPhotos(photos.filter((photo) => photo._id !== photoId));
    } else {
      const errorText = await response.text();
      console.error("Failed to delete photo:", errorText);
    }
  };  

  // Open modal for editing
  const handleEditPhoto = (photo) => {
    setCurrentPhoto(photo);
    setIsModalOpen(true);
  };

  // Update photo title
  const handleUpdatePhoto = async () => {
    const response = await fetch(`/api/photos/${currentPhoto._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: currentPhoto.title }),
    });
    const updatedPhoto = await response.json();
    setPhotos(photos.map((photo) => (photo._id === updatedPhoto._id ? updatedPhoto : photo)));
    setIsModalOpen(false);
    setCurrentPhoto(null);
  };

  return (
    <div>
      <h1>Gallery</h1>
      <form onSubmit={handleAddPhoto} className="upload-form">
        <input
          type="text"
          name="title"
          placeholder="Photo Title"
          value={newPhoto.title}
          onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={newPhoto.image}
          onChange={(e) => setNewPhoto({ ...newPhoto, image: e.target.value })}
        />
        <button type="submit">Add Photo</button>
      </form>
      <div className="gallery-container">
        {photos.map((photo) => (
          <div key={photo._id} className="gallery-item">
            <img src={photo.imageUrl} alt={photo.title} />
            <p>{photo.title}</p>
            {photo.userId === loggedInUserId && (
              <div className="gallery-actions">
                <button onClick={() => handleEditPhoto(photo)}>Edit</button>
                <button onClick={() => handleDeletePhoto(photo._id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Photo</h2>
            <input
              type="text"
              value={currentPhoto.title}
              onChange={(e) =>
                setCurrentPhoto({ ...currentPhoto, title: e.target.value })
              }
            />
            <div className="modal-actions">
              <button onClick={handleUpdatePhoto}>Save</button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}