import React from "react";
import "./Gallery.css";

function Gallery({ items }) {
  return (
    <div className="gallery">
      {items.map((item, index) => (
        <div className="gallery-item" key={index}>
          <img src={item.image} alt={item.title} />
          <h3>{item.title}</h3>
        </div>
      ))}
    </div>
  );
}

export default Gallery;
