/* eslint-disable no-console */
import { useEffect, useRef, useState } from 'react';
import { Select, Radio, RadioChangeEvent } from 'antd';
import {
  CategoryData,
  ChartSourceType,
  CreditRatingType,
  DsaRatingType,
} from '../Types';
import { Graph } from './Graph';

interface Props {
  creditData: CreditRatingType[];
  dsaData: DsaRatingType[];
  categories: CategoryData[];
  chartSource: ChartSourceType;
}

const creditDsaOptions = ['Credit', 'DSA'];

export function StackedBarChart(props: Props) {
  const { dsaData, creditData, categories, chartSource } = props;
  const [creditDsaSelection, setCreditDsaSelection] = useState('Credit');
  const [categorySelection, setCategorySelection] = useState('All developing');
  const [selectedData, setSelectedData] = useState<object[]>(
    creditData.filter(d => d.Group === categorySelection),
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgWidth, setSvgWidth] = useState<number | 400>(400);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      setSvgWidth(entries[0].target.clientWidth);
    });
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);
  useEffect(() => {
    const data =
      creditDsaSelection === 'Credit'
        ? creditData.filter(d => d.Group === categorySelection)
        : dsaData.filter(d => d.Group === categorySelection);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setSelectedData(data as any);
  }, [categorySelection, creditDsaSelection]);
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
              Credit and DSA Debt distress rating: distribution of countries on
              rating classes
            </h6>
          </div>
          <div className='flex-div flex-space-between flex-wrap'>
            <div>
              <Radio.Group
                defaultValue={creditDsaSelection}
                onChange={(el: RadioChangeEvent) => {
                  setCreditDsaSelection(el.target.value);
                }}
              >
                {creditDsaOptions.map((d, i) => (
                  <Radio key={i} className='undp-radio' value={d}>
                    {d}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
          </div>
        </div>
        <div ref={containerRef}>
          <Graph data={selectedData} svgWidth={svgWidth} />
        </div>
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
