/* eslint-disable no-console */
import { useEffect, useRef, useState } from 'react';
import { Select, Radio, RadioChangeEvent } from 'antd';
import { CategoryData, CreditRatingType, DsaRatingType } from '../Types';
import { Graph } from './Graph';

interface Props {
  creditData: CreditRatingType[];
  dsaData: DsaRatingType[];
  categories: CategoryData[];
}

const creditDsaOptions = ['credit', 'dsa'];

export function StackedBarChart(props: Props) {
  const { dsaData, creditData, categories } = props;
  const [creditDsaSelection, setCreditDsaSelection] = useState('credit');
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
      creditDsaSelection === 'credit'
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
        <p className='source'>
          Source: Credit rating based on S&P, Moody’s and FITCH long-term
          sovereign credit ratings as of September 3, 2023 accessed through
          Trading Economics.
        </p>
        <p className='source'>
          Note: Numerical rating is obtained using the ratings scale in Jensen
          (2022) and as a simple average across ratings.
          <br />
          DSA rating based on latest DSA ratings published by the IMF as of
          August 31st, 2023.
        </p>
      </div>
    </>
  );
}
