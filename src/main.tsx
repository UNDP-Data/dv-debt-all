import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AppNetInterest from './AppNetInterest';
import AppNetInterestQuantiles from './AppNetInterestQuantiles';
import AppExternalDebt from './AppExternalDebt';
import AppCompositionGroups from './AppCompositionGroups';
import AppExternalDebtQuantiles from './AppExternalDebtQuantiles';
import AppAllCountries from './AppAllCountries';
import AppCreditRating from './AppCreditRating';
import AppCreditRatingUpd from './updated/AppCreditRatingUpd';
import AppDsaRating from './AppDSARating';
import AppDsaRatingUpd from './updated/AppDSARatingUpd';
import AppDebtToGdpUpd from './updated/AppdebtToGdpUpd';
import AppNetInterestGroupedUpd from './updated/AppNetInterestGroupedUpd';
import AppNetInterestIntervalUpd from './updated/AppNetInterestIntervalUpd';
import AppExternalDebtServiceUpd from './updated/AppExternalDebtServiceUpd';
import AppExternalDebtIntervalUpd from './updated/AppExternalDebtIntervalUpd';
import AppDebtCompositionUpd from './updated/AppDebtCompositionUpd';
import AppAllCountriesUpd from './updated/AppAllCountriesUpd';
import AppCreditDsaRating from './AppCreditDsaRating';

ReactDOM.createRoot(
  document.getElementById('debtCreditRating') as HTMLElement,
).render(
  <React.StrictMode>
    <AppCreditRating />
  </React.StrictMode>,
);
ReactDOM.createRoot(
  document.getElementById('creditDsaRating') as HTMLElement,
).render(
  <React.StrictMode>
    <AppCreditDsaRating />
  </React.StrictMode>,
);
ReactDOM.createRoot(
  document.getElementById('debtCreditRatingUpd') as HTMLElement,
).render(
  <React.StrictMode>
    <AppCreditRatingUpd />
  </React.StrictMode>,
);
ReactDOM.createRoot(
  document.getElementById('debtDSARating') as HTMLElement,
).render(
  <React.StrictMode>
    <AppDsaRating />
  </React.StrictMode>,
);
ReactDOM.createRoot(
  document.getElementById('debtDSARatingUpd') as HTMLElement,
).render(
  <React.StrictMode>
    <AppDsaRatingUpd />
  </React.StrictMode>,
);
ReactDOM.createRoot(document.getElementById('debtToGdp') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
ReactDOM.createRoot(
  document.getElementById('debtToGdpUpd') as HTMLElement,
).render(
  <React.StrictMode>
    <AppDebtToGdpUpd />
  </React.StrictMode>,
);
ReactDOM.createRoot(
  document.getElementById('debtNetInterest') as HTMLElement,
).render(
  <React.StrictMode>
    <AppNetInterest />
  </React.StrictMode>,
);
ReactDOM.createRoot(
  document.getElementById('netInterestGroupedUpd') as HTMLElement,
).render(
  <React.StrictMode>
    <AppNetInterestGroupedUpd />
  </React.StrictMode>,
);
ReactDOM.createRoot(
  document.getElementById('debtNetInterestQuantiles') as HTMLElement,
).render(
  <React.StrictMode>
    <AppNetInterestQuantiles />
  </React.StrictMode>,
);

ReactDOM.createRoot(
  document.getElementById('netInterestIntervalUpd') as HTMLElement,
).render(
  <React.StrictMode>
    <AppNetInterestIntervalUpd />
  </React.StrictMode>,
);

ReactDOM.createRoot(
  document.getElementById('externalDebt') as HTMLElement,
).render(
  <React.StrictMode>
    <AppExternalDebt />
  </React.StrictMode>,
);

ReactDOM.createRoot(
  document.getElementById('externalDebtServiceUpd') as HTMLElement,
).render(
  <React.StrictMode>
    <AppExternalDebtServiceUpd />
  </React.StrictMode>,
);
ReactDOM.createRoot(
  document.getElementById('externalDebtQuantiles') as HTMLElement,
).render(
  <React.StrictMode>
    <AppExternalDebtQuantiles />
  </React.StrictMode>,
);
ReactDOM.createRoot(
  document.getElementById('externalDebtIntervalUpd') as HTMLElement,
).render(
  <React.StrictMode>
    <AppExternalDebtIntervalUpd />
  </React.StrictMode>,
);
ReactDOM.createRoot(
  document.getElementById('compositionGroups') as HTMLElement,
).render(
  <React.StrictMode>
    <AppCompositionGroups />
  </React.StrictMode>,
);
ReactDOM.createRoot(
  document.getElementById('debtCompositionUpd') as HTMLElement,
).render(
  <React.StrictMode>
    <AppDebtCompositionUpd />
  </React.StrictMode>,
);
ReactDOM.createRoot(
  document.getElementById('debtAllCountries') as HTMLElement,
).render(
  <React.StrictMode>
    <AppAllCountries />
  </React.StrictMode>,
);
ReactDOM.createRoot(
  document.getElementById('debtAllCountriesUpd') as HTMLElement,
).render(
  <React.StrictMode>
    <AppAllCountriesUpd />
  </React.StrictMode>,
);
