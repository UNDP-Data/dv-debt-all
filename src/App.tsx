/* eslint-disable @typescript-eslint/no-explicit-any */
import { csv } from 'd3-fetch';
import { useEffect, useState } from 'react';
import { DebtGdp, CategoryData, ChartSourceType } from './Types';
import { QuantilesLineChart } from './QuantilesLineChart';
import './style.css';

function App() {
  const [debtToGdpData, setDebtToGdpData] = useState<DebtGdp[] | undefined>();
  const [categoriesData, setCategoriesData] = useState<
    CategoryData[] | undefined
  >(undefined);
  const [sourcesData, setSourcesData] = useState<ChartSourceType[]>([]);
  const dataurl =
    'https://raw.githubusercontent.com/UNDP-Data/dv-debt-all-data-repo/main/';
  useEffect(() => {
    Promise.all([
      csv(`${dataurl}debtToGDPquantiles1.csv`),
      csv(`${dataurl}categories1.csv`),
      csv(`${dataurl}groups-sources1.csv`),
    ]).then(([data, categories, sources]) => {
      setDebtToGdpData(data as any);
      setCategoriesData(categories as any);
      setSourcesData(sources as any);
    });
  }, []);
  return (
    <div className='undp-container'>
      {debtToGdpData && categoriesData ? (
        <QuantilesLineChart
          data={debtToGdpData}
          categories={categoriesData}
          chartSource={sourcesData.filter(d => d.graph === 'Debt to GDP')[0]}
        />
      ) : null}
    </div>
  );
}

export default App;
