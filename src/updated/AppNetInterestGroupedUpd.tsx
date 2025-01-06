import { SingleGraphDashboardFromConfig } from '@undp-data/undp-visualization-library';
import '@undp-data/undp-visualization-library/dist/style.css';

function AppNetInterestGroupedUpd() {
  return (
    <div>
      <SingleGraphDashboardFromConfig config='https://raw.githubusercontent.com/UNDP-Data/dv-debt-all-data-repo/refs/heads/main/config-2024/netInterestGrouped.json' />
    </div>
  );
}

export default AppNetInterestGroupedUpd;
