import React, { Suspense } from "react";

async function Page() {
  return (
      <Todos />;
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
            checked={todo.completed as unknown as boolean}
          />
        </div>
      ))}
    </div>
  );
}
