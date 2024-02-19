import React from "react";

async function Page() {
  await new Promise((res) => setTimeout(res, 2000));
  return <div>page</div>;
}

export default Page;
