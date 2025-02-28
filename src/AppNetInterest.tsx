/* eslint-disable @typescript-eslint/no-explicit-any */
import { csv } from 'd3-fetch';
import { useEffect, useState } from 'react';
import { DebtNetInterestType, CategoryData, ChartSourceType } from './Types';
import { DebtInterestBars } from './DebtInterestBars';
import './style.css';

function AppNetInterest() {
  const [debtNetInterest, setDebtNetInterest] = useState<
    DebtNetInterestType[] | undefined
  >();
  const [categoriesData1, setCategoriesData1] = useState<
    CategoryData[] | undefined
  >(undefined);
  const [sourcesData, setSourcesData] = useState<ChartSourceType[]>([]);
  const dataUrl1 =
    'https://raw.githubusercontent.com/UNDP-Data/dv-debt-all-data-repo/main/';
  useEffect(() => {
    Promise.all([
      csv(`${dataUrl1}debtNetInterest1.csv`),
      csv(`${dataUrl1}categories1.csv`),
      csv(`${dataUrl1}groups-sources1.csv`),
    ]).then(([data, categories, sources]) => {
      const newData = data.map((d: any) => ({
        Group: d.Group,
        option: d.option,
        period: d.period,
        percentages: Object.entries(d).filter(k => Number(k[0])),
      }));
      setDebtNetInterest(newData as any);
      setCategoriesData1(categories as any);
      setSourcesData(sources as any);
    });
  }, []);
  return (
    <div className='undp-container'>
      {debtNetInterest && categoriesData1 ? (
        <DebtInterestBars
          data={debtNetInterest}
          categories={categoriesData1}
          chartSource={
            sourcesData.filter(d => d.graph === 'Net interest payments')[0]
          }
        />
      ) : null}
    </div>
  );
}

export default AppNetInterest;
