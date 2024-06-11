/* eslint-disable no-console */
import { useEffect, useRef, useState } from 'react';
import parse from 'html-react-parser';
import { Select } from 'antd';
import {
  CategoryData,
  ChartSourceType,
  CreditRatingType,
  DsaRatingType,
} from '../Types';
import { Graph } from './Graph';
import { DownloadImageButton } from '../Components/DownloadImageButton';
import { DownloadDataButton } from '../Components/DownloadDataButton';

interface Props {
  creditData: CreditRatingType[];
  dsaData: DsaRatingType[];
  categories: CategoryData[];
  chartSource: ChartSourceType;
  creditDsaSelection: 'Credit' | 'DSA';
}

export function DSACreditStackedBarChart(props: Props) {
  const { dsaData, creditData, categories, chartSource, creditDsaSelection } =
    props;
  const graphDiv = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [divToBeDownloaded, setDivToBeDownloaded] = useState<any>(null);
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
  useEffect(() => {
    setDivToBeDownloaded(graphDiv.current);
  }, [graphDiv.current]);
  return (
    <div className='chart-container'>
      <div ref={graphDiv}>
        <div className='margin-bottom-07 flex-div flex-space-between flex-vert-align-center'>
          <h6 className='undp-typography margin-bottom-00'>
            {creditDsaSelection} rating: distribution of countries on rating
            classes
          </h6>
          <div className='flex-div flex-vert-align-center no-shrink'>
            <DownloadImageButton element={divToBeDownloaded} />
            <DownloadDataButton link='https://github.com/UNDP-Data/dv-debt-all-data-repo/raw/main/ExcelData/CreditAndDSARating.xlsx' />
          </div>
        </div>
        <div className='margin-bottom-07 flex-div flex-vert-align-center'>
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
        <div ref={containerRef}>
          <Graph data={selectedData} svgWidth={svgWidth} />
        </div>
        {chartSource?.source ? (
          <p className='source'>{`Source: ${
            chartSource.source.split('.')[
              creditDsaSelection === 'Credit' ? 0 : 1
            ]
          }`}</p>
        ) : null}
        {chartSource?.note ? (
          <p className='source'>Note: {parse(chartSource.note)}</p>
        ) : null}
      </div>
    </div>
  );
}
