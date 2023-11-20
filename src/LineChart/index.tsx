/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import UNDPColorModule from 'undp-viz-colors';
// import { useState } from 'react';
import { extent } from 'd3-array';
import { Graph } from './Graph';

interface Props {
  data: object[];
  indicators: string[];
  id: string;
  title: string;
  yAxisLabel: string;
}

export function LineChart(props: Props) {
  const { data, indicators, id, title, yAxisLabel } = props;
  // year domain
  const yearsDomain = { min: 0, max: 3000 };
  indicators.forEach(indicator => {
    const indExtent = extent(data, (d: any) =>
      !d[indicator].isNaN ? d.year : null,
    );
    if (indExtent[0] > yearsDomain.min) yearsDomain.min = indExtent[0];
    if (indExtent[1] < yearsDomain.max) yearsDomain.max = indExtent[1];
  });
  const yearDomain = [yearsDomain.min as number, yearsDomain.max as number];
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
      <Graph
        data={data}
        indicators={indicators}
        id={id}
        yAxisLabel={yAxisLabel}
        yearDomain={yearDomain}
        svgWidth={960}
        svgHeight={550}
      />
      <p className='source'>
        Source: based on IMF World Economic Outlook, October 2023
      </p>
      <p className='source'>Note:</p>
    </div>
  );
}
