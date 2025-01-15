import React from "react";
import Gallery from "../../components/Gallery/Gallery";

function GalleryPage() {
  const galleryItems = [
    { image: "/assets/images/sample1.jpg", title: "Sunset" },
    { image: "/assets/images/sample2.jpg", title: "Mountain" },
  ];

  return (
    <div>
      <h1>Gallery</h1>
      <Gallery items={galleryItems} />
    </div>
  );
}

export default GalleryPage;
