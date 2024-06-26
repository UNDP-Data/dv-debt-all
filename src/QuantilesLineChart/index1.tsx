/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { useEffect, useRef, useState } from 'react';
import { Select } from 'antd';
import { CategoryData, ChartSourceType } from '../Types';
import { Graph } from './Graph';
import { DownloadImageButton } from '../Components/DownloadImageButton';
import { DownloadDataButton } from '../Components/DownloadDataButton';

interface Props {
  data: object[];
  categories: CategoryData[];
  title: string;
  yAxisName: string;
  id: string;
  chartSource: ChartSourceType;
  option: string;
  link: string;
}

export function QuantilesLineChartNoOptions(props: Props) {
  const { data, categories, title, yAxisName, id, chartSource, option, link } =
    props;
  const graphDiv = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [divToBeDownloaded, setDivToBeDownloaded] = useState<any>(null);
  const [categorySelection, setCategorySelection] = useState('All developing');
  useEffect(() => {
    setDivToBeDownloaded(graphDiv.current);
  }, [graphDiv.current]);
  return (
    <div className='chart-container'>
      <div ref={graphDiv}>
        <div className='margin-bottom-07 flex-div flex-space-between flex-vert-align-center'>
          <h6 className='undp-typography margin-bottom-01 margin-top-03'>
            {title}
          </h6>
          <div className='flex-div no-shrink'>
            <DownloadImageButton element={divToBeDownloaded} />
            <DownloadDataButton link={link} />
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
          data={data.filter(d => (d as any).Group === categorySelection)}
          option={option}
          svgWidth={960}
          svgHeight={550}
          id={id}
          yAxisName={yAxisName}
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
