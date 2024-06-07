/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import parse from 'html-react-parser';
import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';
import { Tooltip } from 'antd';
import UNDPColorModule from 'undp-viz-colors';
import { useRef, useState, useEffect } from 'react';
import { ChartSourceType, CountryValueType } from '../Types';

interface Props {
  data: CountryValueType[];
  selectedCountryCode: string;
  id: string;
  title: string;
  svgHeight: number;
  chartSource: ChartSourceType;
}

export function LinearDotsComparison(props: Props) {
  const { data, selectedCountryCode, id, title, svgHeight, chartSource } =
    props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgWidth, setSvgWidth] = useState<number | 400>(400);
  const margin = { top: 35, right: 10, bottom: 40, left: 10 };
  const xDomain = extent(data, d => Number(d.value));
  const colors = UNDPColorModule.sequentialColors.negativeColorsx07
    .slice()
    .reverse();

  const ratingScale = (d: number) => {
    if (d < 4) return 0;
    if (d < 6) return 1;
    if (d < 9) return 2;
    if (d < 12) return 3;
    return 4;
  };
  const colorScale = (d: number) => colors[ratingScale(d)];
  const categories = [
    'In default',
    'Substantial risk or extremely speculative',
    'Highly speculative',
    'Non-investment grade',
    'Investment grade',
  ];
  const x = scaleLinear()
    .domain(xDomain as [number, number])
    .range([0, svgWidth - margin.left - margin.right]);

  const countryData = data.filter(d => d.code === selectedCountryCode)[0];
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      setSvgWidth(entries[0].target.clientWidth);
    });
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);
  useEffect(() => {
    x.range([0, svgWidth - margin.left - margin.right]);
  }, [svgWidth]);
  return (
    <div ref={containerRef} className='chart-container rating'>
      <h6 className='undp-typography margin-bottom-04'>{title}</h6>
      {countryData !== undefined && data.length > 0 ? (
        <>
          <svg width='100%' viewBox={`0 0 ${svgWidth} ${svgHeight}`} id={id}>
            <g transform={`translate(${margin.left},${margin.top})`}>
              <rect
                x={x(1) - 6}
                y={-6}
                width={x(17) - x(1) + 12}
                rx='5'
                height='12px'
                fill='#FFF'
              />
              {data.map((d, i) => (
                <g key={i} transform={`translate(${x(d.value)},0)`}>
                  <Tooltip title={`${d.name}: ${d.value}`}>
                    <circle r={6} fill={colorScale(d.value)} opacity={0.3} />
                  </Tooltip>
                </g>
              ))}
              <Tooltip title={`${countryData.name}: ${countryData.value}`}>
                <circle
                  r={10}
                  fill={colorScale(countryData.value)}
                  cy={0}
                  cx={x(countryData.value)}
                  stroke='#FFFFFF'
                />
              </Tooltip>

              <text
                className='label'
                x={x(countryData.value as number)}
                y='-15'
                textAnchor='middle'
              >
                {countryData.value as number}
              </text>
              <text
                className='label'
                x={x(countryData.value as number)}
                y='24'
                textAnchor={
                  x(countryData.value as number) < 45
                    ? ' start'
                    : x(countryData.value as number) <
                      x((xDomain as any)[1]) - 45
                    ? 'middle'
                    : 'end'
                }
              >
                {categories[ratingScale(countryData.value as number)]}
              </text>
              <text
                className='label'
                x={x(xDomain[0] as number)}
                y='-15'
                textAnchor='middle'
              >
                {xDomain[0] as number}
              </text>
              <text
                className='label'
                x={x(xDomain[1] as number)}
                y='-15'
                textAnchor='middle'
              >
                {xDomain[1] as number}
              </text>
            </g>
          </svg>
          {chartSource.source ? (
            <p className='source'>{`Source: ${chartSource.source}`}</p>
          ) : null}
          {chartSource.note ? (
            <p className='source'>Note: {parse(chartSource.note)}</p>
          ) : null}
        </>
      ) : (
        <div className='not-available'>N/A</div>
      )}
    </div>
  );
}
