/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import UNDPColorModule from 'undp-viz-colors';
// import { extent } from 'd3-array';
import { useRef, useEffect, useState } from 'react';
import { Graph } from './Graph';
import { ChartSourceType } from '../../Types';

interface Props {
  data: object[];
  indicators: string[];
  id: string;
  title: string;
  svgHeight: number;
  selectedCountryCode: string;
  chartSource: ChartSourceType;
}

export function LineChart(props: Props) {
  const {
    data,
    indicators,
    id,
    title,
    selectedCountryCode,
    svgHeight,
    chartSource,
  } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgWidth, setSvgWidth] = useState<number | 400>(400);
  const yearsDomain = [2000, 2025];

  // dynamic years domain not being used as the domain is fixed to 2000-2025 for all countries even when there's no data
  /* const yearsDomain = [0, 3000]; // { min: 0, max: 3000 };
  indicators.forEach(indicator => {
    const indExtent = extent(data, (d: any) =>
      !d[indicator].isNaN ? d.year : null,
    );
    // (indicator, indExtent);
    if (indExtent[0] > yearsDomain[0]) yearsDomain[0] = indExtent[0];
    if (indExtent[1] < yearsDomain[1]) yearsDomain[1] = indExtent[1];
  }); */

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      setSvgWidth(entries[0].target.clientWidth);
    });
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);
  return (
    <div className='chart-container flex-half-screen'>
      <div className='flex-div flex-space-between flex-wrap margin-bottom-03'>
        <div>
          <h6 className='undp-typography margin-bottom-01'>{title}</h6>
          {data.length > 0 ? (
            <>
              <p className='undp-typography small-font margin-bottom-01'>
                Years: {yearsDomain[0]} - {yearsDomain[1]}
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
                    <div className='small-font'>
                      {k[0].toUpperCase() + k.slice(1)}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
      <div ref={containerRef} className='margin-bottom-02 flex-half-screen'>
        {data.length > 0 ? (
          <Graph
            data={data}
            indicators={indicators}
            id={id}
            yearDomain={yearsDomain}
            svgWidth={svgWidth}
            svgHeight={svgHeight}
            selectedCountryCode={selectedCountryCode}
          />
        ) : (
          <div className='center-area-error-el'>No data available</div>
        )}
      </div>
      {data.length > 0 ? (
        <>
          {chartSource?.source ? (
            <p className='source'>{`Source: ${chartSource.source}`}</p>
          ) : null}
          {chartSource?.note ? (
            <p className='source'>{`Note: ${chartSource.note}`}</p>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
