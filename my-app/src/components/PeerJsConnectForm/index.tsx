import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectToPeer } from "../../store/store";
import { RootState } from "../../types/chat";
import "./PeerJsConnectForm.css";
const PeerJsConnectForm = () => {
  const inputId = useRef<HTMLInputElement>(null);
  const peerId = useSelector((state: any) => state.chat.peerId);
  const isWebCreator = useSelector((state: RootState) => state.chat.WEBcreator);

  const dispatch = useDispatch();
  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    // if (inputId.current?.value) {
    dispatch(connectToPeer(inputId.current?.value));
    // }
  };

  const copyHandler = (e: any) => {
    navigator.clipboard
      .writeText(e.target.textContent)
      .then(() => {
        console.log("Text copied to clipboard");
      })
      .catch((err) => {
        console.log("Something went wrong", err);
      });
  };

  const color = isWebCreator ? "red" : "white";
  return (
    <form onSubmit={submitHandler} className="peerjs-form">
      <span
        style={{ color: color }}
        className="peerjs-form__id"
        onClick={copyHandler}
      >
        {peerId}
      </span>
      <input
        className="peerjs-form__input"
        ref={inputId}
        placeholder="enter id..."
      ></input>
      <button className="peerjs-form__sbmt">Connect...</button>
    </form>
  );
};

export default PeerJsConnectForm;
