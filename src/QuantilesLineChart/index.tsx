/* eslint-disable no-console */
import { useEffect, useRef, useState } from 'react';
import { Select, Radio, RadioChangeEvent } from 'antd';
import { DebtGdp, CategoryData, ChartSourceType } from '../Types';
import { Graph } from './Graph';
import { DownloadImageButton } from '../Components/DownloadImageButton';
import { DownloadDataButton } from '../Components/DownloadDataButton';

interface Props {
  data: DebtGdp[];
  categories: CategoryData[];
  chartSource: ChartSourceType;
}

const totalExternalOptions = ['total', 'external'];

export function QuantilesLineChart(props: Props) {
  const { data, categories, chartSource } = props;
  const graphDiv = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [divToBeDownloaded, setDivToBeDownloaded] = useState<any>(null);
  const [totalExternalSelection, setTotalExternalSelection] = useState('total');
  const [categorySelection, setCategorySelection] = useState('All developing');
  const dateDomain = data
    .map(d => (d.year !== '' ? parseInt(d.year, 10) : -99))
    .filter(d => d !== -99);
  useEffect(() => {
    setDivToBeDownloaded(graphDiv.current);
  }, [graphDiv.current]);
  return (
    <div className='chart-container'>
      <div ref={graphDiv}>
        <div className='margin-bottom-07 flex-div flex-space-between flex-vert-align-center'>
          <h6 className='undp-typography margin-bottom-00'>
            Government debt as a percentage of GDP ({Math.min(...dateDomain)} -{' '}
            {Math.max(...dateDomain)})
          </h6>
          <div className='flex-div flex-vert-align-center no-shrink'>
            <Radio.Group
              optionType='button'
              className='undp-button-radio'
              size='small'
              defaultValue={totalExternalSelection}
              onChange={(el: RadioChangeEvent) =>
                setTotalExternalSelection(el.target.value)
              }
            >
              {totalExternalOptions.map((d, i) => (
                <Radio key={i} className='undp-radio' value={d}>
                  {d[0].toUpperCase() + d.slice(1)}
                </Radio>
              ))}
            </Radio.Group>
            <DownloadImageButton element={divToBeDownloaded} />
            <DownloadDataButton link='https://github.com/UNDP-Data/dv-debt-all-data-repo/raw/main/ExcelData/DebtToGDPQuantile.xlsx' />
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
          option={totalExternalSelection}
          svgWidth={960}
          svgHeight={550}
          id='debtToGdpLine'
          yAxisName='Debt as % of GDP'
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
