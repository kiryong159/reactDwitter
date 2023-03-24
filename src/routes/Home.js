import React, { useEffect, useState } from "react";
import { dbService } from "../myBase";
import { addDoc, collection, getDocs } from "firebase/firestore";

const Home = () => {
  const [dwit, setDwit] = useState();
  const [dwits, setDwits] = useState([]);
  const getDwits = async () => {
    const dwitsData = await getDocs(collection(dbService, "Dwieet"));
    dwitsData.forEach((document) => {
      const diwtOjb = { ...document.data(), id: document.id };
      setDwits((prev) => [diwtOjb, ...prev]);
    });
  };
  useEffect(() => {
    getDwits();
  }, []);

  const onChange = (event) => {
    setDwit(event.target.value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    await addDoc(collection(dbService, "Dwieet"), {
      Dwieet: dwit,
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
          <li key={item.id}>{item.Dwieet}</li>
        ))}
      </div>
    </div>
  );
};

export default Home;
