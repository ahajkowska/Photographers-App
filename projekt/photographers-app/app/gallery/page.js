"use client";

import { FaHeart, FaRegHeart, FaTrash, FaEdit } from "react-icons/fa";
import { useState, useEffect, useMemo } from "react";
import useGallery from "../../hooks/useGallery";
import Statistics from "../../components/Statistics";
import { fetchUsers, fetchPhotos } from "../../handlers/galleryService";
import { handleAddPhoto, handleDeletePhoto, handleEditPhoto, handleUpdatePhoto, handleLikePhoto, handleUnlikePhoto } from "../../handlers/galleryHandlers";
import Comments from "../../components/Comments";
import SortOptions from "../../components/SortOptions";

export default function GalleryPage() {
  const { state, dispatch } = useGallery();
  const [newPhoto, setNewPhoto] = useState({ title: "", image: "", tags: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [loggedInUsername, setLoggedInUsername] = useState(null);
  const [searchTag, setSearchTag] = useState("");
  const [statistics, setStatistics] = useState({ totalPhotos: 0, totalComments: 0, topUser: null });
  const [sortOption, setSortOption] = useState("likes");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      const userId = localStorage.getItem("userId");
      const username = localStorage.getItem("username");
      setLoggedInUserId(userId);
      setLoggedInUsername(username);
  
      const userMap = await fetchUsers();
      await fetchPhotos(userMap, dispatch, calculateStatistics);
      setIsLoading(false); 
    };
  
    initialize();
  }, []); 

  const calculateStatistics = (photos) => {
    if (!photos || !Array.isArray(photos)) {
      return { totalPhotos: 0, totalComments: 0, topUser: null };
    }
  
    const totalPhotos = photos.length;
    const totalComments = photos.reduce((sum, photo) => sum + (photo.comments ? photo.comments.length : 0), 0);
  
    const userPhotoCounts = photos.reduce((acc, photo) => {
      const username = photo.username || "Anonymous";
      acc[username] = (acc[username] || 0) + 1;
      return acc;
    }, {});
  
    const topUser = Object.entries(userPhotoCounts).reduce(
      (top, [username, count]) => (count > top.count ? { username, count } : top),
      { username: null, count: 0 }
    );
  
    setStatistics({totalPhotos, totalComments, topUser});
  };

  const handlePhotoLoad = (photoId) => {
    dispatch({ type: "PHOTO_LOADED", payload: photoId });
  };

  // == comments ==
  const handleAddComment = async (photoId, commentText) => {
    try {
      const response = await fetch(`/api/photos/${photoId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: loggedInUserId,
          username: loggedInUsername,
          text: commentText,
        }),
      });

      if (response.ok) {
        const updatedPhoto = await response.json();
        const photoWithUsername = {
          ...updatedPhoto,
          username: state.photos.find((photo) => photo._id === photoId).username,
        };
        const updatedPhotos = state.photos.map(photo =>
          photo._id === photoId ? photoWithUsername : photo
        );
        dispatch({ type: "UPDATE_PHOTO", payload: photoWithUsername });
        calculateStatistics(updatedPhotos);
      } else {
        console.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  
  const handleDeleteComment = async (photoId, commentId) => {
    try {
      const response = await fetch(`/api/photos/${photoId}/comments`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photoId,
          commentId,
          userId: loggedInUserId,
        }),
      });
  
      if (response.ok) {
        const updatedPhoto = await response.json();
        const photoWithUsername = {
          ...updatedPhoto,
          username: state.photos.find((photo) => photo._id === photoId).username,
        };
        const updatedPhotos = state.photos.map(photo =>
          photo._id === photoId ? photoWithUsername : photo
        );
        dispatch({ type: "UPDATE_PHOTO", payload: photoWithUsername });
        calculateStatistics(updatedPhotos);
      } else {
        console.error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };
  
  // == filter photos ==
  const filterPhotos = (photos) => {
    if (!searchTag.trim()) return photos;
    const lowerCaseSearch = searchTag.toLowerCase();
    return photos.filter((photo) =>
      photo.title.toLowerCase().includes(lowerCaseSearch) ||
      photo.tags.some((tag) => tag.toLowerCase().includes(lowerCaseSearch))
    );
  };
  
  // === sort photos ===
  const sortPhotos = (photos) => {
    switch (sortOption) {
      case "likes":
        return [...photos].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
      case "comments":
        return [...photos].sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
      case "alphabetical":
        return [...photos].sort((a, b) => a.title.localeCompare(b.title));
      default:
        return photos;
    }
  };

  const filteredAndSortedPhotos = useMemo(() => {
    const filtered = filterPhotos(state.photos);
    return sortPhotos(filtered);
  }, [state.photos, searchTag, sortOption]);

  return (
    <div className="gallery-page">
      <h1>Gallery</h1>
      <SortOptions sortOption={sortOption} setSortOption={setSortOption} />

      <input
        type="text"
        placeholder="Search (by title or tag)"
        value={searchTag}
        onChange={(e) => setSearchTag(e.target.value)}
        name="search"
        className="search"
      />
      
      <form onSubmit={(e) => handleAddPhoto(e, newPhoto, loggedInUserId, loggedInUsername, dispatch, state, setNewPhoto,calculateStatistics)} className="upload-form">
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
        <input
          type="text"
          name="tags"
          placeholder="Comma-separated tags"
          value={newPhoto.tags.join(", ")}
          onChange={(e) => setNewPhoto({ ...newPhoto, tags: e.target.value.split(",").map(tag => tag.trim()) })}
        />
        <button type="submit">Add Photo</button>
      </form>

      {isLoading ? (
        <div className="gallery-loading">
          <p>Loading gallery...</p>
        </div>
      ) : (
      <div className="gallery-container">
        {filteredAndSortedPhotos.map((photo) => (
          <div key={photo._id} className="gallery-item">
            {state.photoLoadingStates[photo._id] ? (
              <div className="loading-indicator">Loading...</div>
            ) : null}
            <img
              src={photo.imageUrl}
              alt={photo.title}
              onLoad={() => handlePhotoLoad(photo._id)}
              style={{ display: state.photoLoadingStates[photo._id] ? "none" : "block" }}
            />
            <p>{photo.title}</p>
            <div className="photo-likes">
              <p>{photo.likes?.length || 0} Likes</p>
              {photo.likes?.includes(loggedInUserId) ? (
                <FaHeart 
                  className="like-button" 
                  color="red" 
                  onClick={() => handleUnlikePhoto(photo._id, loggedInUserId, dispatch, state)}
                />
              ) : (
                <FaRegHeart 
                  className="like-button" 
                  onClick={() => handleLikePhoto(photo._id, loggedInUserId, dispatch, state)}
                />
              )}
            </div>

            <p>Tags: {photo.tags.join(", ")}</p>
            <p>
              Added by: <strong>{photo.username || "Anonymous"}</strong>
            </p>

            <Comments
              photo={photo}
              loggedInUserId={loggedInUserId}
              handleAddComment={handleAddComment}
              handleDeleteComment={handleDeleteComment}
            />

            {photo.userId === loggedInUserId && (
              <div className="gallery-actions">
                <button onClick={() => handleEditPhoto(photo, setCurrentPhoto, setIsModalOpen)}><FaEdit/> Edit</button>
                <button onClick={() => handleDeletePhoto(photo._id, dispatch, state, calculateStatistics)}><FaTrash/> Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
      )}

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Photo</h2>
            <input
              type="text"
              name="title"
              value={currentPhoto.title}
              onChange={(e) =>
                setCurrentPhoto({ ...currentPhoto, title: e.target.value })
              }
            />
            <input
              type="text"
              name="tags"
              value={currentPhoto.tags.join(", ")}
              onChange={(e) =>
                setCurrentPhoto({ ...currentPhoto, tags: e.target.value.split(",").map(tag => tag.trim()) })
              }
            />
            <div className="modal-actions">
              <button onClick={() => handleUpdatePhoto(currentPhoto, dispatch, setIsModalOpen, setCurrentPhoto, state)}>Save</button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <Statistics statistics={statistics} />
    </div>
  );
}