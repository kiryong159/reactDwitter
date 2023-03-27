import React, { useRef, useState } from "react";
import { dbService } from "../myBase";
import { addDoc, collection } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";

const NwwetFactory = ({ userObj }) => {
  const [dwit, setDwit] = useState("");
  const [imgUrl, setImgUrl] = useState(null);
  const imgInput = useRef();

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
    <form onSubmit={onSubmit} className="factoryForm">
      <input
        value={dwit}
        type="text"
        placeholder="Write.."
        onChange={onChange}
        className="factoryInput"
      />
      <label htmlFor="factoryFile">
        <span className="factoryLabelBtn">이미지 첨부하기</span>
      </label>
      <input
        id="factoryFile"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        ref={imgInput}
        className="factoryFile"
      />

      <div>
        {imgUrl && (
          <div className="factoryImgbox">
            <img src={imgUrl} width="100px" height="100px" alt={"1"} />
            <div>
              <button onClick={onClearImg} className="cancleBtn">
                사진 취소
              </button>
            </div>
          </div>
        )}
      </div>
      <input type="submit" value="Dwit" className="submitBtn" />
    </form>
  );
};

export default NwwetFactory;
