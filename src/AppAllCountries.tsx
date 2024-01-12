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
  const [selectedCountry, setSelectedCountry] = useState<CountryType>({
    label: 'Afghanistan',
    value: 'AFG',
  });
  const [countriesSources, setCountriesSources] = useState<ChartSourceType[]>(
    [],
  );
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
        const countryData = groupingsCsv.map((d: any) => ({
          label: d.name,
          value: d.iso,
        }));
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
            defaultValue={selectedCountry}
            showSearch
            style={{ width: '400px' }}
            onChange={d => {
              setSelectedCountry(
                countryList.filter((k: any) => k.value === d)[0],
              );
            }}
          />
        </div>
      ) : null}
      {debtToGdp !== undefined &&
      netInterest &&
      tdsExternalDebt &&
      externalDebt &&
      creditRating &&
      dsaRating &&
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
