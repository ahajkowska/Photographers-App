import React, { useState } from 'react';

export default function Comments({ photo, loggedInUserId, handleAddComment, handleDeleteComment }) {
  const [photoComments, setPhotoComments] = useState({});

  const addComment = (photoId, commentText) => {
    handleAddComment(photoId, commentText);
    setPhotoComments((prevComments) => ({
      ...prevComments,
      [photoId]: "", // clear the input
    }));
  };

  return (
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
              addComment(photo._id, photoComments[photo._id]);
            }
          }}
        />
        <button onClick={() => addComment(photo._id, photoComments[photo._id])}>
          Post
        </button>
      </div>
    </div>
  );
}
