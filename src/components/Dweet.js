import React from "react";

const Dweet = ({ dwits, isOwner }) => {
  return (
    <div>
      <h3>{dwits.text}</h3>
      {isOwner && (
        <>
          <button>Delete</button>
          <button>Edit</button>
        </>
      )}
    </div>
  );
};

export default Dweet;
