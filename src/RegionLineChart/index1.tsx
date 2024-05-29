/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { useState } from 'react';
import { Select } from 'antd';
import { CategoryData, ChartSourceType } from '../Types';
import { Graph } from './Graph';

interface Props {
  data: object[];
  categories: CategoryData[];
  title: string;
  yAxisName: string;
  id: string;
  chartSource: ChartSourceType;
  option: string;
}

export function RegionLineChartNoOptions(props: Props) {
  const { data, categories, title, yAxisName, id, chartSource, option } = props;
  const [categorySelection, setCategorySelection] = useState('All developing');
  return (
    <>
      <div>
        <div className='margin-bottom-05'>
          <div>
            <p className='label undp-typography'>Select a category</p>
            <Select
              options={categories.map(d => ({
                label: d.description,
                value: d.description,
              }))}
              className='undp-select'
              style={{ width: '100%' }}
              onChange={el => {
                setCategorySelection(el);
              }}
              value={categorySelection}
            />
          </div>
        </div>
      </div>
      <div className='chart-container'>
        <div className='flex-div flex-space-between flex-wrap'>
          <div>
            <h6 className='undp-typography margin-bottom-01 margin-top-03'>
              {title}
            </h6>
          </div>
        </div>
        <Graph
          data={data.filter(d => (d as any).Group === categorySelection)}
          option={option}
          svgWidth={960}
          svgHeight={550}
          id={id}
          yAxisName={yAxisName}
        />
        {chartSource?.source ? (
          <p className='source'>{`Source: ${chartSource.source}`}</p>
        ) : null}
        {chartSource?.note ? (
          <p className='source'>{`Note: ${chartSource.note}`}</p>
        ) : null}
      </div>
    </>
  );
}
