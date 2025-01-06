import { SingleGraphDashboardFromConfig } from '@undp-data/undp-visualization-library';
import '@undp-data/undp-visualization-library/dist/style.css';

function AppNetInterestGroupedUpd() {
  return (
    <div>
      <SingleGraphDashboardFromConfig config='/netInterestGrouped.json' />
    </div>
  );
}

export default AppNetInterestGroupedUpd;
