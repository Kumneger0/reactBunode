import React from "react";
import Input from "./input";

async function Page() {
  await new Promise((res) => setTimeout(res, 3000));
  return (
    <div>
      home page
      <Input />
    </div>
  );
}

export default Page;
