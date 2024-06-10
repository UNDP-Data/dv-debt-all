/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { useEffect, useRef, useState } from 'react';
import { Select, Radio, RadioChangeEvent } from 'antd';
import { DebtNetInterestType, CategoryData, ChartSourceType } from '../Types';
import { Graph } from './Graph';
import { DownloadImageButton } from '../Components/DownloadImageButton';
import { DownloadDataButton } from '../Components/DownloadDataButton';

interface Props {
  data: DebtNetInterestType[];
  categories: CategoryData[];
  chartSource: ChartSourceType;
}

const numberPercentOptions = ['Number', 'Percentage'];

export function DebtInterestBars(props: Props) {
  const { data, categories, chartSource } = props;
  const graphDiv = useRef<HTMLDivElement>(null);
  const [divToBeDownloaded, setDivToBeDownloaded] = useState<any>(null);
  const [totalPercentSelection, setTotalPercentSelection] = useState('Number');
  const [categorySelection, setCategorySelection] = useState('All developing');
  useEffect(() => {
    setDivToBeDownloaded(graphDiv.current);
  }, [graphDiv.current]);
  return (
    <div className='chart-container'>
      <div ref={graphDiv}>
        <div className='margin-bottom-07 flex-div flex-space-between flex-vert-align-center'>
          <h6 className='undp-typography margin-bottom-00'>
            Number of countries with net interest payments higher than 5 to 40
            percent of revenue today relative to a decade ago
          </h6>
          <div className='flex-div flex-vert-align-center no-shrink'>
            {divToBeDownloaded ? (
              <DownloadImageButton element={divToBeDownloaded} />
            ) : null}
            <DownloadDataButton link='https://github.com/UNDP-Data/dv-debt-all-data-repo/raw/main/ExcelData/DebtNetInterest.xlsx' />
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
          <div className='flex-div no-shrink'>
            <Radio.Group
              optionType='button'
              className='undp-button-radio'
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
    </div>
  );
}
