"use client";

import React, { useState } from "react";

function Input() {
  const [name, setName] = useState<string>();
  return (
    <input value={name} onChange={(e) => setName(e.currentTarget.value)} />
  );
}

export default Input;
