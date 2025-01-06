import { SingleGraphDashboardFromConfig } from '@undp-data/undp-visualization-library';
import '@undp-data/undp-visualization-library/dist/style.css';

function AppDebtCompositionUpd() {
  return (
    <div>
      <SingleGraphDashboardFromConfig config='/debtComposition.json' />
    </div>
  );
}

export default AppDebtCompositionUpd;
