/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { csv } from 'd3-fetch';
import { useEffect, useState } from 'react';
import {
  CategoryData,
  ChartSourceType,
  CreditRatingType,
  DsaRatingType,
} from './Types';
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
  const [sourcesData, setSourcesData] = useState<ChartSourceType[]>([]);
  const dataurl =
    'https://raw.githubusercontent.com/UNDP-Data/dv-debt-all-data-repo/main/';
  useEffect(() => {
    Promise.all([
      csv(`${dataurl}creditRating1.csv`),
      csv(`${dataurl}dsaRating1.csv`),
      csv(`${dataurl}categories1.csv`),
      csv(`${dataurl}groups-sources1.csv`),
    ]).then(([creditData, dsaData, regions, sources]) => {
      setCreditRatingData(creditData as any);
      setDsaRatingData(dsaData as any);
      setCategoriesData(regions as any);
      setSourcesData(sources as any);
    });
  }, []);
  return (
    <div className='undp-container'>
      {creditRatingData && dsaRatingData && categoriesData ? (
        <StackedBarChart
          creditData={creditRatingData}
          dsaData={dsaRatingData}
          categories={categoriesData}
          chartSource={
            sourcesData.filter(d => d.graph === 'Credit and DSA Ratings')[0]
          }
        />
      ) : null}
    </div>
  );
}

export default App;
