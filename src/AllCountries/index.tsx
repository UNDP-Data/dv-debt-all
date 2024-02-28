/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { useState, useEffect } from 'react';
import { format } from 'd3-format';
import {
  CountryPercentType,
  CountryStatsType,
  ExternalDebtType,
  CountryValueType,
  CountryCategoryType,
  CountryType,
  ChartSourceType,
} from '../Types';
import { LineChart } from './LineChart';
import '../style.css';
import { StackedBarChartSimple } from './StackedBarChartSimple';
import { LinearDotsComparison } from './LinearDotComparison';
import { HorizontalScale } from './HorizontalScale';

interface Props {
  countryDebtToGdp: CountryPercentType[];
  countryNetInterest: CountryPercentType[];
  countryTdsExternal: CountryPercentType[];
  countryExternalDebt: ExternalDebtType[];
  selectedCountry: CountryType;
  creditRating: CountryValueType[];
  countryDsaRating: CountryCategoryType[];
  countriesSources: ChartSourceType[];
}

export function AllCountries(props: Props) {
  const {
    countryDebtToGdp,
    countryNetInterest,
    countryTdsExternal,
    countryExternalDebt,
    creditRating,
    countryDsaRating,
    selectedCountry,
    countriesSources,
  } = props;

  const formatMillion = (d: number | undefined) => {
    if (d === undefined) return 'N/A';
    const k = d * 1000000;
    if (d < 1000) return `${d}M`;
    if (d < 10000) return format('.3~s')(k).replace('G', 'B');
    if (d < 100000) return format('.4~s')(k).replace('G', 'B');
    if (d < 1000000) return format('.5~s')(k).replace('G', 'B');
    if (d < 10000000) return format('.3~s')(k).replace('G', 'B');
    return format('.4~s')(k).replace('G', 'B');
  };
  const [countryStats, setCountryStats] = useState<
    CountryStatsType | undefined
  >(undefined);
  const dsaCategories = ['In debt distress', 'High', 'Moderate', 'Low'];

  useEffect(() => {
    // --- debt as % of GDP
    const debtChartYear = countriesSources.filter(
      d => d.graph === 'Government debt as a percentage of GDP',
    )[0].year;
    // for countries with no data for the latest year
    const debtYear =
      countryDebtToGdp[countryDebtToGdp.length - 1] === undefined
        ? undefined
        : countryDebtToGdp.filter(d => d.year === debtChartYear)[0] ===
          undefined
        ? countryDebtToGdp[countryDebtToGdp.length - 1].year
        : debtChartYear;
    const debtValue = countryDebtToGdp.filter(d => d.year === debtYear)[0];

    // --- external debt
    // year external debt used for the debt composition chart
    const yearExternalDebt = countriesSources.filter(
      d => d.graph === 'Public external debt composition',
    )[0].year;
    // external Debt is used for the total external PPG value only
    const externalDebt = countryExternalDebt.filter(
      d => d.year === yearExternalDebt,
    )[0];
    // Net interest payments
    const yearNetInterestChart = countriesSources.filter(
      d => d.graph === 'Net interest payments',
    )[0].year;
    const yearNetInterest: any =
      countryNetInterest[countryNetInterest.length - 1] === undefined
        ? undefined
        : countryNetInterest.filter(d => d.year === yearNetInterestChart)[0] ===
          undefined
        ? countryNetInterest[countryNetInterest.length - 1].year
        : yearNetInterestChart;

    const netInterest = countryNetInterest.filter(
      d => d.year === yearNetInterest,
    )[0];
    // --- debt servicing
    const debtServicing = countryExternalDebt[countryExternalDebt.length - 1];
    const allStats: CountryStatsType = {
      debtPercent:
        debtValue !== undefined ? `${debtValue.percentage.toFixed(1)}%` : 'N/A',
      debtMillion:
        debtValue !== undefined
          ? formatMillion(Math.round(debtValue.million))
          : 'N/A',
      debtYear: debtValue !== undefined ? debtValue.year.toString() : 'N/A',
      // --- external gov debt ---
      externalGovDebt:
        externalDebt !== undefined
          ? formatMillion(Math.round(externalDebt.total))
          : 'N/A',
      externalGovDebtYear:
        externalDebt !== undefined ? externalDebt.year.toString() : 'N/A',
      // -- net interest payments
      netInterestPayments:
        netInterest !== undefined ? formatMillion(netInterest.million) : 'N/A',
      netInterestPaymentsYear:
        netInterest !== undefined ? yearNetInterest.toString() : 'N/A',
      externalPPG:
        debtServicing !== undefined
          ? formatMillion(
              debtServicing['principal payments'] +
                debtServicing['interest payment'],
            )
          : 'N/A',
      externalPPGYear:
        debtServicing !== undefined ? debtServicing.year.toString() : 'N/A',
    };
    setCountryStats(allStats);
  }, [countryNetInterest, countryExternalDebt, countryDebtToGdp]);
  return (
    <>
      <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
        <h2 className='undp-typography margin-top-10'>Ratings</h2>
        <p className='undp-typography margin-top-05'>
          Credit ratings are translated into a numerical rating following the
          scale and categories used in Jensen (2022).<sup>1</sup>
          <br />
          Debts Sustainability Analysis (DSA) ratings are the latest rating for
          countries that have debt evaluated under the LIC-DSF framework.
          <sup>2</sup>
        </p>
        <div className='flex-div flex-wrap'>
          <LinearDotsComparison
            data={creditRating}
            title='Credit Ratings'
            id='countryCreditRatingScale'
            year={
              countriesSources.filter(d => d.graph === 'Credit Ratings')[0].year
            }
            svgHeight={100}
            selectedCountryCode={selectedCountry.value}
            chartSource={
              countriesSources.filter(d => d.graph === 'Credit Ratings')[0]
            }
          />
          <HorizontalScale
            countryDsa={countryDsaRating}
            categories={dsaCategories}
            title='DSA Ratings'
            id='countryDsaRatingScale'
            year={
              countriesSources.filter(d => d.graph === 'DSA Ratings')[0].year
            }
            svgHeight={100}
            chartSource={
              countriesSources.filter(d => d.graph === 'DSA Ratings')[0]
            }
          />
        </div>
      </div>
      <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
        <h2 className='undp-typography margin-top-10'>Government debt</h2>
        <p className='undp-typography'>
          Figures below show the value of general gross government debt in 2023
          (or latest available datapoint) in million (M) or billion (B) USD and
          as a percentage of GDP. The graph shows the development of debt (as a
          percentage of GDP) from 2000-2025.
        </p>
        <div className='flex-div flex-wrap'>
          {countryStats !== undefined ? (
            <div className='flex-div debt-stats-container flex-vertical'>
              <div className='stat-card'>
                <h3>{countryStats.debtMillion}</h3>
                <h4>USD</h4>
                <p className='undp-typography'>
                  General gross government debt ({countryStats?.debtYear})
                </p>
              </div>
              <div className='stat-card'>
                <h3>{countryStats.debtPercent}</h3>
                <h4>% of GDP</h4>
                <p className='undp-typography'>
                  General gross government debt ({countryStats?.debtYear})
                </p>
              </div>
            </div>
          ) : null}
          {countryDebtToGdp !== undefined ? (
            <LineChart
              data={countryDebtToGdp}
              indicators={['percentage']}
              id='countryDebtToGdp'
              title='Government debt as percentage of GDP'
              selectedCountryCode={selectedCountry.value}
              svgHeight={350}
              chartSource={
                countriesSources.filter(
                  d => d.graph === 'Government debt as a percentage of GDP',
                )[0]
              }
            />
          ) : null}
        </div>
      </div>
      <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
        <h2 className='undp-typography margin-top-10'>
          External government debt
        </h2>
        <p className='undp-typography'>
          The figure shows the value of the external public and publicly
          guaranteed (PPG) debt stock in million (M) or billion (B) USD for
          2022. The graph shows the debt composition on the four categories
          bilateral, multilateral, bonds and ‘other private’ creditors.
        </p>
        <div className='flex-div flex-wrap'>
          <div style={{ flexBasis: '30%', flexGrow: '1' }}>
            <div className='stat-card'>
              <h3>{countryStats?.externalGovDebt}</h3>
              <h4>USD</h4>
              <p className='undp-typography'>
                External public and publicly guaranteed (PPG) debt stock (
                {countryStats?.externalGovDebtYear})
              </p>
            </div>
          </div>
          <div style={{ flexBasis: '50%', flexGrow: '1' }}>
            <StackedBarChartSimple
              data={countryExternalDebt.filter(
                d => d.year === Number(countryStats?.externalGovDebtYear),
              )}
              sections={['multilateral', 'bilateral', 'bonds', 'other private']}
              id='debtComposition'
              title='Public external debt composition ($ million)'
              chartSource={
                countriesSources.filter(
                  d => d.graph === 'Public external debt composition',
                )[0]
              }
            />
          </div>
        </div>
      </div>
      <div>
        <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
          <h2 className='undp-typography margin-top-10'>Debt servicing</h2>
          <p className='undp-typography'>
            Figures show the value of net interest payments on total government
            debt, and interest and principal payments on external PPG debt for
            2023 in in million (M) or billion (B) USD. The graph on the left
            depicts government net interest payments (as a percentage of
            revenue), and the graph on the right total external debt servicing
            on external PPG debt (as a percentage of revenue or exports). Both
            graphs cover the period 2000-2025.
          </p>
        </div>
        <div className='flex-div flex-wrap margin-top-08'>
          <div className='stat-card flex-half-screen'>
            <h3>{countryStats?.netInterestPayments}</h3>
            <h4>USD</h4>
            <p className='undp-typography'>
              Net interest payments General Government Debt (
              {countryStats?.netInterestPaymentsYear})
            </p>
          </div>
          <div className='stat-card flex-half-screen'>
            <h3>{countryStats?.externalPPG}</h3>
            <h4>USD</h4>
            <p className='undp-typography'>
              Interest and principal payments on external PPG debt (
              {countryStats?.externalPPGYear})
            </p>
          </div>
        </div>
        <div className='flex-div flex-wrap margin-top-05'>
          {countryNetInterest !== undefined ? (
            <LineChart
              data={countryNetInterest}
              indicators={['percentage']}
              id='countryNetInterest'
              title='Net interest payments (% of revenue)'
              selectedCountryCode={selectedCountry.value}
              svgHeight={300}
              chartSource={
                countriesSources.filter(
                  d => d.graph === 'Net interest payments',
                )[0]
              }
            />
          ) : null}
          {countryTdsExternal !== undefined ? (
            <LineChart
              data={countryTdsExternal}
              indicators={['% of revenue', '% of exports']}
              id='countryDebtService'
              title='Total debt service - PPG external debt'
              selectedCountryCode={selectedCountry.value}
              svgHeight={300}
              chartSource={
                countriesSources.filter(
                  d => d.graph === 'Total debt service',
                )[0]
              }
            />
          ) : null}
        </div>
      </div>
    </>
  );
}
