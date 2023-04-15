import { sendMessage } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import nameGenerator from "../../utils/nameGenerator";
import ReplyPanel from "../ReplyPanel";
import toBase64 from "../../utils/formater/toBase64";
import "./Form.css";

const Form = () => {
  const [messageInputValue, setMessageInputValue] = useState("");
  const [filePath, setFilePath] = useState(null);
  // const reply = useSelector((state: RootState) => state.chat.reply);
  const messageInput: any = useRef(null);
  const fileInput: any = useRef(null);
  const file: any = useRef(null);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const randomName = nameGenerator();
  //   dispatch(sendName(randomName));
  // }, []);

  const sendMessageWithFiles = () =>
  // fileInput: any,
  // setFilePath: React.SetStateAction<any>
  {
    // const file = fileInput.files[0];
    toBase64(file.current).then((url) => {
      // const fileData = {
      //   src: url,
      //   type: file.type,
      // };
      const fileData: any = {
        src: url,
        type: file.current.type,
      };
      dispatch(sendMessage({ message: messageInputValue, file: fileData })); //reply
    });
    // setFilePath(null);

    // dispatch(sendMessage(messageInputValue));
  };

  const sendMessageWithoutFiles = () => {
    dispatch(sendMessage({ message: messageInputValue }));
    setMessageInputValue("");
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (messageInputValue && !file.current) {
      sendMessageWithoutFiles();
    }
    if (file.current) {
      sendMessageWithFiles();
      fileInput.current.value = null;
    }

    // const text = e.target[0].value;
    // const fileInput = e.target[1];
    // if (text.length >= 1 && fileInput.value.length < 1) {
    //   sendMessageWithoutFiles(e);
    // } else if (fileInput.value.length > 1) {
    //   sendMessageWithFiles(fileInput, setFilePath);
    // }
    // dispatch(replyMessage(null));
    // fileInput.value = "";
    setMessageInputValue("");
    setFilePath(null);
  };
  const handleFilePick = (e: any) => {
    const filePath = e.target.files[0].name;
    file.current = fileInput.current.files[0];
    setFilePath(filePath);
  };

  return (
    <section className="form-container">
      <ReplyPanel />
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          ref={messageInput}
          value={messageInputValue}
          className="form__input"
          onChange={(e) => setMessageInputValue(e.target.value)}
          placeholder="Type your message..."
        ></input>
        <div className="form__button-group">
          <label className="form__input-file-label">
            <input
              name="file"
              type="file"
              onChange={handleFilePick}
              ref={fileInput}
            />
            <span className="form__input-label-text">
              <span>{filePath}</span>
              <span className="form__input-svg-container">
                <svg
                  className="form__input-svg"
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 1025 1024"
                >
                  <path d="M779.909 196.6C685.709 102.4 532.309 102.4 438.209 196.6L177.209 457.4C175.509 459.1 174.609 461.4 174.609 463.8C174.609 466.2 175.509 468.5 177.209 470.2L214.109 507.1C215.796 508.779 218.079 509.722 220.459 509.722C222.84 509.722 225.123 508.779 226.809 507.1L487.809 246.3C520.209 213.9 563.309 196.1 609.109 196.1C654.909 196.1 698.009 213.9 730.309 246.3C762.709 278.7 780.509 321.8 780.509 367.5C780.509 413.3 762.709 456.3 730.309 488.7L464.309 754.6L421.209 797.7C380.909 838 315.409 838 275.109 797.7C255.609 778.2 244.909 752.3 244.909 724.7C244.909 697.1 255.609 671.2 275.109 651.7L539.009 387.9C545.709 381.3 554.509 377.6 563.909 377.6H564.009C573.409 377.6 582.109 381.3 588.709 387.9C595.409 394.6 599.009 403.4 599.009 412.8C599.009 422.1 595.309 430.9 588.709 437.5L373.009 653C371.309 654.7 370.409 657 370.409 659.4C370.409 661.8 371.309 664.1 373.009 665.8L409.909 702.7C411.596 704.379 413.879 705.322 416.259 705.322C418.639 705.322 420.923 704.379 422.609 702.7L638.209 487.1C658.109 467.2 669.009 440.8 669.009 412.7C669.009 384.6 658.009 358.1 638.209 338.3C597.109 297.2 530.309 297.3 489.209 338.3L463.609 364L225.409 602.1C209.242 618.172 196.427 637.294 187.707 658.357C178.987 679.419 174.535 702.004 174.609 724.8C174.609 771.1 192.709 814.6 225.409 847.3C259.309 881.1 303.709 898 348.109 898C392.509 898 436.909 881.1 470.709 847.3L779.909 538.3C825.409 492.7 850.609 432 850.609 367.5C850.709 302.9 825.509 242.2 779.909 196.6Z" />
                </svg>
              </span>
            </span>
          </label>
          <button type="submit" className="form__submit">
            Send
          </button>
        </div>
      </form>
    </section>
  );
};

export default Form;
