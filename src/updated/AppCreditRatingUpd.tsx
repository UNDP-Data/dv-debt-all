import { SingleGraphDashboardFromConfig } from '@undp-data/undp-visualization-library';
import '@undp-data/undp-visualization-library/dist/style.css';

function AppCreditRatingUpd() {
  return (
    <div>
      <SingleGraphDashboardFromConfig config='/creditRating.json' />
    </div>
  );
}

export default AppCreditRatingUpd;
