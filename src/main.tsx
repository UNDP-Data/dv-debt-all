import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AppNetInterest from './AppNetInterest';
import AppNetInterestQuantiles from './AppNetInterestQuantiles';
import AppExternalDebt from './AppExternalDebt';
import AppCompositionGroups from './AppCompositionGroups';
import AppAllCountries from './AppAllCountries';
import AppCreditDsaRating from './AppCreditDsaRating';

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
  document.getElementById('debtCreditDsaRating') as HTMLElement,
).render(
  <React.StrictMode>
    <AppCreditDsaRating />
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
