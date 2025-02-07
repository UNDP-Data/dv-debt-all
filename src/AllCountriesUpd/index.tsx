/* eslint-disable no-irregular-whitespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { useState, useEffect, useMemo } from 'react';
import { format } from 'd3-format';
import { SingleGraphDashboard } from '@undp-data/undp-visualization-library';
import {
  CountryPercentType,
  CountryStatsType,
  ExternalDebtType,
  CountryValueType,
  CountryCategoryType,
  CountryType,
  ChartSourceType,
} from '../Types';
import '../style.css';
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
    if (d < 1000) return `${d} M`;
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
    const interestAndPaymentsPPG = Number(
      (
        debtServicing['principal payments'] + debtServicing['interest payment']
      ).toFixed(12),
    );
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
          ? formatMillion(interestAndPaymentsPPG)
          : 'N/A',
      externalPPGYear:
        debtServicing !== undefined ? debtServicing.year.toString() : 'N/A',
    };
    setCountryStats(allStats);
  }, [countryNetInterest, countryExternalDebt, countryDebtToGdp]);

  const transformedExternalDebtData = useMemo(() => {
    if (!countryStats || !countryStats.externalGovDebtYear) return [];

    // Find the debt data for the specified year
    const debtData = countryExternalDebt.find(
      d => d.year === Number(countryStats.externalGovDebtYear),
    );
    // console.log(countryTdsExternal);
    if (!debtData) return [];

    // Define the keys you want to include with capitalized labels
    const keysToInclude = [
      'Bilateral',
      'Multilateral',
      'Bonds',
      'Other private',
    ];

    // Define a mapping from labels to data keys
    const labelToDataKeyMap: { [label: string]: keyof ExternalDebtType } = {
      Bilateral: 'bilateral',
      Multilateral: 'multilateral',
      Bonds: 'bonds',
      'Other private': 'other private',
    };

    // Transform the data into the desired format, scale to million, and exclude unwanted entries
    return keysToInclude
      .map(label => {
        const dataKey = labelToDataKeyMap[label];
        const value = debtData[dataKey];

        // Type guard to ensure 'value' is a number before multiplication
        if (typeof value === 'number') {
          return {
            label,
            size: value * 1_000_000, // Transform to millions
          };
        }
        return {
          label,
          size: 0, // Default to 0 if not a number
        };
      })
      .filter(item => item.size !== 0 && item.size !== undefined);
  }, [countryExternalDebt, countryStats]);
  return (
    <>
      <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
        <h2 className='undp-typography margin-top-08'>Ratings</h2>
        <p className='undp-typography margin-top-05'>
          Credit ratings are translated into a numerical rating following the
          scale and categories used in Jensen (2022).<sup>1</sup> Debt distress
          ratings are from countries latest Debt Sustainability Analysis (DSA)
          for countries that have debt evaluated under the LIC-DSF framework.
        </p>
        <div className='flex-div flex-wrap'>
          <LinearDotsComparison
            data={creditRating}
            title='Credit Ratings'
            id='countryCreditRatingScale'
            svgHeight={100}
            selectedCountryCode={selectedCountry.value}
            chartSource={
              countriesSources.filter(d => d.graph === 'Credit Ratings')[0]
            }
          />
          <HorizontalScale
            countryDsa={countryDsaRating}
            categories={dsaCategories}
            title='DSA debt distress rating'
            id='countryDsaRatingScale'
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
          Figures below show the value of general gross government debt in 2024
          (or latest available datapoint) in million (M) or billion (B) USD and
          as a percentage of GDP. The graph shows the historical development of
          debt as a percentage of GDP from 2000 to 2025 and the forecast for
          2024 and 2025.
        </p>
        <div className='flex-div flex-wrap'>
          {countryStats !== undefined ? (
            <div
              className='flex-div flex-wrap debt-stats-container flex-vertical'
              style={{ flexBasis: '30%', flexGrow: '1', display: 'flex' }}
            >
              <div className='stat-card stat-cart-debt'>
                <h3>{countryStats.debtMillion}</h3>
                <h4>USD</h4>
                <p className='undp-typography'>
                  General gross government debt ({countryStats?.debtYear})
                </p>
              </div>
              <div className='stat-card stat-cart-debt'>
                <h3>{countryStats.debtPercent}</h3>
                <h4>% of GDP</h4>
                <p className='undp-typography'>
                  General gross government debt ({countryStats?.debtYear})
                </p>
              </div>
            </div>
          ) : null}
          {countryDebtToGdp !== undefined ? (
            <div style={{ flexBasis: '50%', flexGrow: '1' }}>
              <SingleGraphDashboard
                dataSettings={{ data: countryDebtToGdp }}
                graphType='lineChart'
                graphDataConfiguration={[
                  { columnId: 'year', chartConfigId: 'date' },
                  { columnId: 'percentage', chartConfigId: 'y' },
                ]}
                graphSettings={{
                  graphTitle: 'Government debt as a percentage of GDP',
                  suffix: ' %',
                  tooltip: '{{data.year}} <b>{{formatNumber y}} %</b>',
                  width: 580,
                  noOfXTicks: 7,
                  sources: [
                    {
                      source:
                        'Based on data from the IMF World Economic Outlook, October 2024',
                    },
                  ],
                  backgroundColor: true,
                  graphDownload: true,
                  dataDownload: true,
                }}
              />
            </div>
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
          2023. The graph shows the corresponding debt composition on the four
          creditor categories bilateral, multilateral, bonds and ‘other private’
          creditors.
        </p>
        <div className='flex-div flex-wrap'>
          <div style={{ flexBasis: '30%', flexGrow: '1', display: 'flex' }}>
            <div
              className='stat-card'
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <h3>{countryStats?.externalGovDebt}</h3>
              <h4>USD</h4>
              <p className='undp-typography'>
                External public and publicly guaranteed (PPG) debt stock (
                {countryStats?.externalGovDebtYear})
              </p>
            </div>
          </div>
          <div style={{ flexBasis: '50%', flexGrow: '1' }}>
            <SingleGraphDashboard
              graphType='donutChart'
              dataSettings={{
                data: transformedExternalDebtData,
              }}
              graphDataConfiguration={[
                { columnId: 'label', chartConfigId: 'label' },
                { columnId: 'size', chartConfigId: 'size' },
              ]}
              graphSettings={{
                graphTitle: 'Public external debt composition',
                graphDownload: true,
                dataDownload: true,
                prefix: '$',
                radius: 164,
                strokeWidth: 40,
                bottomMargin: 24,
                colorDomain: [
                  'Bilateral',
                  'Multilateral',
                  'Bonds',
                  'Other private',
                ],
                backgroundColor: true,
                sources: [
                  {
                    source: 'World Bank International Debt Statistics 2024',
                  },
                ],
                footNote:
                  'Note: Bilateral and multilateral debt equals total official creditor debt. Bonds plus ‘other private’ equals total private creditor debt.',
                padding: '1.5rem 2rem 1.5rem 2rem',
              }}
            />
          </div>
        </div>
      </div>
      <div>
        <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
          <h2 className='undp-typography margin-top-10'>Debt servicing</h2>
          <p className='undp-typography'>
            Figures show the value of net interest payments on total government
            debt, and interest and principal payments on external PPG debt in
            million (M) or billion (B) USD. The graph on the left depicts
            government net interest payments (as a percentage of revenue), and
            the graph on the right total external debt servicing on external
            public and publicly guaranteed (PPG) debt (as a percentage of
            revenue or exports). Both graphs cover the period 2000-2025.
          </p>
        </div>
        <div className='flex-div flex-wrap margin-top-08'>
          <div className='stat-card flex-half-screen'>
            <h3>{countryStats?.netInterestPayments}</h3>
            <h4>USD</h4>
            <p className='undp-typography'>
              Net interest payments general government debt (
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
        <div
          className='flex-div flex-wrap margin-top-05'
          style={{ height: '100%' }}
        >
          {countryNetInterest !== undefined ? (
            <div style={{ width: 'calc(50% - 0.5rem)', height: '100%' }}>
              <SingleGraphDashboard
                dataSettings={{ data: countryNetInterest }}
                graphType='lineChart'
                graphDataConfiguration={[
                  { columnId: 'year', chartConfigId: 'date' },
                  { columnId: 'percentage', chartConfigId: 'y' },
                ]}
                graphSettings={{
                  graphTitle: 'Net interest payments (% of revenue)',
                  suffix: ' %',
                  rightMargin: 24,
                  leftMargin: 56,
                  height: 512,
                  noOfXTicks: 7,
                  tooltip: '{{data.year}} <b>{{formatNumber y}} %</b>',
                  sources: [
                    {
                      source:
                        'Based on IMF World Economic Outlook, October 2024.',
                    },
                  ],
                  footNote:
                    'Note: Net interests are calculated as the difference between the overall and primary balance.',
                  backgroundColor: true,
                  graphDownload: true,
                  dataDownload: true,
                }}
              />
            </div>
          ) : null}
          {countryTdsExternal !== undefined ? (
            <div style={{ width: 'calc(50% - 0.5rem)' }}>
              <SingleGraphDashboard
                dataSettings={{ data: countryTdsExternal }}
                graphType='multiLineChart'
                graphDataConfiguration={[
                  { columnId: 'year', chartConfigId: 'date' },
                  {
                    columnId: ['% of revenue', '% of exports'],
                    chartConfigId: 'y',
                  },
                ]}
                graphSettings={{
                  graphTitle: 'Total debt service – PPG external debt',
                  suffix: ' %',
                  rightMargin: 24,
                  leftMargin: 56,
                  height: 480,
                  noOfXTicks: 7,
                  tooltip:
                    '{{data.year}}</br><span class="tooltipCircle" style="background-color: #006eb5;"></span><b>{{formatNumber data.[% of revenue]}} %</b></br><span class="tooltipCircle" style="background-color: #5dd4f0;"></span><b>{{formatNumber data.[% of exports]}} %</b>',
                  sources: [
                    {
                      source:
                        'Based on IMF World Economic Outlook, October 2024 and World Bank International Debts Statistics 2024.',
                    },
                  ],
                  footNote:
                    'Note: Total debt servicing covers interest plus principal payments.',
                  backgroundColor: true,
                  graphDownload: true,
                  dataDownload: true,
                  showColorLegendAtTop: true,
                }}
              />
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
