import {useSelector } from "react-redux";
import Messages from "../Messages";

import "./Window.css";
import PeerJsConnectForm from "../PeerJsConnectForm";

const Window = () => {
  const id = useSelector((state: any) => state.chat.peerId);
  return (
    <section className="window">
      <div className="peerId">{id}</div>
      <PeerJsConnectForm />
      <Messages />
    </section>
  );
};

export default Window;
