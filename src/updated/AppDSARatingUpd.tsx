import { SingleGraphDashboardFromConfig } from '@undp-data/undp-visualization-library';
import '@undp-data/undp-visualization-library/dist/style.css';

function AppDsaRatingUpd() {
  return (
    <div>
      <SingleGraphDashboardFromConfig config='/DSARating.json' />
    </div>
  );
}

export default AppDsaRatingUpd;
