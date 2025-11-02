import React, { useEffect, useState } from "react";

const PortalBackground = ({ children, openCloseHandler }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable scrolling
    document.body.style.overflow = "hidden";

    const timeoutId = setTimeout(() => setIsVisible(true), 10);

    return () => {
      // Re-enable scrolling when backdrop is removed
      document.body.style.overflow = "";
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section
      className={`fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={openCloseHandler}
    >
      {children}
    </section>
  );
};

export default PortalBackground;
