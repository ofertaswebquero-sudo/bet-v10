import { createRoot } from "react-dom/client";
import "./index.css";

console.log("[v0] main.tsx: starting import chain");

async function boot() {
  try {
    console.log("[v0] main.tsx: importing App");
    const { default: App } = await import("./App.tsx");
    console.log("[v0] main.tsx: App imported successfully");

    const { initGlobalLogging } = await import("./hooks/useLogs");
    initGlobalLogging();
    console.log("[v0] main.tsx: initGlobalLogging done");

    const root = document.getElementById("root");
    console.log("[v0] main.tsx: root element:", root);
    createRoot(root!).render(<App />);
    console.log("[v0] main.tsx: rendered successfully");
  } catch (err) {
    console.error("[v0] main.tsx: BOOT ERROR:", err);
    const root = document.getElementById("root");
    if (root) {
      root.innerHTML = `<pre style="color:red;padding:2rem;">${err}\n${(err as any)?.stack}</pre>`;
    }
  }
}

boot();
