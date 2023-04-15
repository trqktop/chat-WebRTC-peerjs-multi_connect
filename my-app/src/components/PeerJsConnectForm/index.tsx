import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectToPeer } from "../../store/store";
import "./PeerJsConnectForm.css";
const PeerJsConnectForm = () => {
  const inputId = useRef<HTMLInputElement>(null);
  const peerId = useSelector((state: any) => state.chat.peerId);
  const dispatch = useDispatch();
  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    // if (inputId.current?.value) {
      dispatch(connectToPeer(''));
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

  return (
    <form onSubmit={submitHandler} className="peerjs-form">
      <span className="peerjs-form__id" onClick={copyHandler}>
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
