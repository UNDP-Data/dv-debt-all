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
import AppDsaRating from './AppDSARating';

ReactDOM.createRoot(
  document.getElementById('debtCreditRating') as HTMLElement,
).render(
  <React.StrictMode>
    <AppCreditRating />
  </React.StrictMode>,
);
ReactDOM.createRoot(
  document.getElementById('debtDsaRating') as HTMLElement,
).render(
  <React.StrictMode>
    <AppDsaRating />
  </React.StrictMode>,
);
ReactDOM.createRoot(document.getElementById('debtToGdp') as HTMLElement).render(
  <React.StrictMode>
    <App />
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
  document.getElementById('debtNetInterestQuantiles') as HTMLElement,
).render(
  <React.StrictMode>
    <AppNetInterestQuantiles />
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
  document.getElementById('externalDebtQuantiles') as HTMLElement,
).render(
  <React.StrictMode>
    <AppExternalDebtQuantiles />
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
  document.getElementById('debtAllCountries') as HTMLElement,
).render(
  <React.StrictMode>
    <AppAllCountries />
  </React.StrictMode>,
);
