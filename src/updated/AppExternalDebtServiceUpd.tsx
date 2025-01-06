import { SingleGraphDashboardFromConfig } from '@undp-data/undp-visualization-library';
import '@undp-data/undp-visualization-library/dist/style.css';

function AppExternalDebtServiceUpd() {
  return (
    <div>
      <SingleGraphDashboardFromConfig config='/externalDebtService.json' />
    </div>
  );
}

export default AppExternalDebtServiceUpd;
