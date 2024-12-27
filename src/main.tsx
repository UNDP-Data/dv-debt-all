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

function safeRender(elementId: string, Component: JSX.Element): void {
  const rootElement = document.getElementById(elementId);
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>{Component}</React.StrictMode>,
    );
  } else {
    console.warn(`Element with ID '${elementId}' does not exist.`);
  }
}

safeRender('debtCreditRating', <AppCreditRating />);
safeRender('creditDsaRating', <AppCreditDsaRating />);
safeRender('debtCreditRatingUpd', <AppCreditRatingUpd />);
safeRender('debtDSARating', <AppDsaRating />);
safeRender('debtDSARatingUpd', <AppDsaRatingUpd />);
safeRender('debtToGdp', <App />);
safeRender('debtToGdpUpd', <AppDebtToGdpUpd />);
safeRender('debtNetInterest', <AppNetInterest />);
safeRender('netInterestGroupedUpd', <AppNetInterestGroupedUpd />);
safeRender('debtNetInterestQuantiles', <AppNetInterestQuantiles />);
safeRender('netInterestIntervalUpd', <AppNetInterestIntervalUpd />);
safeRender('externalDebt', <AppExternalDebt />);
safeRender('externalDebtServiceUpd', <AppExternalDebtServiceUpd />);
safeRender('externalDebtQuantiles', <AppExternalDebtQuantiles />);
safeRender('externalDebtIntervalUpd', <AppExternalDebtIntervalUpd />);
safeRender('compositionGroups', <AppCompositionGroups />);
safeRender('debtCompositionUpd', <AppDebtCompositionUpd />);
safeRender('debtAllCountries', <AppAllCountries />);
safeRender('debtAllCountriesUpd', <AppAllCountriesUpd />);
