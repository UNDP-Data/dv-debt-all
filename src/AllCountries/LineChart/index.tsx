/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import UNDPColorModule from 'undp-viz-colors';
import { extent } from 'd3-array';
import { useRef, useEffect, useState } from 'react';
import { Graph } from './Graph';

interface Props {
  data: object[];
  indicators: string[];
  id: string;
  title: string;
  selectedCountryCode: string;
}

export function LineChart(props: Props) {
  const { data, indicators, id, title, selectedCountryCode } = props;
  const yearsDomain = { min: 0, max: 3000 };
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgWidth, setSvgWidth] = useState<number | 400>(400);
  const [svgHeight, setSvgHeight] = useState<number | 180>(180);
  indicators.forEach(indicator => {
    const indExtent = extent(data, (d: any) =>
      !d[indicator].isNaN ? d.year : null,
    );
    // (indicator, indExtent);
    if (indExtent[0] > yearsDomain.min) yearsDomain.min = indExtent[0];
    if (indExtent[1] < yearsDomain.max) yearsDomain.max = indExtent[1];
  });
  const yearDomain = [yearsDomain.min as number, yearsDomain.max as number];
  useEffect(() => {
    if (containerRef.current) {
      setSvgWidth(containerRef.current.clientWidth);
      setSvgHeight(containerRef.current.clientHeight);
    }
  }, []);
  return (
    <div className='chart-container'>
      <div className='flex-div flex-space-between flex-wrap margin-bottom-03'>
        <div>
          <h6 className='undp-typography margin-bottom-01'>{title}</h6>
          <p className='undp-typography small-font margin-bottom-01'>
            Years: {yearsDomain.min} - {yearsDomain.max}
          </p>
          <div className='legend-container'>
            {indicators.map((k, j) => (
              <div key={j} className='legend-item'>
                <div
                  className='legend-circle-medium'
                  style={{
                    backgroundColor:
                      UNDPColorModule.categoricalColors.colors[j],
                  }}
                />
                <div className='small-font'>{k}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div ref={containerRef} className='margin-bottom-02'>
        <Graph
          data={data}
          indicators={indicators}
          id={id}
          yearDomain={yearDomain}
          svgWidth={svgWidth}
          svgHeight={svgHeight}
          selectedCountryCode={selectedCountryCode}
        />
      </div>
      <p className='source'>
        Source: based on IMF World Economic Outlook, October 2023
      </p>
      <p className='source'>Note:</p>
    </div>
  );
}
