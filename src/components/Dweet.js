import React, { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { dbService } from "../myBase";
import { deleteObject, getStorage, ref } from "firebase/storage";
//fontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const Dweet = ({ dwits, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newDweet, setNewDweet] = useState(dwits.text);
  const storage = getStorage();
  const onDeleteClick = async () => {
    const ok = window.confirm("really?");
    if (ok) {
      await deleteDoc(doc(dbService, "Dwieet", dwits.id));
      if (dwits.fileUrl !== "") {
        const deleteRef = ref(storage, dwits.fileUrl);
        await deleteObject(deleteRef);
      }
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
    <div className="dwitBox">
      <div className="dwitText-Edit-Delete-Box">
        <h3>
          {dwits.text.length < 85
            ? dwits.text
            : `${dwits.text.slice(0, 84)}...`}
        </h3>
        {isOwner && (
          <>
            {editing ? (
              <div className="editBox">
                <form onSubmit={onSubmit}>
                  <input
                    type="text"
                    placeholder="write Dweet"
                    required
                    value={newDweet}
                    onChange={onChange}
                    className="editInput"
                  />
                  <input type="submit" value="Edit" className="editSubmitBtn" />
                </form>
                <button onClick={toggelBtn} className="editCanceltBtn">
                  Cancel
                </button>
              </div>
            ) : (
              <div className="Edit-DeleteBtn-Box">
                <button onClick={toggelBtn}>
                  <FontAwesomeIcon icon={faPenToSquare} />
                </button>
                <button onClick={onDeleteClick}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
      {dwits.fileUrl && <img src={dwits.fileUrl} alt={dwits.fileUrl} />}
    </div>
  );
};

export default Dweet;
