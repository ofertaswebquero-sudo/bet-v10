"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const App = dynamic(() => import("@/App"), {
  ssr: false,
  loading: () => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "white", background: "hsl(220 20% 6%)" }}>
      <p>Carregando BetBalance Boss...</p>
    </div>
  ),
});

export default function CatchAllPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log("[v0] CatchAllPage mounted");
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "white", background: "hsl(220 20% 6%)" }}>
        <p>Iniciando...</p>
      </div>
    );
  }

  return <App />;
}
