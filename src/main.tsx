import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AppNetInterest from './AppNetInterest';
import AppExternalDebt from './AppExternalDebt';
import AppCreditDsaRating from './AppCreditDsaRating';
import AppAllCountries from './AppAllCountries';


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
  document.getElementById('debtAllCountries') as HTMLElement,
).render(
  <React.StrictMode>
    <AppAllCountries />
  </React.StrictMode>,
);
