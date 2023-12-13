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
  const margin = { top: 40, right: 40, bottom: 20, left: 50 };
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - margin.top - margin.bottom;
  const [hoveredYear, setHoveredYear] = useState<undefined | string>(undefined);
  let maxParam = 0;
  indicators.forEach(indicator => {
    const maxIndValue = max(data, (d: any) => d[indicator as any]);
    if (maxIndValue > maxParam) maxParam = maxIndValue;
  });
  const minParam = 0;
  /* let numberOfTicksY = maxParam - minParam + 1;
  numberOfTicksY = numberOfTicksY > 15 ? numberOfTicksY / 2 : numberOfTicksY;
  let numberOfTicksX = yearDomain[1] - yearDomain[0];
  numberOfTicksX = numberOfTicksX > 5 ? numberOfTicksX / 3 : numberOfTicksX;
  console.log(
    'number of ticks x',
    numberOfTicksX,
    'number of ticks y',
    numberOfTicksY,
  ); */
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
  // .ticks(numberOfTicksY);
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
                stroke='#FFF'
                strokeWidth={2}
                opacity={hoveredYear === (d as any).year ? 1 : 0}
              />
              {indicators.map((k, j) => (
                <g
                  key={j}
                  style={{
                    display: (d as any)[k] !== '' ? 'block' : 'none',
                  }}
                >
                  <g
                    transform={`translate(0,${
                      indicators.length === 1 ? y((d as any)[k]) : -30 + j * 20
                    })`}
                  >
                    {indicators.length === 1 ? (
                      <>
                        <circle
                          r={hoveredYear === (d as any).year ? 5 : 3}
                          fill={UNDPColorModule.categoricalColors.colors[j]}
                        />
                        <rect
                          x={-25}
                          y={-32}
                          width={65}
                          height={20}
                          fill='#F5F5F5'
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
                      x={indicators.length === 1 ? -25 : 10}
                      y={indicators.length === 1 ? -15 : 5}
                      opacity={hoveredYear === (d as any).year ? 1 : 0}
                    >
                      {(d as any)[k].toFixed(2)}%
                    </text>
                  </g>
                  <rect
                    x={-30}
                    y={graphHeight}
                    width={60}
                    height={20}
                    fill='#F8F8F8'
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
  );
}
