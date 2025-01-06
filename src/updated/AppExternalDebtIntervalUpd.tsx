import { SingleGraphDashboardFromConfig } from '@undp-data/undp-visualization-library';
import '@undp-data/undp-visualization-library/dist/style.css';

function AppExternalDebtIntervalUpd() {
  return (
    <div>
      <SingleGraphDashboardFromConfig config='/externalDebtInterval.json' />
    </div>
  );
}

export default AppExternalDebtIntervalUpd;
