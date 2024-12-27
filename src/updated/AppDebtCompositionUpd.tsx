import { SingleGraphDashboardFromConfig } from '@undp-data/undp-visualization-library';
import '@undp-data/undp-visualization-library/dist/style.css';

function AppDebtCompositionUpd() {
  return (
    <div>
      <SingleGraphDashboardFromConfig config='https://raw.githubusercontent.com/UNDP-Data/dv-debt-all-data-repo/refs/heads/main/config-2024/debtComposition.json' />
    </div>
  );
}

export default AppDebtCompositionUpd;
