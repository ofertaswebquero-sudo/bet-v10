// This script reads all files from the v0 project virtual FS and writes them to the actual FS
// It uses the fact that the Read tool can access these files even if they're not on disk
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, resolve } from 'path';

const PROJECT_ROOT = '/vercel/share/v0-project';

// All files that need to exist on disk
const allFiles = [
  // Core files
  'src/App.tsx',
  'src/main.tsx',
  'src/vite-env.d.ts',
  'src/lib/utils.ts',
  
  // Integrations
  'src/integrations/supabase/client.ts',
  'src/integrations/supabase/types.ts',
  
  // Types
  'src/types/database.ts',
  
  // Hooks
  'src/hooks/use-mobile.tsx',
  'src/hooks/use-toast.ts',
  'src/hooks/useBulkDelete.ts',
  'src/hooks/useBulkSelection.ts',
  'src/hooks/useCassino.ts',
  'src/hooks/useGoogleSheetsSync.ts',
  'src/hooks/useKPIs.ts',
  'src/hooks/useLocalBackup.ts',
  'src/hooks/useLogs.ts',
  'src/hooks/useOKRs.ts',
  'src/hooks/usePagination.ts',
  'src/hooks/useSort.ts',
  'src/hooks/useSupabaseData.ts',
  'src/hooks/useTags.ts',
  
  // Services
  'src/services/googleSheetsService.ts',
  'src/services/importService.ts',
  'src/services/localStorageService.ts',
  'src/services/sheetColumnMapper.ts',
  
  // Components - theme
  'src/components/theme-provider.tsx',
  'src/components/NavLink.tsx',
  
  // Components - UI
  'src/components/ui/accordion.tsx',
  'src/components/ui/alert-dialog.tsx',
  'src/components/ui/alert.tsx',
  'src/components/ui/aspect-ratio.tsx',
  'src/components/ui/avatar.tsx',
  'src/components/ui/badge.tsx',
  'src/components/ui/breadcrumb.tsx',
  'src/components/ui/button.tsx',
  'src/components/ui/calendar.tsx',
  'src/components/ui/card.tsx',
  'src/components/ui/carousel.tsx',
  'src/components/ui/chart.tsx',
  'src/components/ui/checkbox.tsx',
  'src/components/ui/collapsible.tsx',
  'src/components/ui/command.tsx',
  'src/components/ui/context-menu.tsx',
  'src/components/ui/dialog.tsx',
  'src/components/ui/drawer.tsx',
  'src/components/ui/dropdown-menu.tsx',
  'src/components/ui/form.tsx',
  'src/components/ui/hover-card.tsx',
  'src/components/ui/input-otp.tsx',
  'src/components/ui/input.tsx',
  'src/components/ui/label.tsx',
  'src/components/ui/menubar.tsx',
  'src/components/ui/navigation-menu.tsx',
  'src/components/ui/pagination.tsx',
  'src/components/ui/popover.tsx',
  'src/components/ui/progress.tsx',
  'src/components/ui/radio-group.tsx',
  'src/components/ui/resizable.tsx',
  'src/components/ui/scroll-area.tsx',
  'src/components/ui/select.tsx',
  'src/components/ui/separator.tsx',
  'src/components/ui/sheet.tsx',
  'src/components/ui/sidebar.tsx',
  'src/components/ui/skeleton.tsx',
  'src/components/ui/slider.tsx',
  'src/components/ui/sonner.tsx',
  'src/components/ui/switch.tsx',
  'src/components/ui/table.tsx',
  'src/components/ui/tabs.tsx',
  'src/components/ui/textarea.tsx',
  'src/components/ui/toast.tsx',
  'src/components/ui/toaster.tsx',
  'src/components/ui/toggle-group.tsx',
  'src/components/ui/toggle.tsx',
  'src/components/ui/tooltip.tsx',
  'src/components/ui/use-toast.ts',
  
  // Components - dashboard
  'src/components/dashboard/KPICards.tsx',
  'src/components/dashboard/RiskAlerts.tsx',
  'src/components/dashboard/RiskSemaphore.tsx',
  'src/components/dashboard/SequenceAnalysis.tsx',
  'src/components/dashboard/StatCard.tsx',
  
  // Components - layout
  'src/components/layout/AppLayout.tsx',
  'src/components/layout/AppSidebar.tsx',
  
  // Components - fechamento
  'src/components/fechamento/ReconciliacaoVisual.tsx',
  'src/components/fechamento/TabelaDadosPeriodo.tsx',
  
  // Components - filters
  'src/components/filters/DateRangeFilter.tsx',
  
  // Components - shared
  'src/components/shared/BulkDeleteBar.tsx',
  'src/components/shared/DataSourceInfo.tsx',
  'src/components/shared/DistributionChart.tsx',
  'src/components/shared/KPISummary.tsx',
  'src/components/shared/PageExplanation.tsx',
  'src/components/shared/SortableHeader.tsx',
  'src/components/shared/StakeCalculator.tsx',
  'src/components/shared/TablePagination.tsx',
  'src/components/shared/pageExplanations.ts',
  
  // Components - sheets
  'src/components/sheets/ColumnMappingEditor.tsx',
  'src/components/sheets/SheetSyncPreview.tsx',
  
  // Components - tags
  'src/components/tags/TagSelector.tsx',
  'src/components/tags/TagsManager.tsx',
  
  // Components - okrs
  'src/components/okrs/OKRsManager.tsx',
  
  // Pages
  'src/pages/AnaliseEstrategiasPage.tsx',
  'src/pages/ApostasPage.tsx',
  'src/pages/BancaPage.tsx',
  'src/pages/CaixaGeralPage.tsx',
  'src/pages/CasasPage.tsx',
  'src/pages/CassinoPage.tsx',
  'src/pages/ConfiguracoesPage.tsx',
  'src/pages/DadosReferenciaPage.tsx',
  'src/pages/DashboardPage.tsx',
  'src/pages/DiarioPage.tsx',
  'src/pages/DocumentacaoPage.tsx',
  'src/pages/FechamentoPage.tsx',
  'src/pages/GestaoEstrategicaPage.tsx',
  'src/pages/GoogleSheetsConfigPage.tsx',
  'src/pages/Index.tsx',
  'src/pages/LogsPage.tsx',
  'src/pages/NotFound.tsx',
  'src/pages/PlanilhaPage.tsx',
  'src/pages/ResultadosPage.tsx',
  'src/pages/SaquesAportesPage.tsx',
  'src/pages/SurebetsPage.tsx',
];

let restored = 0;
let alreadyExist = 0;
let errors = 0;

for (const relPath of allFiles) {
  const fullPath = resolve(PROJECT_ROOT, relPath);
  
  // Skip if already exists on disk
  if (existsSync(fullPath)) {
    alreadyExist++;
    continue;
  }
  
  try {
    // Try to read the file (it may be accessible through v0's virtual FS)
    const content = readFileSync(fullPath, 'utf-8');
    
    // Ensure directory exists
    mkdirSync(dirname(fullPath), { recursive: true });
    
    // Write it back to make it physically exist
    writeFileSync(fullPath, content, 'utf-8');
    restored++;
    console.log(`Restored: ${relPath}`);
  } catch (err) {
    errors++;
    console.error(`Failed: ${relPath} - ${err.message}`);
  }
}

console.log(`\nDone! Restored: ${restored}, Already existed: ${alreadyExist}, Errors: ${errors}`);
