/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { csv } from 'd3-fetch';
import { useEffect, useState } from 'react';
import { Select } from 'antd';
import {
  CountryPercentType,
  CountryType,
  ExternalDebtType,
  CountryValueType,
  CountryCategoryType,
  ChartSourceType,
} from './Types';
import './style.css';
import { AllCountries } from './AllCountries';

function App() {
  const [netInterest, setNetInterest] = useState<
    CountryPercentType[] | undefined
  >();
  const [tdsExternalDebt, setTdsExternalDebt] = useState<
    CountryPercentType[] | undefined
  >();
  const [debtToGdp, setDebtToGdp] = useState<
    CountryPercentType[] | undefined
  >();
  const [externalDebt, setExternalDebt] = useState<
    ExternalDebtType[] | undefined
  >();
  const [creditRating, setCreditRating] = useState<
    CountryValueType[] | undefined
  >();
  const [dsaRating, setDsaRating] = useState<
    CountryCategoryType[] | undefined
  >();
  const [countryList, setCountryList] = useState<CountryType[] | undefined>(
    undefined,
  );
  const [selectedCountry, setSelectedCountry] = useState<CountryType>();
  const [countriesSources, setCountriesSources] = useState<ChartSourceType[]>(
    [],
  );
  const groups = [
    'LIC',
    'LMC',
    'UMC',
    'MIC',
    'LDC',
    'SIDS',
    'Poorest',
    'HIPC',
    'Very high HDI',
    'High HDI',
    'Medium HDI',
    'Low HDI',
  ];
  const groupsNames = {
    'All developing': 'All developing',
    LIC: 'Low income (LIC)',
    LMC: 'Lower-middle income (LMC)',
    UMC: 'Upper-middle income (UMC)',
    MIC: 'Middle income (MIC)',
    LDC: 'Least developed (LDC)',
    SIDS: 'Small island developing (SIDS)',
    EM: 'Emerging market (EM)',
    LIDC: 'Low income developing (LIDC)',
    Poorest: 'Poorest (IDA eligible)',
    HIPC: 'Heavily indebted poor (HIPC)',
    'Very high HDI': 'Very high HDI',
    'High HDI': 'High HDI',
    'Medium HDI': 'Medium HDI',
    'Low HDI': 'Low HDI',
    'South Asia': 'South Asia (SA)',
    'Europe & Central Asia': 'Europe & Central Asia (ECA)',
    'Middle East & North Africa': 'Middle East and North Africa (MENA)',
    'East Asia & Pacific': 'East Asia & Pacific (EAP)',
    'Latin America & Caribbean': 'Latin America & Caribbean (LAC)',
    'Sub-Saharan Africa': 'Sub-Saharan Africa (SSA)',
  };

  const dataurl =
    'https://raw.githubusercontent.com/UNDP-Data/dv-debt-all-data-repo/main/countries/';
  useEffect(() => {
    Promise.all([
      csv(`${dataurl}groupings.csv`), // 1. Groupings
      csv(`${dataurl}dsaRating.csv`), // 2. Ratings
      csv(`${dataurl}creditRating.csv`), // 2. Ratings
      csv(`${dataurl}netInterest.csv`), // 5. Net interest
      csv(`${dataurl}tdsExternalDebt.csv`), // 5. TDS externaldebt
      csv(`${dataurl}ggDebt.csv`), // 3.GG debt
      csv(`${dataurl}externalDebt.csv`), // 4. External debt
      csv(`${dataurl}countries-sources.csv`),
    ]).then(
      ([
        groupingsCsv,
        dsaRatingCsv,
        creditRatingCsv,
        netInterestCsv,
        tdsExternalCsv,
        ggDebtCsv,
        externalDebtCsv,
        countriesSourcesCsv,
      ]) => {
        const countriesSourcesData = countriesSourcesCsv.map((d: any) => ({
          graph: d.graph,
          source: d.source,
          note: d.note,
          year: Number(d.year),
        }));
        setCountriesSources(countriesSourcesData);
        // ----- filtering Mongolia temporarily!!
        const countryData = groupingsCsv
          .filter(k => k.name !== 'Mongolia')
          .map((d: any) => ({
            ...d,
            label: d.name,
            value: d.iso,
          }));
        setSelectedCountry(countryData[0]);
        const dsaRatingData = dsaRatingCsv.map((d: any) => ({
          name: d.Country,
          code: d.iso,
          category: d['CRA rating'],
        }));
        const countryCreditData = creditRatingCsv.map((d: any) => ({
          name: d.Country,
          code: d.iso,
          value: Number(d['Credit rating score']),
        }));
        const netInterestData = netInterestCsv
          .filter((d: any) => {
            return Number(d['Net interest (% of revenue)']);
          })
          .map((d: any) => ({
            code: d.iso,
            year: Number(d.year),
            percentage: Number(d['Net interest (% of revenue)']),
            million: Number(d['Net interest ($ million)']),
          }));
        const tdsDebtData = tdsExternalCsv
          .filter((d: any) => {
            return Number(d['%  of revenue']) || Number(d['%  of exports']);
          })
          .map((d: any) => ({
            code: d.iso,
            year: Number(d.year),
            '% of revenue': Number(d['%  of revenue']),
            '% of exports': Number(d['%  of exports']),
          }));
        const debtToGdpData = ggDebtCsv
          .filter((d: any) => {
            return Number(d['GG debt (% of GDP)']);
          })
          .map((d: any) => ({
            code: d.iso,
            year: Number(d.year),
            percentage: Number(d['GG debt (% of GDP)']),
            million: Number(d['GG debt ($ billion)']),
          }));
        const externalDebtData = externalDebtCsv.map((d: any) => ({
          code: d.iso,
          year: Number(d.year),
          multilateral: Number(d['Multilateral ($ million)']),
          bilateral: Number(d['Bilateral ($ million)']),
          bonds: Number(d['Bonds ($ million)']),
          'other private': Number(d['Other private ($ million)']),
          total:
            Number(d['Multilateral ($ million)']) +
            Number(d['Bilateral ($ million)']) +
            Number(d['Bonds ($ million)']) +
            Number(d['Other private ($ million)']),
          'principal payments': Number(d['INT ($ million)']),
          'interest payment': Number(d['AMT ($ million)']),
        }));
        setCountryList(countryData as []);
        setNetInterest(netInterestData);
        setTdsExternalDebt(tdsDebtData as any);
        setDebtToGdp(debtToGdpData);
        setExternalDebt(externalDebtData);
        setCreditRating(countryCreditData);
        setDsaRating(dsaRatingData);
      },
    );
  }, []);
  return (
    <div className='undp-container'>
      {countryList !== undefined ? (
        <div
          className='margin-bottom-08'
          style={{ maxWidth: '1024px', margin: '0 auto' }}
        >
          <p className='undp-typography label'>Select a country</p>
          <Select
            options={countryList}
            className='undp-select'
            value={selectedCountry}
            showSearch
            style={{ width: '400px' }}
            filterOption={(
              input: string,
              option?: { label: string; value: string },
            ) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            onChange={d => {
              setSelectedCountry(
                countryList.filter((k: any) => k.value === d)[0],
              );
            }}
          />
          {selectedCountry ? (
            <div className='margin-top-08'>
              {selectedCountry.label} is part to the following groups:
              <br />
              <strong>
                {(groupsNames as any)[selectedCountry.Region]}
                {selectedCountry.IMF !== '..'
                  ? `, ${(groupsNames as any)[selectedCountry.IMF]}`
                  : ''}
                {groups.map(group =>
                  (selectedCountry as any)[group] === '1'
                    ? `, ${(groupsNames as any)[group]}`
                    : '',
                )}
                .
              </strong>
            </div>
          ) : null}
        </div>
      ) : null}
      {debtToGdp !== undefined &&
      netInterest &&
      tdsExternalDebt &&
      externalDebt &&
      creditRating &&
      dsaRating &&
      selectedCountry &&
      countriesSources ? (
        <AllCountries
          countryDebtToGdp={debtToGdp?.filter(
            d => d.code === selectedCountry.value,
          )}
          countryNetInterest={netInterest?.filter(
            d => d.code === selectedCountry.value,
          )}
          countryTdsExternal={tdsExternalDebt?.filter(
            d => d.code === selectedCountry.value,
          )}
          countryExternalDebt={externalDebt?.filter(
            d => d.code === selectedCountry.value,
          )}
          selectedCountry={selectedCountry}
          creditRating={creditRating}
          countryDsaRating={dsaRating?.filter(
            d => d.code === selectedCountry.value,
          )}
          countriesSources={countriesSources}
        />
      ) : null}
    </div>
  );
}

export default App;
