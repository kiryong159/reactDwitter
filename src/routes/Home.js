import React, { useState } from "react";
import { dbService } from "../myBase";
import { addDoc, collection } from "firebase/firestore";

const Home = () => {
  const [dwit, setDwit] = useState();
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
    </div>
  );
};

export default Home;
