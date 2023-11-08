/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { csv } from 'd3-fetch';
import { useEffect, useState } from 'react';
import { CategoryData, CreditRatingType, DsaRatingType } from './Types';
import { StackedBarChart } from './StackedBarChart';
import './style.css';

function App() {
  const [creditRatingData, setCreditRatingData] = useState<
    CreditRatingType[] | undefined
  >();
  const [dsaRatingData, setDsaRatingData] = useState<
    DsaRatingType[] | undefined
  >();
  const [categoriesData, setCategoriesData] = useState<
    CategoryData[] | undefined
  >(undefined);
  const dataurl =
    'https://raw.githubusercontent.com/UNDP-Data/dv-debt-all-data-repo/main/';
  useEffect(() => {
    Promise.all([
      csv(`${dataurl}creditRating.csv`),
      csv(`${dataurl}dsaRating.csv`),
      csv(`${dataurl}categories.csv`),
    ]).then(([creditData, dsaData, regions]) => {
      setCreditRatingData(creditData as any);
      setDsaRatingData(dsaData as any);
      setCategoriesData(regions as any);
    });
  }, []);
  return (
    <div className='undp-container'>
      {creditRatingData && dsaRatingData && categoriesData ? (
        <StackedBarChart
          creditData={creditRatingData}
          dsaData={dsaRatingData}
          categories={categoriesData}
        />
      ) : null}
    </div>
  );
}

export default App;
