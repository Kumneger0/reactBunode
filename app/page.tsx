import React, { Suspense } from "react";
import Input from "./input";

async function Page() {
  await new Promise((res) => setTimeout(res, 3000));
  //@ts-ignore
  return (
    <div>
      <div>helle from serve page.tsx file</div>
      <Input />
    </div>
  );
}

export default Page;

async function Todos() {
  const todos = (await fetch("https://jsonplaceholder.typicode.com/todos").then(
    (res) => res.json()
  )) as Record<string, string>[];
  return (
    <div>
      {todos.map((todo) => (
        <div>
          <div>{todo.title}</div>
          <input
            type="checkbox"
            defaultChecked={todo.completed as unknown as boolean}
          />
        </div>
      ))}
    </div>
  );
}
