import React, { Suspense } from "react";

function RootLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={"loading todos"}>{children}</Suspense>;
}

export default RootLayout;
