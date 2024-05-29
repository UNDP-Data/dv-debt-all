/* eslint-disable @typescript-eslint/no-explicit-any */
import { csv } from 'd3-fetch';
import { useEffect, useState } from 'react';
import { CategoryData, ChartSourceType } from './Types';
import { RegionLineChartNoOptions } from './RegionLineChart/index1';
import './style.css';

function AppNetInterestQuantiles() {
  const [externalDebtQuantiles, setExternalDebtQuantiles] = useState<
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
      csv(`${dataUrl1}externalDebtQuantiles1.csv`),
      csv(`${dataUrl1}categories1.csv`),
      csv(`${dataUrl1}groups-sources1.csv`),
    ]).then(([data, categories, sources]) => {
      setExternalDebtQuantiles(data as any);
      setCategoriesData1(categories as any);
      setSourcesData(sources as any);
    });
  }, []);
  return (
    <div className='undp-container'>
      {externalDebtQuantiles && categoriesData1 ? (
        <RegionLineChartNoOptions
          data={externalDebtQuantiles}
          categories={categoriesData1}
          title='Public and publicly guaranteed total external debt service as a
          percentage of revenue'
          yAxisName='Total debt service as % of revenue'
          id='externalDebtQuantilesLines'
          chartSource={
            sourcesData.filter(d => d.graph === 'External debt quantiles')[0]
          }
          option='external'
        />
      ) : null}
    </div>
  );
}

export default AppNetInterestQuantiles;
