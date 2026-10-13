import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  // Access the current location (URL) object
  const { pathname } = useLocation();

  useEffect(() => {
    // Automatically scroll to top (0,0) smoothly whenever pathname changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Use "instant" for page changes, "smooth" for buttons
    });
  }, [pathname]); // This effect runs every time 'pathname' changes

  return null; // This component does not render anything visual
};

export default ScrollToTop;