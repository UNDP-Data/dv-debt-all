/* eslint-disable no-console */
import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';

import { useRef, useState, useEffect } from 'react';
import { CountryValueType } from '../Types';

interface Props {
  data: CountryValueType[];
  selectedCountryCode: string;
  id: string;
  year: number;
  title: string;
  svgHeight: number;
}

export function LinearDotsComparison(props: Props) {
  const { data, selectedCountryCode, id, year, title, svgHeight } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgWidth, setSvgWidth] = useState<number | 400>(400);
  const margin = { top: 50, right: 10, bottom: 20, left: 10 };
  const xDomain = extent(data, d => Number(d.value));
  const x = scaleLinear()
    .domain(xDomain as [number, number])
    .range([0, svgWidth - margin.left - margin.right]);
  const countryData = data.filter(d => d.code === selectedCountryCode)[0];
  useEffect(() => {
    if (containerRef.current) {
      setSvgWidth(containerRef.current.clientWidth);
    }
  }, []);
  useEffect(() => {
    x.range([0, svgWidth - margin.left - margin.right]);
  }, [svgWidth]);
  return (
    <div ref={containerRef} className='chart-container rating'>
      <h6 className='undp-typography margin-bottom-01'>{title}</h6>
      <p className='undp-typography small-font margin-bottom-01'>
        Year: {year}
      </p>
      {countryData !== undefined && data.length > 0 ? (
        <svg
          width='100%'
          height='100%'
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          id={id}
        >
          <g transform={`translate(${margin.left},${margin.top})`}>
            {data.map((d, i) => (
              <g key={i} cy={5} transform={`translate(${x(d.value)},0)`}>
                <circle r={10} fill='#ccc' opacity={0.2} />
              </g>
            ))}
            <circle
              r={10}
              fill='#006eb5'
              cy={0}
              transform={`translate(${x(countryData.value)},0)`}
            />
            <text
              className='label'
              x={x(countryData.value as number)}
              y='30'
              textAnchor='middle'
            >
              {countryData.value as number}
            </text>
            <text
              className='label'
              x={x(xDomain[0] as number)}
              y='30'
              textAnchor='middle'
            >
              {xDomain[0] as number}
            </text>
            <text
              className='label'
              x={x(xDomain[1] as number)}
              y='30'
              textAnchor='middle'
            >
              {xDomain[1] as number}
            </text>
          </g>
        </svg>
      ) : (
        <div>N/A</div>
      )}
    </div>
  );
}
