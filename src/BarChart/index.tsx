/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import { Select, Radio, RadioChangeEvent } from 'antd';
import { extent } from 'd3-array';
import { DebtServiceType, CategoryData, ChartSourceType } from '../Types';
import { Graph } from './Graph';

interface Props {
  data: DebtServiceType[];
  categories: CategoryData[];
  chartSource: ChartSourceType;
}

const numberPercentOptions = ['number', 'percentage'];
const revenueExportsOptions = ['revenue', 'exports'];

export function BarChart(props: Props) {
  const { data, categories, chartSource } = props;
  const [totalPercentSelection, setTotalPercentSelection] = useState('number');
  const [revenueExportsSelection, setRevenueExportsSelection] =
    useState('revenue');
  const [categorySelection, setCategorySelection] = useState('All developing');
  const [domain, setDomain] = useState<
    [number, number] | [undefined, undefined]
  >([2000, 2024]);
  useEffect(() => {
    const combiOption = `number_${revenueExportsSelection}`;
    const categoryData = data.filter(d => d.Group === categorySelection);
    const extentValue = extent(categoryData, d =>
      Number((d as any)[combiOption]) ? Number(d.year) : null,
    );
    setDomain(extentValue);
  }, [revenueExportsSelection, categorySelection]);
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
        <div className='margin-bottom-03'>
          <div>
            <h6 className='undp-typography margin-bottom-01'>
              Number/percentage of countries for which external public total
              (AMT+INT) debt service exceeds 20% of revenue/exports and primary
              income
            </h6>
            <p className='undp-typography small-font margin-bottom-01'>
              Years: {domain[0]} - {domain[1]}
            </p>
          </div>
          <div className='flex-div flex-space-between flex-wrap'>
            <div>
              <Radio.Group
                defaultValue={totalPercentSelection}
                onChange={(el: RadioChangeEvent) => {
                  setTotalPercentSelection(el.target.value);
                }}
              >
                {numberPercentOptions.map((d, i) => (
                  <Radio key={i} className='undp-radio' value={d}>
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
            <div>
              <Radio.Group
                defaultValue={revenueExportsSelection}
                onChange={(el: RadioChangeEvent) => {
                  setRevenueExportsSelection(el.target.value);
                }}
              >
                {revenueExportsOptions.map((d, i) => (
                  <Radio key={i} className='undp-radio' value={d}>
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
          </div>
        </div>
        <Graph
          data={data.filter(d => d.Group === categorySelection)}
          totalPercentOption={totalPercentSelection}
          revenueExportsOption={revenueExportsSelection}
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
