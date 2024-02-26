import React from "react";

function About({ searchParams }: { searchParams: URL["searchParams"] }) {
  return <div>{searchParams.get("name")}</div>;
}

export default About;
