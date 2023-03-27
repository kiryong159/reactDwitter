import React, { useEffect, useState } from "react";
import Dweet from "../components/Dweet";
import { dbService } from "../myBase";
import { collection, onSnapshot } from "firebase/firestore";
import NwwetFactory from "../components/DweetFactory";

const Home = ({ userObj }) => {
  const [dwits, setDwits] = useState([]);

  useEffect(() => {
    onSnapshot(collection(dbService, "Dwieet"), (snap) => {
      const dwitsArray = snap.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));
      setDwits(dwitsArray);
    });
  }, []);

  return (
    <div>
      <NwwetFactory userObj={userObj} />
      <div className="diwtsBigBox">
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
