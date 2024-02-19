import React from "react";
import ReactDOM from "react-dom/client";
import { createFromFetch } from "react-server-dom-webpack/client";

const root = ReactDOM.createRoot(document.getElementById("root"));

try {
  createFromFetch(fetch("/rsc")).then((comp) => {
    console.log(comp);
    root.render(comp);
  });
} catch (err) {
  console.error(err);
}
