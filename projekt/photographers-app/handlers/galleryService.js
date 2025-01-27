export const fetchUsers = async () => {
  try {
    const response = await fetch("/api/users", {
        method: "GET",
      });
    if (!response.ok) throw new Error("Failed to fetch users");
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

export const fetchPhotos = async (userMap, dispatch, calculateStatistics) => {
  try {
    const response = await fetch("/api/photos");
    if (!response.ok) throw new Error("Failed to fetch photos");
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