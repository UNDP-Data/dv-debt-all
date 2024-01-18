/* eslint-disable no-console */
import { useState } from 'react';
import { Select, Radio, RadioChangeEvent } from 'antd';
import { DebtGdp, CategoryData, ChartSourceType } from '../Types';
import { Graph } from './Graph';

interface Props {
  data: DebtGdp[];
  categories: CategoryData[];
  chartSource: ChartSourceType;
}

const totalExternalOptions = ['total', 'external'];

export function RegionLineChart(props: Props) {
  const { data, categories, chartSource } = props;
  const [totalExternalSelection, setTotalExternalSelection] = useState('total');
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
              Government debt as a percentage of GDP
            </h6>
          </div>
          <div>
            <Radio.Group
              defaultValue={totalExternalSelection}
              onChange={(el: RadioChangeEvent) =>
                setTotalExternalSelection(el.target.value)
              }
            >
              {totalExternalOptions.map((d, i) => (
                <Radio key={i} className='undp-radio' value={d}>
                  {d}
                </Radio>
              ))}
            </Radio.Group>
          </div>
        </div>
        <Graph
          data={data.filter(d => d.Group === categorySelection)}
          option={totalExternalSelection}
          svgWidth={960}
          svgHeight={550}
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
