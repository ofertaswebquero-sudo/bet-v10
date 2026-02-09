"use client";

import dynamic from "next/dynamic";

// Dynamically import the entire SPA to avoid SSR issues with react-router-dom
const App = dynamic(() => import("@/App"), { ssr: false });

export default function CatchAllPage() {
  return <App />;
}
