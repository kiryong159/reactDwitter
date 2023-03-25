import React, { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { dbService } from "../myBase";

const Dweet = ({ dwits, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newDweet, setNewDweet] = useState(dwits.text);
  const onDeleteClick = async () => {
    const ok = window.confirm("really?");
    if (ok) {
      await deleteDoc(doc(dbService, "Dwieet", dwits.id));
    }
  };

  const toggelBtn = () => {
    setEditing((current) => !current);
  };

  const onChange = (e) => {
    const { value } = e.target;
    setNewDweet(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const docRef = doc(dbService, "Dwieet", dwits.id);
    await updateDoc(docRef, { text: newDweet });
    toggelBtn();
  };
  return (
    <div>
      <h3>{dwits.text}</h3>
      {isOwner && (
        <>
          {editing ? (
            <>
              <form onSubmit={onSubmit}>
                <input
                  type="text"
                  placeholder="write Dweet"
                  required
                  value={newDweet}
                  onChange={onChange}
                />
                <input type="submit" value="edit" />
              </form>
              <button onClick={toggelBtn}>Cancel</button>
            </>
          ) : (
            <>
              <button onClick={onDeleteClick}>Delete</button>
              <button onClick={toggelBtn}>Edit</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Dweet;
