import { SingleGraphDashboardFromConfig } from '@undp-data/undp-visualization-library';
import '@undp-data/undp-visualization-library/dist/style.css';

function AppCreditRatingUpd() {
  return (
    <div>
      <SingleGraphDashboardFromConfig config='https://raw.githubusercontent.com/UNDP-Data/dv-debt-all-data-repo/refs/heads/main/config-2024/creditRating.json' />
    </div>
  );
}

export default AppCreditRatingUpd;
