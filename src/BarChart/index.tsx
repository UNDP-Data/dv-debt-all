/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { useEffect, useRef, useState } from 'react';
import { Select, Radio, RadioChangeEvent } from 'antd';
import { extent } from 'd3-array';
import { DebtServiceType, CategoryData, ChartSourceType } from '../Types';
import { Graph } from './Graph';
import { DownloadImageButton } from '../Components/DownloadImageButton';
import { DownloadDataButton } from '../Components/DownloadDataButton';

interface Props {
  data: DebtServiceType[];
  categories: CategoryData[];
  chartSource: ChartSourceType;
}

const numberPercentOptions = ['number', 'percentage'];
const revenueExportsOptions = ['revenue', 'exports'];

export function BarChart(props: Props) {
  const { data, categories, chartSource } = props;
  const graphDiv = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [divToBeDownloaded, setDivToBeDownloaded] = useState<any>(null);
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
  useEffect(() => {
    setDivToBeDownloaded(graphDiv.current);
  }, [graphDiv.current]);
  return (
    <div className='chart-container'>
      <div ref={graphDiv}>
        <div className='margin-bottom-07 flex-div flex-space-between flex-vert-align-center'>
          <h6 className='undp-typography margin-bottom-00'>
            Number/percentage of countries for which external public total
            (AMT+INT) debt service exceeds 20% of revenue/exports and primary
            income {domain[0]} - {domain[1]}
          </h6>
          <div className='flex-div flex-vert-align-center no-shrink'>
            <Radio.Group
              optionType='button'
              className='undp-button-radio'
              size='small'
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
            <Radio.Group
              optionType='button'
              className='undp-button-radio'
              size='small'
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
            <DownloadImageButton element={divToBeDownloaded} />
            <DownloadDataButton link='https://github.com/UNDP-Data/dv-debt-all-data-repo/raw/main/ExcelData/ExternalDebtService.xlsx' />
          </div>
        </div>
        <div className='margin-bottom-07'>
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
    </div>
  );
}
