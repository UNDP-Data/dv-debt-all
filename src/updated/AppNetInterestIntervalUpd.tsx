import { SingleGraphDashboardFromConfig } from '@undp-data/undp-visualization-library';
import '@undp-data/undp-visualization-library/dist/style.css';

function AppNetInterestInterval() {
  return (
    <div>
      <SingleGraphDashboardFromConfig config='/netInterestInterval.json' />
    </div>
  );
}

export default AppNetInterestInterval;
