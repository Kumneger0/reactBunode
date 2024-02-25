import ReactDOM, { hydrateRoot } from "react-dom/client";
//@ts-expect-error
import * as rscDomWebpackClient from "react-server-dom-webpack/client";
const root = ReactDOM.createRoot(document.getElementById("root")!);

// console.log(rscDomWebpackClient);

//@ts-ignore
// rscDomWebpackClient.createFromFetch(fetch("/rsc")).then((comp) => {
//   // console.log(comp);
//   // root.render(comp);
// });

//TODO: make it greate
