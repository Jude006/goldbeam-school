import React from "react";
import GallerySection from "../../components/gallery/GallerySection";
import SEO from "../../components/common/SEO";

const Gallery = () => {
  return (
    <>
      <SEO
        title="School Gallery - Photos & Events"
        description="Explore photos and events from Amazing Grace Academy showcasing our students, facilities, and school activities."
        keywords="school gallery, Marian Foundation Academy photos, school events, students activities"
        url="/gallery"
        tags={["gallery", "photos", "events", "students", "activities"]}
      />
      <GallerySection />
    </>
  );
};

export default Gallery;
