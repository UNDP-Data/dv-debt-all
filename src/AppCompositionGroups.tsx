/* eslint-disable @typescript-eslint/no-explicit-any */
import { csv } from 'd3-fetch';
import { useEffect, useState } from 'react';
import { CategoryData, ChartSourceType, CompositionGroupsType } from './Types';
import { StackedBarComposition } from './StackedBarComposition';
import './style.css';

function AppCompositionGroups() {
  const [compositionGroupsData, setCompositionGroupsData] = useState<
    CompositionGroupsType[] | undefined
  >();
  const [categoriesData, setCategoriesData] = useState<
    CategoryData[] | undefined
  >(undefined);
  const [sourcesData, setSourcesData] = useState<ChartSourceType[]>([]);
  const dataurl =
    'https://raw.githubusercontent.com/UNDP-Data/dv-debt-all-data-repo/main/';
  useEffect(() => {
    Promise.all([
      csv(`${dataurl}compositionGroups1.csv`),
      csv(`${dataurl}categories1.csv`),
      csv(`${dataurl}groups-sources1.csv`),
    ]).then(([data, categories, sources]) => {
      setCompositionGroupsData(data as any);
      setCategoriesData(categories as any);
      setSourcesData(sources as any);
    });
  }, []);
  return (
    <div className='undp-container'>
      {compositionGroupsData && categoriesData ? (
        <StackedBarComposition
          data={compositionGroupsData}
          categories={categoriesData}
          chartSource={
            sourcesData.filter(d => d.graph === 'Debt composition')[0]
          }
        />
      ) : null}
    </div>
  );
}

export default AppCompositionGroups;
