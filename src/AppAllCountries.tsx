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
  const [countryList, setCountryList] = useState<CountryType[] | undefined>(
    undefined,
  );
  const [selectedCountry, setSelectedCountry] = useState<string>('ALB');
  const dataurl =
    'https://raw.githubusercontent.com/UNDP-Data/dv-debt-all-data-repo/main/countries/';
  useEffect(() => {
    Promise.all([
      csv(`${dataurl}dsaRating.csv`), // 2. Ratings
      csv(`${dataurl}creditRating.csv`), // 2. Ratings
      csv(`${dataurl}netInterest.csv`), // 5. Net interest
      csv(`${dataurl}tdsExternalDebt.csv`), // 5. TDS externaldebt
      csv(`${dataurl}ggDebt.csv`), // 3.GG debt
      csv(`${dataurl}externalDebt.csv`), // 4. External debt
    ]).then(
      ([
        dsaRatingCsv,
        creditRatingCsv,
        netInterestCsv,
        tdsExternalCsv,
        ggDebtCsv,
        externalDebtCsv,
      ]) => {
        const countryData = dsaRatingCsv.map((d: any) => ({
          label: d.name,
          value: d.iso,
        }));
        const countryCreditData = creditRatingCsv.map((d: any) => ({
          name: d.name,
          code: d.iso,
          value: d.Numeric_scale_average,
        }));
        const netInterestData = netInterestCsv.map((d: any) => ({
          code: d.iso,
          year: Number(d.year),
          percentage: Number(d['Net interest percent']),
          million: Number(d['Net interest USD']),
        }));
        const tdsDebtData = tdsExternalCsv.map((d: any) => ({
          code: d.iso,
          year: Number(d.year),
          '% of revenue': Number(d['%  of revenue']),
          '% of exports': Number(d['%  of exports']),
        }));
        const debtToGdpData = ggDebtCsv.map((d: any) => ({
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
        // console.log('externalDebt', externalDebt);
        setCountryList(countryData as []);
        setNetInterest(netInterestData);
        setTdsExternalDebt(tdsDebtData as any);
        setDebtToGdp(debtToGdpData);
        setExternalDebt(externalDebtData);
        setCreditRating(countryCreditData);
        console.log('data loaded ----------');
      },
    );
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
      {debtToGdp !== undefined &&
      netInterest &&
      tdsExternalDebt &&
      externalDebt &&
      creditRating ? (
        <AllCountries
          countryDebtToGdp={debtToGdp?.filter(d => d.code === selectedCountry)}
          countryNetInterest={netInterest?.filter(
            d => d.code === selectedCountry,
          )}
          countryTdsExternal={tdsExternalDebt?.filter(
            d => d.code === selectedCountry,
          )}
          countryExternalDebt={externalDebt?.filter(
            d => d.code === selectedCountry,
          )}
          selectedCountry={selectedCountry}
          creditRating={creditRating}
        />
      ) : null}
    </div>
  );
}

export default App;
