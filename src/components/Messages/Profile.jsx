import React from "react";

const Profile = ({ toggleProfile, openCloseHandler }) => {
  return (
    <div
      className="text-white bg-black pointer-events-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <p>Profile</p>
      <button onClick={openCloseHandler}>Profile</button>
    </div>
  );
};

export default Profile;
