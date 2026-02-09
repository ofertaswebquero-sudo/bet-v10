import { createRoot } from "react-dom/client";
import "./index.css";

console.log("[v0] main.tsx: starting import tests");

const modules = [
  ["@/components/ui/tooltip", () => import("@/components/ui/tooltip")],
  ["@tanstack/react-query", () => import("@tanstack/react-query")],
  ["react-router-dom", () => import("react-router-dom")],
  ["@/components/theme-provider", () => import("@/components/theme-provider")],
  ["./pages/DashboardPage", () => import("./pages/DashboardPage")],
  ["./pages/CasasPage", () => import("./pages/CasasPage")],
  ["./pages/DiarioPage", () => import("./pages/DiarioPage")],
  ["./pages/CaixaGeralPage", () => import("./pages/CaixaGeralPage")],
  ["./pages/SaquesAportesPage", () => import("./pages/SaquesAportesPage")],
  ["./pages/ApostasPage", () => import("./pages/ApostasPage")],
  ["./pages/SurebetsPage", () => import("./pages/SurebetsPage")],
  ["./pages/FechamentoPage", () => import("./pages/FechamentoPage")],
  ["./pages/DadosReferenciaPage", () => import("./pages/DadosReferenciaPage")],
  ["./pages/ResultadosPage", () => import("./pages/ResultadosPage")],
  ["./pages/ConfiguracoesPage", () => import("./pages/ConfiguracoesPage")],
  ["./pages/GestaoEstrategicaPage", () => import("./pages/GestaoEstrategicaPage")],
  ["./pages/AnaliseEstrategiasPage", () => import("./pages/AnaliseEstrategiasPage")],
  ["./pages/BancaPage", () => import("./pages/BancaPage")],
  ["./pages/PlanilhaPage", () => import("./pages/PlanilhaPage")],
  ["./pages/CassinoPage", () => import("./pages/CassinoPage")],
  ["./pages/DocumentacaoPage", () => import("./pages/DocumentacaoPage")],
  ["./pages/GoogleSheetsConfigPage", () => import("./pages/GoogleSheetsConfigPage")],
  ["./pages/LogsPage", () => import("./pages/LogsPage")],
  ["./pages/NotFound", () => import("./pages/NotFound")],
  ["./hooks/useLogs", () => import("./hooks/useLogs")],
] as [string, () => Promise<unknown>][];

async function boot() {
  const errors: string[] = [];
  for (const [name, loader] of modules) {
    try {
      await loader();
      console.log("[v0] OK:", name);
    } catch (err: any) {
      console.error("[v0] FAIL:", name, err);
      errors.push(`${name}: ${err.message || err}`);
    }
  }

  const root = document.getElementById("root");
  if (errors.length > 0) {
    root!.innerHTML = `<pre style="color:red;padding:2rem;font-size:14px;white-space:pre-wrap;">IMPORT ERRORS:\n\n${errors.join("\n\n")}</pre>`;
  } else {
    console.log("[v0] All imports OK, rendering App");
    const { default: App } = await import("./App.tsx");
    const { initGlobalLogging } = await import("./hooks/useLogs");
    initGlobalLogging();
    createRoot(root!).render(<App />);
  }
}

boot();
