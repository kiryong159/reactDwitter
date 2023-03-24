import React, { useEffect, useState } from "react";
import Dweet from "../components/Dweet";
import { dbService } from "../myBase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";

const Home = ({ userObj }) => {
  const [dwit, setDwit] = useState("");
  const [dwits, setDwits] = useState([]);

  useEffect(() => {
    const snapShot = onSnapshot(collection(dbService, "Dwieet"), (snap) => {
      const dwitsArray = snap.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));
      setDwits(dwitsArray);
    });
  }, []);

  const onChange = (event) => {
    const { value } = event.target;
    setDwit(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    await addDoc(collection(dbService, "Dwieet"), {
      text: dwit,
      creatorId: userObj.uid,
    });
    setDwit("");
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={dwit}
          type="text"
          placeholder="Write.."
          onChange={onChange}
        />
        <input type="submit" value="Dwit" />
      </form>
      <div>
        {dwits.map((item) => (
          <Dweet
            key={item.id}
            dwits={item}
            isOwner={userObj.uid === item.creatorId}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
