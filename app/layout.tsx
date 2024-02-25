import React, { Suspense } from "react";

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body id="root">{children}</body>
    </html>
  );
}

export default RootLayout;
