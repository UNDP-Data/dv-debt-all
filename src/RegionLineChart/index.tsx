/* eslint-disable no-console */
import { useState } from 'react';
import { Select, Radio, RadioChangeEvent } from 'antd';
import UNDPColorModule from 'undp-viz-colors';
import { DebtGdp, CategoryData } from '../Types';
import { Graph } from './Graph';

interface Props {
  data: DebtGdp[];
  categories: CategoryData[];
}

const totalExternalOptions = ['total', 'external'];

export function RegionLineChart(props: Props) {
  const { data, categories } = props;
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
                value: d.category,
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
        <div className='flex-div flex-space-between flex-wrap margin-bottom-03'>
          <div>
            <h6 className='undp-typography margin-bottom-01'>
              General government debt as a percentage of GDP
            </h6>
            <p className='undp-typography small-font margin-bottom-01'>
              Years: 2000-2023
            </p>
            <div className='legend-container'>
              <div className='legend-item'>
                <div
                  className='legend-circle-medium'
                  style={{
                    backgroundColor:
                      UNDPColorModule.categoricalColors.colors[0],
                  }}
                />
                <div className='small-font'>Median</div>
              </div>
              <div className='legend-item'>
                <div
                  className='legend-circle-medium'
                  style={{
                    backgroundColor:
                      UNDPColorModule.categoricalColors.colors[1],
                  }}
                />
                <div className='small-font'>Interquartile range</div>
              </div>
            </div>
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
          data={data.filter(d => d.region === categorySelection)}
          option={totalExternalSelection}
          svgWidth={960}
          svgHeight={550}
        />
        <p className='source'>
          Source: based on IMF World Economic Outlook, October 2023
        </p>
        <p className='source'>
          Note: Interquartile range refers to the spread of the middle half of
          the data.
        </p>
      </div>
    </>
  );
}
