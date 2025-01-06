import { SingleGraphDashboardFromConfig } from '@undp-data/undp-visualization-library';
import '@undp-data/undp-visualization-library/dist/style.css';

function AppDebtToGdpUpd() {
  return (
    <div>
      <SingleGraphDashboardFromConfig config='/debtToGDP.json' />
    </div>
  );
}

export default AppDebtToGdpUpd;
