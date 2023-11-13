/* eslint-disable no-console */
import { useState } from 'react';
import { Select, Radio, RadioChangeEvent } from 'antd';
import UNDPColorModule from 'undp-viz-colors';
import { DebtNetInterestType, CategoryData } from '../Types';
import { Graph } from './Graph';

interface Props {
  data1: DebtNetInterestType[];
  categories1: CategoryData[];
}

const numberPercentOptions = ['Number', 'Percentage'];

export function DebtInterestBars(props: Props) {
  const { data1, categories1 } = props;
  const [totalPercentSelection, setTotalPercentSelection] = useState('Number');
  const [categorySelection1, setCategorySelection1] =
    useState('All developing');
  return (
    <>
      <div>
        <div className='margin-bottom-05'>
          <p className='label undp-typography'>Select a category</p>
          <Select
            options={categories1.map(d => ({
              label: d.description,
              value: d.description,
            }))}
            className='undp-select'
            style={{ width: '100%' }}
            onChange={el => {
              setCategorySelection1(el);
            }}
            value={categorySelection1}
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
                <div className='small-font'>2011-2013</div>
              </div>
              <div className='legend-item'>
                <div
                  className='legend-circle-medium'
                  style={{
                    backgroundColor:
                      UNDPColorModule.categoricalColors.colors[1],
                  }}
                />
                <div className='small-font'>2021-2023</div>
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
          data1={data1.filter(
            d =>
              d.region === categorySelection1 &&
              d.option === totalPercentSelection,
          )}
          option1={totalPercentSelection}
          svgWidth1={960}
          svgHeight1={550}
        />
        <p className='source'>
          Source: based on IMF World Economic Outlook, October 2023
        </p>
        <p className='source'>
          Notes: Numbers refer to averages across the three years. The
          &apos;percentage&apos; option shows the number of countries as a share
          of total.
        </p>
      </div>
    </>
  );
}
