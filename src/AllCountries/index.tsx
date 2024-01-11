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
    return Math.abs(k) < 1
      ? d.toString()
      : format('~s')(k).replace('G', 'B').toString();
  };
  const [countryStats, setCountryStats] = useState<
    CountryStatsType | undefined
  >(undefined);
  const dsaCategories = ['In debt distress', 'High', 'Moderate', 'Low'];
  const yearExternalDebt = 2022;
  useEffect(() => {
    const debtValue = countryDebtToGdp[countryDebtToGdp.length - 1];
    const externalDebt = countryExternalDebt.filter(
      d => d.year === yearExternalDebt,
    )[0];
    const allStats: CountryStatsType = {
      debtPercent:
        debtValue !== undefined ? `${debtValue.percentage.toFixed(1)}%` : 'N/A',
      debtMillion:
        debtValue !== undefined
          ? formatMillion(Math.round(debtValue.million))
          : 'N/A',
      debtYear: debtValue !== undefined ? debtValue.year.toString() : 'N/A',
      externalGovDebt:
        externalDebt !== undefined
          ? formatMillion(Math.round(externalDebt.total))
          : 'N/A',
      externalGovDebtYear: yearExternalDebt.toString(),
      netInterestPayments:
        countryNetInterest[countryNetInterest.length - 1] !== undefined
          ? formatMillion(
              countryNetInterest[countryNetInterest.length - 1].million,
            )
          : 'N/A',
      netInterestPaymentsYear:
        countryNetInterest[countryNetInterest.length - 1] !== undefined
          ? countryNetInterest[countryNetInterest.length - 1].year.toString()
          : 'N/A',
      externalPPG:
        externalDebt !== undefined
          ? formatMillion(
              externalDebt['principal payments'] +
                externalDebt['interest payment'],
            )
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
            title='Credit Ratings'
            id='countryCreditRatingScale'
            year={2023}
            svgHeight={100}
            selectedCountryCode={selectedCountry.value}
            chartSource={
              countriesSources.filter(d => d.graph === 'Credit ratings')[0]
            }
          />
        </div>
        <div style={{ width: '50%' }}>
          <HorizontalScale
            countryDsa={countryDsaRating}
            categories={dsaCategories}
            title='DSA Ratings'
            id='countryDsaRatingScale'
            year={2023}
            svgHeight={100}
            chartSource={
              countriesSources.filter(d => d.graph === 'DSA Ratings')[0]
            }
          />
        </div>
      </div>
      <h3 className='undp-typography margin-top-08'>Government debt</h3>
      <p className='undp-typography'>
        The table below shows the value of general gross government debt in 2023
        in million USD and as a percentage of GDP. The figure shows the
        development of debt (in % of GDP) from 2000-2023.
      </p>
      <div className='flex-div'>
        {countryStats !== undefined ? (
          <div style={{ width: '33%' }} className='flex-div flex-vertical'>
            <div className='stat-card'>
              <h3 className='undp-typography'>{countryStats.debtMillion}</h3>
              <h5 className='undp-typography'>USD</h5>
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
      <h3 className='undp-typography margin-top-08'>
        External government debt
      </h3>

      <div className='flex-div'>
        <div style={{ width: '50%' }}>
          <div className='stat-card'>
            <h3 className='undp-typography'>{countryStats?.externalGovDebt}</h3>
            <h5 className='undp-typography'>USD</h5>
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
            chartSource={
              countriesSources.filter(
                d => d.graph === 'Public external debt composition',
              )[0]
            }
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
              <h5 className='undp-typography'>USD</h5>
              <p className='undp-typography'>
                Net interest payments General Government Debt (
                {countryStats?.netInterestPaymentsYear})
              </p>
            </div>
          </div>
          <div style={{ width: '50%' }}>
            <div className='stat-card'>
              <h3 className='undp-typography'>{countryStats?.externalPPG}</h3>
              <h5 className='undp-typography'>USD</h5>
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
      </div>
    </>
  );
}
