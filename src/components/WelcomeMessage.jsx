import React from "react";

const WelcomeMessage = ({children}) => {
  return (
    <div className=" content-end">
      <div className="px-12 pb-20">
        {children}
      </div>
    </div>
  );
};

export default WelcomeMessage;
