import App from "./App";
import React from "react";
import ReactDOM from "react-dom";
import { LoadingProvider } from "./Context/LoadingProvider";

ReactDOM.render(
  <React.StrictMode>
    <LoadingProvider>
      <App />
    </LoadingProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
