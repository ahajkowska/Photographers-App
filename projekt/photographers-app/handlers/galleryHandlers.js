export const handleAddPhoto = async (e, newPhoto, loggedInUserId, loggedInUsername, dispatch, state, setNewPhoto,calculateStatistics) => {
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
      setNewPhoto({ title: "", image: "", tags: [] }); // reset form
      calculateStatistics([...state.photos, updatedPhoto]);
    } else {
      console.error("Failed to add photo");
    }
};

export const handleDeletePhoto = async (photoId, dispatch, state, calculateStatistics) => {
    const url = `/api/photos/${photoId}`;
    console.log("DELETE Request URL:", url);
  
    const response = await fetch(url, { method: "DELETE" });
  
    if (response.ok) {
      console.log("Photo deleted successfully");
      dispatch({ type: "DELETE_PHOTO", payload: photoId });
      calculateStatistics(state.photos.filter((photo) => photo._id !== photoId)); // update statistics after deletion
    } else {
      const errorText = await response.text();
      console.error("Failed to delete photo:", errorText);
    }
};  

export const handleEditPhoto = (photo, setCurrentPhoto, setIsModalOpen) => {
    setCurrentPhoto(photo);
    setIsModalOpen(true);
};

export const handleUpdatePhoto = async (currentPhoto, dispatch, setIsModalOpen, setCurrentPhoto, state) => {
  try {
    const existingPhoto = state.photos.find(photo => photo._id === currentPhoto._id);

    const response = await fetch(`/api/photos/${currentPhoto._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: currentPhoto.title,
        tags: currentPhoto.tags,
        username: existingPhoto?.username || currentPhoto.username,
      }),
    });
    if (!response.ok) {
      console.error("Failed to update photo");
      return;
    }

    const updatedPhoto = await response.json();

    const photoWithUsername = {
      ...updatedPhoto,
      username: existingPhoto?.username || currentPhoto.username, 
    };

    dispatch({ type: "UPDATE_PHOTO", payload: photoWithUsername });
    setIsModalOpen(false);
    setCurrentPhoto(null);
  } catch (error) {
    console.error("Error updating photo:", error);
  }
};

export const handleLikePhoto = async (photoId, loggedInUserId, dispatch, state) => {
  try {
    const response = await fetch(`/api/photos/${photoId}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: loggedInUserId }),
    });

    if (response.ok) {
      const updatedPhoto = await response.json();
      const photoWithUsername = {
        ...updatedPhoto,
        username: state.photos.find((photo) => photo._id === photoId).username,
      };
      dispatch({ type: "UPDATE_PHOTO", payload: photoWithUsername });
    } else {
      console.error("Failed to like photo");
    }
  } catch (error) {
    console.error("Error liking photo:", error);
  }
};

export const handleUnlikePhoto = async (photoId, loggedInUserId, dispatch, state) => {
  try {
    const response = await fetch(`/api/photos/${photoId}/like`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: loggedInUserId }),
    });

    if (response.ok) {
      const updatedPhoto = await response.json();
      const photoWithUsername = {
        ...updatedPhoto,
        username: state.photos.find((photo) => photo._id === photoId).username,
      };
      dispatch({ type: "UPDATE_PHOTO", payload: photoWithUsername });
    } else {
      console.error("Failed to unlike photo");
    }
  } catch (error) {
    console.error("Error unliking photo:", error);
  }
};