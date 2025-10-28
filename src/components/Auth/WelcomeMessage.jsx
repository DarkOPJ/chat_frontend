import React from "react";

const WelcomeMessage = ({children}) => {
  return (
    <div className="hidden md:block content-end">
      <div className="px-12 pb-20 md:block">
        {children}
      </div>
    </div>
  );
};

export default WelcomeMessage;
