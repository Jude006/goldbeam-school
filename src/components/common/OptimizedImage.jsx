// src/components/common/OptimizedImage.jsx

import React, { useState, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const OptimizedImage = ({
  src,
  alt,
  className = "",
  width,
  height,
  effect = "blur",
  placeholderSrc,
  threshold = 100,
}) => {
  const [imageSrc, setImageSrc] = useState(placeholderSrc || src);

  // Use WebP if supported
  useEffect(() => {
    const supportsWebP = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL("image/webp").indexOf("image/webp") === 0;
    };

    // If WebP is supported and image is JPG/PNG, try WebP version
    if (supportsWebP() && src && !src.includes(".webp")) {
      const webpSrc = src.replace(/\.(jpg|jpeg|png)$/, ".webp");
      // Check if webp version exists (optional)
      setImageSrc(webpSrc);
    } else {
      setImageSrc(src);
    }
  }, [src]);

  return (
    <LazyLoadImage
      src={imageSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      effect={effect}
      threshold={threshold}
      placeholderSrc={placeholderSrc}
      loading="lazy"
      wrapperClassName="w-full h-full"
    />
  );
};

export default OptimizedImage;