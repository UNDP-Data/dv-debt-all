/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { csv } from 'd3-fetch';
import { useEffect, useState } from 'react';
import { Select } from 'antd';
import { CountryNetInterest, CountryType } from './Types';
import { LineChart } from './LineChart';
import './style.css';

function App() {
  const [countryNetInterest, setCountryNetInterest] = useState<
    CountryNetInterest[] | undefined
  >();
  const [tdsExternalDebt, setTdsExternalDebt] = useState<
    CountryNetInterest[] | undefined
  >();
  const [countryList, setCountryList] = useState<CountryType[] | undefined>(
    undefined,
  );
  const [selectedCountry, setSelectedCountry] = useState<string>('AFG');
  const dataurl =
    'https://raw.githubusercontent.com/UNDP-Data/dv-debt-all-data-repo/main/countries/';
  useEffect(() => {
    Promise.all([
      csv(`${dataurl}dsaRating.csv`),
      csv(`${dataurl}netInterest.csv`),
      csv(`${dataurl}tdsExternalDebt.csv`),
    ]).then(([dsaRating, netInterest, tdsData]) => {
      const countryData = dsaRating.map((d: any) => ({
        label: d.name,
        value: d.iso,
      }));
      const netInterestData = netInterest
        .filter((d: any) => {
          return Number(d['Net interest percent']);
        })
        .map((d: any) => ({
          code: d.iso,
          year: Number(d.year),
          percentage: Number(d['Net interest percent']),
        }));
      const tdsDebtData = tdsData
        .filter((d: any) => {
          return Number(d['%  of revenue']) || Number(d['%  of exports']);
        })
        .map((d: any) => ({
          code: d.iso,
          year: Number(d.year),
          '% of revenue': Number(d['%  of revenue']),
          '% of exports': Number(d['%  of exports']),
        }));
      // console.log('tdsDebtDAta', tdsDebtData);
      setCountryList(countryData as []);
      setCountryNetInterest(netInterestData as any);
      setTdsExternalDebt(tdsDebtData as any);
    });
  }, []);
  return (
    <div className='undp-container'>
      <div className='margin-bottom-08'>
        <p className='undp-typography label'>Select a country</p>
        <Select
          options={countryList}
          className='undp-select'
          value={selectedCountry}
          showSearch
          style={{ width: '400px' }}
          onChange={d => setSelectedCountry(d.trim())}
        />
      </div>
      {countryNetInterest !== undefined ? (
        <LineChart
          data={countryNetInterest?.filter(d => d.code === selectedCountry)}
          indicators={['percentage']}
          id='countryNetInterest'
          title='Net interest payments (% of revenue)'
          yAxisLabel='% of revenue'
        />
      ) : null}
      {tdsExternalDebt !== undefined ? (
        <LineChart
          data={tdsExternalDebt?.filter(d => d.code === selectedCountry)}
          indicators={['% of revenue', '% of exports']}
          id='countryDebtService'
          title='Total debt service - PPG external debt'
          yAxisLabel=''
        />
      ) : null}
    </div>
  );
}

export default App;
