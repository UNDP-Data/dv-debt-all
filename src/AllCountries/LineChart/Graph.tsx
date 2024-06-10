/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { line, curveMonotoneX } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';
import UNDPColorModule from 'undp-viz-colors';

interface Props {
  data: object[];
  indicators: string[];
  id: string;
  yearDomain: number[];
  svgWidth: number;
  svgHeight: number;
  selectedCountryCode: string;
}
export function Graph(props: Props) {
  const {
    data,
    indicators,
    id,
    yearDomain,
    svgWidth,
    svgHeight,
    selectedCountryCode,
  } = props;
  const margin = { top: 40, right: 30, bottom: 20, left: 50 };
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - margin.top - margin.bottom;
  const [hoveredYear, setHoveredYear] = useState<undefined | string>(undefined);
  let maxParam = 0;
  indicators.forEach(indicator => {
    const maxIndValue = max(data, (d: any) => d[indicator as any]);
    if (maxIndValue > maxParam) maxParam = maxIndValue;
  });
  const minParam = 0;
  const x = scaleLinear()
    .domain(yearDomain as [number, number])
    .range([0, graphWidth]);
  const y = scaleLinear()
    .domain([minParam as number, maxParam as number])
    .range([graphHeight, 0])
    .nice();

  const yAxis = axisLeft(y as any)
    .tickSize(-graphWidth)
    .tickFormat((d: any) => `${d}%`)
    .ticks(5);
  const xAxis = axisBottom(x)
    .tickSize(0)
    .tickSizeOuter(0)
    .tickPadding(6)
    .tickFormat((d: any) => `${d}`)
    .ticks(5);

  const lineShape1 = (indicator: string) =>
    line()
      .defined((d: any) => d[indicator])
      .x((d: any) => x(d.year))
      .y((d: any) => y(d[indicator]))
      .curve(curveMonotoneX);

  useEffect(() => {
    const svg = select(`#${id}`);
    svg.select('.yAxis').call(yAxis as any);
    svg.select('.xAxis').call(xAxis as any);
    svg.selectAll('.domain').remove();
    svg
      .selectAll('.yAxis text')
      .attr('dy', '-4px')
      .attr('x', '-4px')
      .attr('text-anchor', 'end');
  }, [selectedCountryCode, svgWidth, svgHeight]);
  return (
    <>
      {indicators.length > 1 ? (
        <div className='legend-container'>
          {indicators.map((k, j) => (
            <div key={j} className='legend-item'>
              <div
                className='legend-circle-medium'
                style={{
                  backgroundColor: UNDPColorModule.categoricalColors.colors[j],
                }}
              />
              <div className='small-font'>
                {k[0].toUpperCase() + k.slice(1)}
              </div>
            </div>
          ))}
        </div>
      ) : null}
      <svg
        width='100%'
        height='100%'
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        id={id}
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          <g className='xAxis' transform={`translate(0 ,${graphHeight})`} />
          <g className='yAxis' transform='translate(0,0)' />
          <g>
            {indicators.map((d, i) => (
              <g key={i}>
                <path
                  d={lineShape1(d as string)(data as any) as string}
                  fill='none'
                  stroke={UNDPColorModule.categoricalColors.colors[i]}
                  strokeWidth={2}
                />
                {data.map((el, j) => (
                  <g
                    className='focus'
                    style={{ display: 'block' }}
                    key={j}
                    transform={`translate(${x(Number((el as any).year))},${y(
                      (el as any)[d],
                    )})`}
                  >
                    <circle
                      r={3}
                      fill={UNDPColorModule.categoricalColors.colors[i]}
                    />
                  </g>
                ))}
              </g>
            ))}
          </g>
          <g className='overlay'>
            {data.map((d, i) => (
              <g
                className='focus'
                style={{ display: 'block' }}
                key={i}
                transform={`translate(${x(Number((d as any).year))},0)`}
              >
                <line
                  x1={0}
                  y1={0}
                  x2={0}
                  y2={graphHeight}
                  style={{
                    stroke: 'var(--gray-400)',
                  }}
                  strokeWidth={2}
                  opacity={hoveredYear === (d as any).year ? 1 : 0}
                />
                {indicators.map((k, j) => (
                  <g key={j}>
                    <g
                      transform={`translate(0,${
                        indicators.length === 1
                          ? y((d as any)[k])
                          : -30 + j * 20
                      })`}
                    >
                      {indicators.length === 1 ? (
                        <>
                          <circle
                            r={hoveredYear === (d as any).year ? 5 : 0}
                            fill={UNDPColorModule.categoricalColors.colors[j]}
                          />
                          <rect
                            x={-25}
                            y={-32}
                            width={65}
                            height={20}
                            style={{
                              fill: 'var(--gray-200)',
                            }}
                            opacity={hoveredYear === (d as any).year ? 1 : 0}
                          />
                        </>
                      ) : (
                        <circle
                          r={5}
                          fill={UNDPColorModule.categoricalColors.colors[j]}
                          opacity={hoveredYear === (d as any).year ? 1 : 0}
                        />
                      )}
                      <text
                        className='label'
                        x={0}
                        dx={indicators.length === 1 ? 0 : 30}
                        y={indicators.length === 1 ? -15 : 5}
                        opacity={hoveredYear === (d as any).year ? 1 : 0}
                        textAnchor='middle'
                      >
                        {(d as any)[k] ? `${(d as any)[k].toFixed(2)}%` : '-'}
                      </text>
                    </g>
                    <rect
                      x={-30}
                      y={graphHeight}
                      width={60}
                      height={20}
                      style={{
                        fill: 'var(--gray-200)',
                      }}
                      opacity={hoveredYear === (d as any).year ? 0.7 : 0}
                    />
                    <text
                      opacity={hoveredYear === (d as any).year ? 1 : 0}
                      className='highlightYear'
                      textAnchor='middle'
                      y={graphHeight + 17}
                    >
                      {(d as any).year}
                    </text>
                  </g>
                ))}
                <rect
                  onMouseEnter={() => {
                    setHoveredYear((d as any).year);
                  }}
                  onMouseLeave={() => {
                    setHoveredYear(undefined);
                  }}
                  x='-15px'
                  y={0}
                  width='30px'
                  height={svgHeight}
                  opacity={0}
                />
              </g>
            ))}
          </g>
          <line
            x1={0}
            y1={graphHeight}
            x2={graphWidth}
            y2={graphHeight}
            stroke='#232E3D'
            strokeWidth={2}
          />
        </g>
      </svg>
    </>
  );
}
