/* eslint-disable @typescript-eslint/no-explicit-any */
import { csv } from 'd3-fetch';
import { useEffect, useState } from 'react';
import { CategoryData, CompositionGroupsType } from './Types';
import { StackedBarComposition } from './StackedBarComposition';
import './style.css';

function App() {
  const [compositionGroupsData, setCompositionGroupsData] = useState<
    CompositionGroupsType[] | undefined
  >();
  const [categoriesData, setCategoriesData] = useState<
    CategoryData[] | undefined
  >(undefined);
  const dataurl =
    'https://raw.githubusercontent.com/UNDP-Data/dv-debt-all-data-repo/main/';
  useEffect(() => {
    Promise.all([
      csv(`${dataurl}compositionGroups.csv`),
      csv(`${dataurl}categories.csv`),
    ]).then(([data, categories]) => {
      setCompositionGroupsData(data as any);
      setCategoriesData(categories as any);
    });
  }, []);
  return (
    <div className='undp-container'>
      {compositionGroupsData && categoriesData ? (
        <StackedBarComposition
          data={compositionGroupsData}
          categories={categoriesData}
        />
      ) : null}
    </div>
  );
}

export default App;
