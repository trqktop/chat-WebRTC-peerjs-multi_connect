import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import "./index.css";
import App from "./components/App";

const container = document.getElementById("root")!;
const root = createRoot(container);
//  "proxy": "http://192.168.2.225:8888" my
//  "proxy": "http://192.168.2.159:8000"

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
