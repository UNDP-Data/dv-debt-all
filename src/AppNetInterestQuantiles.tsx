/* eslint-disable @typescript-eslint/no-explicit-any */
import { csv } from 'd3-fetch';
import { useEffect, useState } from 'react';
import { CategoryData, ChartSourceType } from './Types';
import { RegionLineChartNoOptions } from './RegionLineChart/index1';
import './style.css';

function AppNetInterestQuantiles() {
  const [debtNetInterest, setDebtNetInterest] = useState<
    object[] | undefined
  >();
  const [categoriesData1, setCategoriesData1] = useState<
    CategoryData[] | undefined
  >(undefined);
  const [sourcesData, setSourcesData] = useState<ChartSourceType[]>([]);
  const dataUrl1 =
    'https://raw.githubusercontent.com/UNDP-Data/dv-debt-all-data-repo/main/';
  useEffect(() => {
    Promise.all([
      csv(`${dataUrl1}debtNetInterestQuantiles1.csv`),
      csv(`${dataUrl1}categories1.csv`),
      csv(`${dataUrl1}groups-sources1.csv`),
    ]).then(([data, categories, sources]) => {
      setDebtNetInterest(data as any);
      setCategoriesData1(categories as any);
      setSourcesData(sources as any);
    });
  }, []);
  return (
    <div className='undp-container'>
      {debtNetInterest && categoriesData1 ? (
        <RegionLineChartNoOptions
          data={debtNetInterest}
          categories={categoriesData1}
          title='General government net interest payments as percentage of revenue'
          yAxisName='Net interest as % of revenue'
          id='netInterestLine'
          chartSource={
            sourcesData.filter(
              d => d.graph === 'Net interest payments to revenue',
            )[0]
          }
          option='netInterest'
        />
      ) : null}
    </div>
  );
}

export default AppNetInterestQuantiles;
