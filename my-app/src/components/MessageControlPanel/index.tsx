import React from "react";
import "./MessageControlPanel.css";
// import { replyMessage } from "../../store/store";
import { useDispatch } from "react-redux";

const MessageControlPanel = ({ message }: any) => {
  const dispatch = useDispatch();
  const clickHandler = (e: any) => {
    // delete message?.file?.src
    // dispatch(replyMessage(message));
  };
  return (
    <div className="control-panel">
      <ul className="control-panel__items">
        {/* <li className="control-panel__item">
          <span className="control-panel__thread-count">6</span>
          <svg
            className="message__thread-button"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
          >
            <path
              fill="rgb(165, 165, 165)"
              d="M4 4h16v12H5.17L4 17.17V4m0-2c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H4zm2 10h12v2H6v-2zm0-3h12v2H6V9zm0-3h12v2H6V6z"
            />
          </svg>
        </li> */}
        <li className="control-panel__item" onClick={clickHandler}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="19"
            viewBox="0 0 32 32"
          >
            <path
              fill="currentColor"
              d="M28.88 30a1 1 0 0 1-.88-.5A15.19 15.19 0 0 0 15 22v6a1 1 0 0 1-.62.92a1 1 0 0 1-1.09-.21l-12-12a1 1 0 0 1 0-1.42l12-12a1 1 0 0 1 1.09-.21A1 1 0 0 1 15 4v6.11a17.19 17.19 0 0 1 15 17a16.34 16.34 0 0 1-.13 2a1 1 0 0 1-.79.86ZM14.5 20A17.62 17.62 0 0 1 28 26a15.31 15.31 0 0 0-14.09-14a1 1 0 0 1-.91-1V6.41L3.41 16L13 25.59V21a1 1 0 0 1 1-1h.54Z"
            />
          </svg>
          {/* <span className="control-panel__item-title">
            reply
          </span> */}
        </li>
      </ul>
    </div>
  );
};
export default MessageControlPanel;
