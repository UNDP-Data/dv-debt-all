/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { useState } from 'react';
import { Select, Radio, RadioChangeEvent } from 'antd';
import UNDPColorModule from 'undp-viz-colors';
import { DebtNetInterestType, CategoryData, ChartSourceType } from '../Types';
import { Graph } from './Graph';

interface Props {
  data: DebtNetInterestType[];
  categories: CategoryData[];
  chartSource: ChartSourceType;
}

const numberPercentOptions = ['Number', 'Percentage'];

export function DebtInterestBars(props: Props) {
  const { data, categories, chartSource } = props;
  const periods = [...new Set(data.map(d => d.period))].sort();
  const [totalPercentSelection, setTotalPercentSelection] = useState('Number');
  const [categorySelection, setCategorySelection] = useState('All developing');
  return (
    <>
      <div>
        <div className='margin-bottom-05'>
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
      <div className='chart-container'>
        <div className='margin-bottom-03'>
          <div>
            <h6 className='undp-typography margin-bottom-01'>
              Number of countries with net interest payments higher than 5 to 40
              percent of revenue today relative to a decade ago
            </h6>
          </div>
          <div className='flex-div flex-space-between flex-wrap'>
            <div className='legend-container'>
              <div className='legend-item'>
                <div
                  className='legend-circle-medium'
                  style={{
                    backgroundColor:
                      UNDPColorModule.categoricalColors.colors[0],
                  }}
                />
                <div className='small-font'>Average {(periods as any)[0]}</div>
              </div>
              <div className='legend-item'>
                <div
                  className='legend-circle-medium'
                  style={{
                    backgroundColor:
                      UNDPColorModule.categoricalColors.colors[1],
                  }}
                />
                <div className='small-font'>Average {(periods as any)[1]}</div>
              </div>
            </div>
            <div>
              <Radio.Group
                defaultValue={totalPercentSelection}
                onChange={(el: RadioChangeEvent) => {
                  setTotalPercentSelection(el.target.value);
                }}
              >
                {numberPercentOptions.map((d, i) => (
                  <Radio key={i} className='undp-radio' value={d}>
                    {d}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
          </div>
        </div>
        <Graph
          data={data.filter(
            d =>
              d.Group === categorySelection &&
              d.option === totalPercentSelection,
          )}
          option1={totalPercentSelection}
          svgWidth1={960}
          svgHeight1={550}
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
