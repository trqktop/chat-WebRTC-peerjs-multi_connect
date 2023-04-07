import { useRef } from "react";
import { useDispatch } from "react-redux";
import { connectToPeer } from "../../redux/store";
import "./PeerJsConnectForm.css";
const PeerJsConnectForm = () => {
  const inputId = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputId.current?.value) {
      dispatch(connectToPeer(inputId.current.value));
    }
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
        92fa63e6-6ed4-4216-8ec3-5798b0306038main
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
