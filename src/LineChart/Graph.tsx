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
  yAxisLabel: string;
  yearDomain: number[];
  svgWidth: number;
  svgHeight: number;
}
/// two lines for mean and median
export function Graph(props: Props) {
  const { data, indicators, id, yAxisLabel, yearDomain, svgWidth, svgHeight } =
    props;
  const margin = { top: 20, right: 40, bottom: 50, left: 80 };
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - margin.top - margin.bottom;
  const [hoveredYear, setHoveredYear] = useState<undefined | string>(undefined);
  let maxParam = 0;
  indicators.forEach(indicator => {
    const maxIndValue = max(data, (d: any) => d[indicator as any]);
    if (maxIndValue > maxParam) maxParam = maxIndValue;
  });
  const minParam = 0;
  console.log('data', data);

  const x = scaleLinear()
    .domain(yearDomain as [number, number])
    .range([0, graphWidth]);
  const y = scaleLinear()
    .domain([minParam as number, maxParam as number])
    .range([graphHeight, 0])
    .nice();

  const yAxis = axisLeft(y as any)
    .tickSize(-graphWidth)
    .tickFormat((d: any) => `${d}%`);
  const xAxis = axisBottom(x)
    .tickSize(0)
    .tickSizeOuter(0)
    .tickPadding(6)
    .tickFormat((d: any) => `${d}`);
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
  }, data);
  return (
    <div>
      {data.length > 0 ? (
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
                      transform={`translate(0,${y((d as any)[k])})`}
                      style={{
                        display: (d as any)[k] !== '' ? 'block' : 'none',
                      }}
                    >
                      <circle
                        r={hoveredYear === (d as any).year ? 5 : 3}
                        fill={UNDPColorModule.categoricalColors.colors[j]}
                      />
                      <text
                        x={-25}
                        y={-5}
                        opacity={hoveredYear === (d as any).year ? 1 : 0}
                      >
                        {(d as any)[k].toFixed(2)}%
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
          <text
            x={-graphHeight / 2}
            y='20'
            transform='rotate(-90)'
            textAnchor='middle'
          >
            {yAxisLabel}
          </text>
        </svg>
      ) : (
        <div className='center-area-error-el'>No data available</div>
      )}
    </div>
  );
}
