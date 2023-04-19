import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectToPeer } from "../../store/store";
import { RootState } from "../../types/chat";
import "./PeerJsConnectForm.css";
const PeerJsConnectForm = () => {
  const inputId = useRef<HTMLInputElement>(null);
  const isWebCreator = useSelector((state: RootState) => state.chat.WEBcreator);
  const isConnected = useSelector((state: RootState) => state.chat.connected);
  const dispatch = useDispatch();

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputId.current?.value.length) {
      dispatch(connectToPeer(inputId.current?.value));
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

  const connectIndicator =
    isConnected && isWebCreator ? (
      <span style={{ color: "rgb(120, 177, 120)" }}>"WEB CREATOR"</span>
    ) : (
      <span style={{ color: isConnected ? "rgb(120, 177, 120)" : "white" }}>
        "CONNECT"
      </span>
    );

  return (
    <form onSubmit={submitHandler} className="peerjs-form">
      <span className="peerjs-form__id" onClick={copyHandler}>
        {connectIndicator}
      </span>
      <fieldset
        className="peerjs-form__fieldset"
        disabled={isConnected}
        style={isConnected ? { opacity: ".3" } : {}}
      >
        <input
          className="peerjs-form__input"
          ref={inputId}
          placeholder="enter id..."
        ></input>
        <button
          disabled={isConnected}
          className="peerjs-form__sbmt"
          style={
            isConnected ? { pointerEvents: "none" } : { pointerEvents: "all" }
          }
        >
          Connect...
        </button>
      </fieldset>
    </form>
  );
};

export default PeerJsConnectForm;
