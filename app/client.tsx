import React from "react";
import ReactDOM from "react-dom/client";
import { createFromFetch } from "react-server-dom-webpack/client";

const root = ReactDOM.createRoot(document.getElementById("root"));

createFromFetch(fetch("/rsc")).then((comp) => {
  root.render(comp);
});
