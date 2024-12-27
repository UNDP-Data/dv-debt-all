/* eslint-disable @typescript-eslint/no-explicit-any */
import { csv } from 'd3-fetch';
import { useEffect, useState } from 'react';
import { CategoryData, ChartSourceType, DebtServiceType } from './Types';
import { BarChart } from './BarChart';
import './style.css';

function AppExternalDebt() {
  const [debtServiceData, setDebtServiceData] = useState<
    DebtServiceType[] | undefined
  >();
  const [categoriesData, setCategoriesData] = useState<
    CategoryData[] | undefined
  >(undefined);
  const [sourcesData, setSourcesData] = useState<ChartSourceType[]>([]);
  const dataurl =
    'https://raw.githubusercontent.com/UNDP-Data/dv-debt-all-data-repo/main/';
  useEffect(() => {
    Promise.all([
      csv(`${dataurl}externalDebtService1.csv`),
      csv(`${dataurl}categories1.csv`),
      csv(`${dataurl}groups-sources1.csv`),
    ]).then(([data, categories, sources]) => {
      setDebtServiceData(data as any);
      setCategoriesData(categories as any);
      setSourcesData(sources as any);
    });
  }, []);
  return (
    <div className='undp-container'>
      {debtServiceData && categoriesData ? (
        <BarChart
          data={debtServiceData}
          categories={categoriesData}
          chartSource={
            sourcesData.filter(d => d.graph === 'External debt service')[0]
          }
        />
      ) : null}
    </div>
  );
}

export default AppExternalDebt;
