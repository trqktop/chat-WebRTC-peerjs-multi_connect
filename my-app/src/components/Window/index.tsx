import { useSelector } from "react-redux";
import Messages from "../../containers/MessagesContainer";
import "./Window.css";
import PeerJsConnectForm from "../PeerJsConnectForm";

const Window = () => {
  return (
    <section className="window">
      <PeerJsConnectForm />
      <Messages />
    </section>
  );
};

export default Window;
