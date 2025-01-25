"use client";

import { useState, useEffect, useMemo, useReducer, useRef } from "react";

export default function GalleryPage() {
  // Define the initial state for the reducer
  const initialState = {
    photos: [],
    photoLoadingStates: {},
  };

  // Define the reducer function
  const galleryReducer = (state, action) => {
    switch (action.type) {
      case "SET_PHOTOS":
        return {
          ...state,
          photos: action.payload,
          photoLoadingStates: {
            ...state.photoLoadingStates,
            ...action.payload.reduce((states, photo) => {
              if (!(photo._id in states)) {
                states[photo._id] = false; // Ensure existing states are preserved
              }
              return states;
            }, {}),
          },
        };
      case "UPDATE_PHOTO":
        return {
          ...state,
          photos: state.photos.map((photo) =>
            photo._id === action.payload._id ? action.payload : photo
          ),
        };
      case "PHOTO_LOADED":
        return {
          ...state,
          photoLoadingStates: {
            ...state.photoLoadingStates,
            [action.payload]: false, // photo has finished loading
          },
        };
      case "ADD_PHOTO":
        return {
          ...state,
          photos: [...state.photos, action.payload],
        };
      case "DELETE_PHOTO":
        return {
          ...state,
          photos: state.photos.filter((photo) => photo._id !== action.payload),
        };
      default:
        return state;
    }
  };

  // Use the useReducer hook
  const [state, dispatch] = useReducer(galleryReducer, initialState);

  const [newPhoto, setNewPhoto] = useState({ title: "", image: "", tags: [] });
  const [photoComments, setPhotoComments] = useState({});
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
  
      await fetchPhotos(userMap);
      setIsLoading(false); 
    };
  
    initialize();
  }, []);
  

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
  
      const users = await response.json();
      return users.reduce((map, user) => {
        map[user._id] = user.username;
        return map;
      }, {});
    } catch (error) {
      console.error("Error fetching users:", error.message);
      return {};
    }
  };

  const fetchPhotos = async (userMap) => {
    try {
      const response = await fetch("/api/photos");
      if (!response.ok) {
        throw new Error("Failed to fetch photos");
      }
      const photos = await response.json();
  
      const updatedPhotos = photos.map((photo) => ({
        ...photo,
        username: userMap[photo.userId] || "Anonymous",
      }));
  
      dispatch({ type: "SET_PHOTOS", payload: updatedPhotos });
      calculateStatistics(updatedPhotos);
    } catch (error) {
      console.error("Error fetching photos:", error.message);
    }
  };  

  const calculateStatistics = (photos) => {
    const totalPhotos = photos.length;
  
    const totalComments = photos.reduce((sum, photo) => sum + photo.comments.length, 0);
  
    const userPhotoCounts = photos.reduce((acc, photo) => {
      const username = photo.username || "Anonymous";
      acc[username] = (acc[username] || 0) + 1;
      return acc;
    }, {});
  
    const topUser = Object.entries(userPhotoCounts).reduce(
      (top, [username, count]) => (count > top.count ? { username, count } : top),
      { username: null, count: 0 }
    );
  
    setStatistics({ totalPhotos, totalComments, topUser });
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
      body: JSON.stringify({
        title: newPhoto.title,
        imageUrl: newPhoto.image,
        userId: loggedInUserId,
        username: loggedInUsername,
        tags: newPhoto.tags,
      }),
    });
    if (response.ok) {
      const savedPhoto = await response.json();
      const updatedPhoto = { ...savedPhoto, username: loggedInUsername };
      dispatch({ type: "ADD_PHOTO", payload: updatedPhoto });
      setNewPhoto({ title: "", image: "", tags: [] }); // Reset form
      calculateStatistics([...state.photos, updatedPhoto]); // Update statistics    
    } else {
      console.error("Failed to add photo");
    }
  };

  const handlePhotoLoad = (photoId) => {
    dispatch({ type: "PHOTO_LOADED", payload: photoId });
  };

  const handleDeletePhoto = async (photoId) => {
    const url = `/api/photos/${photoId}`;
    console.log("DELETE Request URL:", url);
  
    const response = await fetch(url, { method: "DELETE" });
  
    if (response.ok) {
      console.log("Photo deleted successfully");
      dispatch({ type: "DELETE_PHOTO", payload: photoId });
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
      body: JSON.stringify({ title: currentPhoto.title, tags: currentPhoto.tags }),
    });
    const updatedPhoto = await response.json();
    dispatch({ type: "UPDATE_PHOTO", payload: updatedPhoto });
    setIsModalOpen(false);
    setCurrentPhoto(null);
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
        // Preserve the username in the updated photo
        const photoWithUsername = {
          ...updatedPhoto,
          username: state.photos.find((photo) => photo._id === photoId).username,
        };
        dispatch({ type: "UPDATE_PHOTO", payload: photoWithUsername });
        setPhotoComments((prevComments) => ({
          ...prevComments,
          [photoId]: "", // Clear the input after adding a comment
        }));
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
        // Preserve the username in the updated photo
        const photoWithUsername = {
          ...updatedPhoto,
          username: state.photos.find((photo) => photo._id === photoId).username,
        };
        dispatch({ type: "UPDATE_PHOTO", payload: photoWithUsername });
      } else {
        console.error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };
  
  const handleLikePhoto = async (photoId) => {
    try {
      const response = await fetch(`/api/photos/${photoId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: loggedInUserId }),
      });
  
      if (response.ok) {
        const updatedPhoto = await response.json();
        dispatch({ type: "UPDATE_PHOTO", payload: updatedPhoto });
      } else {
        console.error("Failed to like photo");
      }
    } catch (error) {
      console.error("Error liking photo:", error);
    }
  };
  
  const handleUnlikePhoto = async (photoId) => {
    try {
      const response = await fetch(`/api/photos/${photoId}/like`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: loggedInUserId }),
      });
  
      if (response.ok) {
        const updatedPhoto = await response.json();
        dispatch({ type: "UPDATE_PHOTO", payload: updatedPhoto });
      } else {
        console.error("Failed to unlike photo");
      }
    } catch (error) {
      console.error("Error unliking photo:", error);
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
      <div className="sort-options">
        <label htmlFor="sort">Sort by:</label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="likes">Likes</option>
          <option value="comments">Comments</option>
          <option value="alphabetical">Alphabetically</option>
        </select>
      </div>

      <input
        type="text"
        placeholder="Search (by title or tag)"
        value={searchTag}
        onChange={(e) => setSearchTag(e.target.value)}
        className="search"
      />
      
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
              <button onClick={() => handleUnlikePhoto(photo._id)}>Unlike</button>
            ) : (
              <button onClick={() => handleLikePhoto(photo._id)}>Like</button>
            )}
          </div>

            <p>Tags: {photo.tags.join(", ")}</p>
            <p>
              Added by: <strong>{photo.username || "Anonymous"}</strong>
            </p>

            {/* Comments */}
            <div className="comments">
              <h4>Comments</h4>
              <ul>
                {photo.comments.map((comment) => (
                  <li key={comment._id}>
                    <strong>{comment.username}:</strong> {comment.text}
                    {comment.userId === loggedInUserId && (
                      <button
                        onClick={() => handleDeleteComment(photo._id, comment._id)}
                        className="delete-comment-button"
                      >
                        Delete
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="add-comment">
              <input
                type="text"
                placeholder="Add a comment"
                value={photoComments[photo._id] || ""}
                onChange={(e) =>
                  setPhotoComments({
                    ...photoComments,
                    [photo._id]: e.target.value,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddComment(photo._id, photoComments[photo._id]);
                  }
                }}
              />
              <button onClick={() => handleAddComment(photo._id, photoComments[photo._id])}>
                Post
              </button>
            </div>

            {photo.userId === loggedInUserId && (
              <div className="gallery-actions">
                <button onClick={() => handleEditPhoto(photo)}>Edit</button>
                <button onClick={() => handleDeletePhoto(photo._id)}>Delete</button>
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
              value={currentPhoto.title}
              onChange={(e) =>
                setCurrentPhoto({ ...currentPhoto, title: e.target.value })
              }
            />
            <input
              type="text"
              value={currentPhoto.tags.join(", ")}
              onChange={(e) =>
                setCurrentPhoto({ ...currentPhoto, tags: e.target.value.split(",").map(tag => tag.trim()) })
              }
            />
            <div className="modal-actions">
              <button onClick={handleUpdatePhoto}>Save</button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="statistics">
        <h2>Gallery Statistics</h2>
        <p>Total Photos: {statistics.totalPhotos}</p>
        <p>Total Comments: {statistics.totalComments}</p>
        {statistics.topUser && (
          <p>
            User with the most photos posted: {statistics.topUser.username} ({statistics.topUser.count} photos)
          </p>
        )}
      </div>
    </div>
  );
}