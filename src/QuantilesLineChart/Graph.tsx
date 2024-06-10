/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { line, curveMonotoneX, area } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import { min, max, extent } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';
import UNDPColorModule from 'undp-viz-colors';

interface Props {
  data: object[];
  option: string;
  svgWidth: number;
  svgHeight: number;
  id: string;
  yAxisName: string;
}
const colors = {
  Median: UNDPColorModule.categoricalColors.colors[0],
  Q1: UNDPColorModule.categoricalColors.colors[1],
  Q3: UNDPColorModule.categoricalColors.colors[1],
};
/// two lines for mean and median
export function Graph(props: Props) {
  const { data, option, svgWidth, svgHeight, id, yAxisName } = props;
  const indicators = ['Median', 'Q1', 'Q3'];
  const margin = { top: 20, right: 40, bottom: 50, left: 80 };
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - margin.top - margin.bottom;
  const [hoveredYear, setHoveredYear] = useState<undefined | string>(undefined);
  const valueArray: number[] = data.map((d: any) =>
    Number(d[`${option}DebtQ3`]),
  );
  const minParam = min(valueArray)
    ? (min(valueArray) as number) > 0
      ? 0
      : min(valueArray)
    : 0;
  const maxParam = max(valueArray) ? max(valueArray) : 0;
  // eslint-disable-next-line consistent-return
  const dateDomain = extent(data, d => {
    if ((d as any)[`${option}DebtMedian`] !== '')
      return Number((d as any).year);
  });
  const x = scaleLinear()
    .domain(dateDomain as [number, number])
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
  const areaBetween = area()
    .x0((d: any) => x(d.year))
    .x1((d: any) => x(d.year))
    .y0((d: any) => y(d[`${option}DebtQ1`]))
    .y1((d: any) => y(d[`${option}DebtQ3`]))
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
  }, [option, data]);
  return (
    <div>
      {valueArray.length > 0 ? (
        <>
          <div className='legend-container'>
            <div className='legend-item'>
              <div
                className='legend-circle-medium'
                style={{
                  backgroundColor: UNDPColorModule.categoricalColors.colors[0],
                }}
              />
              <div className='small-font'>Median</div>
            </div>
            <div className='legend-item'>
              <div
                className='legend-circle-medium'
                style={{
                  backgroundColor: UNDPColorModule.categoricalColors.colors[1],
                }}
              />
              <div className='small-font'>Interquartile range</div>
            </div>
          </div>
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
                <path
                  d={
                    areaBetween(
                      data.filter(
                        k => (k as any)[`${option}DebtMedian`],
                      ) as any,
                    ) as string
                  }
                  fill={(colors as any).Q1}
                  strokeWidth={2}
                  opacity='0.2'
                />
                {indicators.map((d, i) => (
                  <g key={i}>
                    <path
                      d={
                        lineShape1(`${option}Debt${d}` as string)(
                          data as any,
                        ) as string
                      }
                      fill='none'
                      stroke={(colors as any)[d]}
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
                        transform={`translate(0,${y(
                          (d as any)[`${option}Debt${k}`],
                        )})`}
                        style={{
                          display:
                            (d as any)[`${option}Debt${k}`] !== ''
                              ? 'block'
                              : 'none',
                        }}
                      >
                        <circle
                          r={hoveredYear === (d as any).year ? 5 : 3}
                          fill={(colors as any)[k]}
                        />
                        <text
                          x={-25}
                          y={-5}
                          opacity={hoveredYear === (d as any).year ? 1 : 0}
                        >
                          {(d as any)[`${option}Debt${k}`]}%
                        </text>
                      </g>
                    ))}
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
                      y={graphHeight + 18}
                    >
                      {(d as any).year}
                    </text>
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
              {yAxisName}
            </text>
          </svg>
        </>
      ) : (
        <div className='center-area-error-el'>No data available</div>
      )}
    </div>
  );
}
