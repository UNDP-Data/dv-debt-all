/* eslint-disable no-console */
import { useEffect, useRef, useState } from 'react';
import { ChartSourceType, ExternalDebtType } from '../../Types';
import { Graph } from './Graph';

interface Props {
  data: ExternalDebtType[];
  sections: string[];
  id: string;
  title: string;
  chartSource: ChartSourceType;
}

export function StackedBarChartSimple(props: Props) {
  const { data, sections, id, title, chartSource } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgWidth, setSvgWidth] = useState<number | 400>(400);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      setSvgWidth(entries[0].target.clientWidth);
    });
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);
  return (
    <div className='chart-container'>
      <div className='margin-bottom-03'>
        <div>
          <h6 className='undp-typography margin-bottom-01'>{title}</h6>
        </div>
      </div>
      {data.length > 0 && data !== undefined ? (
        <div ref={containerRef}>
          <Graph
            data={data}
            sections={sections}
            id={id}
            maxValue={data[0].total}
            svgWidth={svgWidth}
          />
          {chartSource.source ? (
            <p className='source'>{`Source: ${chartSource.source}`}</p>
          ) : null}
          {chartSource.note ? (
            <p className='source'>{`Note: ${chartSource.note}`}</p>
          ) : null}
        </div>
      ) : (
        <div className='center-area-error-el'>No data available</div>
      )}
    </div>
  );
}
