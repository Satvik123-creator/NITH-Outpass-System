import React from "react";

const AuthCard = ({ children, className = "" }) => {
  return (
    <div className={`w-full max-w-md ${className}`}>
      <div className="bg-card-bg rounded-xl shadow-lg p-6">{children}</div>
    </div>
  );
};

export default AuthCard;
