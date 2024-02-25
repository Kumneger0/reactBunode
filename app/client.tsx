import ReactDOM, { hydrateRoot } from "react-dom/client";
import { createFromFetch } from "react-server-dom-webpack/client";
const root = ReactDOM.createRoot(document.getElementById("root")!);

createFromFetch(fetch("/rsc")).then((comp) => {
  console.log(comp);
  root.render(comp);
});

console.log("fff");

//TODO: fix Suspenc on server

//TODO: stream server componet

//TODO: make it greate
