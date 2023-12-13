/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { useState, useEffect } from 'react';
import {
  CountryPercentType,
  CountryStatsType,
  ExternalDebtType,
  CountryValueType,
  CountryCategoryType,
  CountryType,
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
  } = props;
  const [countryStats, setCountryStats] = useState<
    CountryStatsType | undefined
  >(undefined);
  const dsaCategories = ['In debt distress', 'High', 'Moderate', 'Low'];
  const yearGGDebt = 2023;
  const yearExternalDebt = 2021;
  const yearNetInterest = 2023;
  useEffect(() => {
    const debtValue = countryDebtToGdp.filter(d => d.year === yearGGDebt)[0];
    const externalDebt = countryExternalDebt.filter(
      d => d.year === yearExternalDebt,
    )[0];
    const allStats: CountryStatsType = {
      debtPercent:
        debtValue !== undefined ? `${debtValue.percentage.toFixed(1)}%` : 'N/A',
      debtMillion:
        debtValue !== undefined
          ? Math.round(debtValue.million).toString()
          : 'N/A',
      debtYear: yearGGDebt.toString(),
      externalGovDebt:
        externalDebt !== undefined
          ? Math.round(externalDebt.total).toString()
          : 'N/A',
      externalGovDebtYear: yearExternalDebt.toString(),
      netInterestPayments:
        countryNetInterest.filter(d => d.year === yearNetInterest).length > 0
          ? countryNetInterest
              .filter(d => d.year === yearNetInterest)[0]
              .million.toString()
          : 'N/A',
      netInterestPaymentsYear: yearNetInterest.toString(),
      externalPPG:
        externalDebt !== undefined
          ? (
              externalDebt['principal payments'] +
              externalDebt['interest payment']
            ).toString()
          : 'N/A',
      externalPPGYear: yearExternalDebt.toString(),
    };
    setCountryStats(allStats);
  }, [countryNetInterest, countryExternalDebt, countryDebtToGdp]);
  return (
    <>
      <h2 className='undp-typography'>{selectedCountry.label}</h2>
      <div className='flex-div'>
        <div style={{ width: '50%' }}>
          <LinearDotsComparison
            data={creditRating}
            title='Credit Rating'
            id='countryCreditRatingScale'
            year={2023}
            svgHeight={100}
            selectedCountryCode={selectedCountry.value}
          />
        </div>
        <div style={{ width: '50%' }}>
          <HorizontalScale
            countryDsa={countryDsaRating}
            categories={dsaCategories}
            title='DSA Rating'
            id='countryDsaRatingScale'
            year={2023}
            svgHeight={100}
          />
        </div>
      </div>
      <h3 className='undp-typography margin-top-08'>Government debt</h3>
      <p className='undp-typography'>
        The table below shows the value of general government debt in 2023 in
        million USD and as a percentage of GDP. The figure shows the development
        of debt (in % of GDP) from 2000-2023.
      </p>
      <div className='flex-div'>
        {countryStats !== undefined ? (
          <div style={{ width: '33%' }} className='flex-div flex-vertical'>
            <div className='stat-card'>
              <h3 className='undp-typography'>{countryStats.debtMillion}</h3>
              <h5 className='undp-typography'>USD million</h5>
              <p className='undp-typography'>
                Government Debt ({countryStats?.debtYear})
              </p>
            </div>
            <div className='stat-card'>
              <h3 className='undp-typography'>{countryStats.debtPercent}</h3>
              <h5 className='undp-typography'>% of GDP</h5>
              <p className='undp-typography'>
                Government Debt ({countryStats?.debtYear})
              </p>
            </div>
          </div>
        ) : null}
        <div style={{ width: '65%' }}>
          {countryDebtToGdp !== undefined ? (
            <LineChart
              data={countryDebtToGdp.filter(d => d.year <= yearGGDebt)}
              indicators={['percentage']}
              id='countryDebtToGdp'
              title='Government debt as percentage of GDP'
              selectedCountryCode={selectedCountry.value}
            />
          ) : null}
        </div>
      </div>
      <h3 className='undp-typography margin-top-08'>
        External government debt
      </h3>

      <div className='flex-div'>
        <div style={{ width: '50%' }}>
          <div className='stat-card'>
            <h3 className='undp-typography'>{countryStats?.externalGovDebt}</h3>
            <h5 className='undp-typography'>USD million</h5>
            <p className='undp-typography'>
              External government debt ({countryStats?.externalGovDebtYear})
            </p>
          </div>
          <p className='undp-typography margin-top-08'>
            The table and figure show the composition of external public and
            publicly guaranteed (PPG) debt in million USD based on the latest
            available datapoint 2021.
          </p>
        </div>
        <div style={{ width: '50%' }}>
          <StackedBarChartSimple
            data={countryExternalDebt.filter(d => d.year === yearExternalDebt)}
            sections={['multilateral', 'bilateral', 'bonds', 'other private']}
            id='debtComposition'
            title='Public external debt composition ($ million)'
          />
        </div>
      </div>
      <div>
        <h3 className='undp-typography margin-top-08'>Debt servicing</h3>
        <p className='undp-typography'>
          The table shows the net interest payments on total government debt,
          and interest and principal payments on external PPG debt for 2023.
          Figure X shows the development in net interest payments as a
          percentage of revenue from 2000-2023 and Figure Y the development in
          total external debt servicing both as a percentage of revenue and
          exports.
        </p>
        <div className='flex-div'>
          <div style={{ width: '50%' }}>
            <div className='stat-card'>
              <h3 className='undp-typography'>
                {countryStats?.netInterestPayments}
              </h3>
              <h5 className='undp-typography'>USD million</h5>
              <p className='undp-typography'>
                Net interest payments General Government Debt (
                {countryStats?.netInterestPaymentsYear})
              </p>
            </div>
          </div>
          <div style={{ width: '50%' }}>
            <div className='stat-card'>
              <h3 className='undp-typography'>{countryStats?.externalPPG}</h3>
              <h5 className='undp-typography'>USD million</h5>
              <p className='undp-typography'>
                Total external PPG debt service payments (
                {countryStats?.externalPPGYear})
              </p>
            </div>
          </div>
        </div>
        <div className='flex-div margin-top-05'>
          <div style={{ width: '50%' }}>
            {countryNetInterest !== undefined ? (
              <LineChart
                data={countryNetInterest.filter(d => d.year <= yearNetInterest)}
                indicators={['percentage']}
                id='countryNetInterest'
                title='Net interest payments (% of revenue)'
                selectedCountryCode={selectedCountry.value}
              />
            ) : null}
          </div>
          <div style={{ width: '50%' }}>
            {countryTdsExternal !== undefined ? (
              <LineChart
                data={countryTdsExternal.filter(
                  d => d.year <= yearExternalDebt,
                )}
                indicators={['% of revenue', '% of exports']}
                id='countryDebtService'
                title='Total debt service - PPG external debt'
                selectedCountryCode={selectedCountry.value}
              />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
