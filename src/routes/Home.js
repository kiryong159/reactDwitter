import React, { useEffect, useRef, useState } from "react";
import Dweet from "../components/Dweet";
import { dbService } from "../myBase";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";

const Home = ({ userObj }) => {
  const [dwit, setDwit] = useState("");
  const [dwits, setDwits] = useState([]);
  const [imgUrl, setImgUrl] = useState(null);
  const imgInput = useRef();

  useEffect(() => {
    onSnapshot(collection(dbService, "Dwieet"), (snap) => {
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
    if (imgUrl === null) {
      if (dwit === "") {
        event.preventDefault();
        return;
      }
    }
    event.preventDefault();
    let fileUrl = "";
    if (imgUrl) {
      const sotrage = getStorage();
      const fileRef = ref(sotrage, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(fileRef, imgUrl, "data_url");
      fileUrl = await getDownloadURL(fileRef, response);
    }
    const DwietObj = {
      text: dwit,
      creatorId: userObj.uid,
      fileUrl,
      createAt: new Date(),
    };
    await addDoc(collection(dbService, "Dwieet"), DwietObj);
    setDwit("");
    onClearImg();
  };

  const onFileChange = (event) => {
    const FileData = event.target.files[0];
    if (FileData) {
      const reader = new FileReader();
      reader.onloadend = (finishEvent) => {
        setImgUrl(finishEvent.target.result);
      };
      reader.readAsDataURL(FileData);
    }
  };
  const onClearImg = () => {
    setImgUrl(null);
    imgInput.current.value = null;
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
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={imgInput}
        />
        <input type="submit" value="Dwit" />
        <div>
          {imgUrl && (
            <>
              <img src={imgUrl} width="50px" height="50px" alt={imgUrl} />
              <div>
                <button onClick={onClearImg}>Clear</button>
              </div>
            </>
          )}
        </div>
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
