import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log("[v0] main.tsx loaded, attempting to render App");

try {
  const root = document.getElementById("root");
  console.log("[v0] root element found:", !!root);
  if (root) {
    createRoot(root).render(<App />);
    console.log("[v0] App rendered successfully");
  }
} catch (error) {
  console.error("[v0] Error rendering app:", error);
}
