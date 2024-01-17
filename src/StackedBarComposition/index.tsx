/* eslint-disable no-console */
import { useEffect, useRef, useState } from 'react';
import { Select } from 'antd';
import { CategoryData, ChartSourceType, CompositionGroupsType } from '../Types';
import { Graph } from './Graph';

interface Props {
  data: CompositionGroupsType[];
  categories: CategoryData[];
  chartSource: ChartSourceType;
}

export function StackedBarComposition(props: Props) {
  const { data, categories, chartSource } = props;
  const [categorySelection, setCategorySelection] = useState('All developing');
  const [selectedData, setSelectedData] = useState<object>(
    data.filter(d => d.Group === categorySelection)[0],
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
    const groupData = data.filter(d => d.Group === categorySelection)[0];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setSelectedData(groupData as object);
  }, [categorySelection]);
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
              Debt composition
            </h6>
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
