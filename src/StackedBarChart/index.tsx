/* eslint-disable no-console */
import { useEffect, useRef, useState } from 'react';
import { Select, Radio, RadioChangeEvent } from 'antd';
import styled from 'styled-components';
import { CategoryData, CreditRatingType, DsaRatingType } from '../Types';
import { Graph } from './Graph';

interface Props {
  creditData: CreditRatingType[];
  dsaData: DsaRatingType[];
  categories: CategoryData[];
}

const GraphDiv = styled.div`
  @media (max-width: 960px) {
    height: 500px;
  }
`;
// const numberPercentOptions = ['number', 'percentage'];
const creditDsaOptions = ['credit', 'dsa'];

export function StackedBarChart(props: Props) {
  const { dsaData, creditData, categories } = props;
  // const [totalPercentSelection, setTotalPercentSelection] =
  //   useState('percentage');
  const [creditDsaSelection, setCreditDsaSelection] = useState('credit');
  const [categorySelection, setCategorySelection] = useState('All developing');
  // const [svgWidth, setSvgWidth] = useState(0);
  // const [svgHeight, setSvgHeight] = useState(0);
  const graphDiv = useRef<HTMLDivElement>(null);
  const [selectedData, setSelectedData] = useState<object[]>(
    creditData.filter(d => d.region === categorySelection),
  );
  useEffect(() => {
    const data =
      creditDsaSelection === 'credit'
        ? creditData.filter(d => d.region === categorySelection)
        : dsaData.filter(d => d.region === categorySelection);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setSelectedData(data as any);
  }, [categorySelection, creditDsaSelection]);
  return (
    <GraphDiv ref={graphDiv}>
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
        <div className='margin-bottom-03'>
          <div>
            <h6 className='undp-typography margin-bottom-01'>
              Credit rating and debt sustainability analysis (DSA) rating
            </h6>
            <p className='undp-typography small-font margin-bottom-01'>
              Years: 1995-2023
            </p>
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
        <Graph data={selectedData} />
        <p className='source'>
          Source: Credit rating based on S&P, Moody’s and FITCH long-term
          sovereign credit ratings as of September 3, 2023 accessed through
          Trading Economics. Note: Numerical rating is obtained using the
          ratings scale in Jensen (2022) and as a simple average across ratings.
          <br />
          DSA rating based on latest DSA ratings published by the IMF as of June
          30, 2023.
        </p>
      </div>
    </GraphDiv>
  );
}
