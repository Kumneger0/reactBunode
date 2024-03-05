import { renderToString } from "react-dom/server";

export function sendNotFoundHTML() {
  const string = renderToString(<APINoutFOundPage />);
  return new Response(string, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}

function APINoutFOundPage() {
  return (
    <html>
      <body
        style={{
          width: "100dvw",
          height: "100dvh",
          backgroundColor: "black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}>
        <h1
          style={{
            color: "white",
          }}>
          404 | NOT FOUND
        </h1>
      </body>
    </html>
  );
}
