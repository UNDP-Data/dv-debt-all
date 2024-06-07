/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { scaleLinear } from 'd3-scale';
import { stack } from 'd3-shape';
import UNDPColorModule from 'undp-viz-colors';

interface Props {
  data: object;
  svgWidth: number;
}

export function Graph(props: Props) {
  const { data, svgWidth } = props;
  const margin = { top: 20, right: 30, bottom: 50, left: 60 };
  const graphHeight = 500 - margin.top - margin.bottom;
  const subgroups = ['Bilateral', 'Multilateral', 'Bonds', 'Other private'];
  const stackedData = stack().keys(subgroups)([data as any]);
  const y = scaleLinear()
    .domain([0, (data as any).Total])
    .range([0, graphHeight]);
  return (
    <div>
      {Object.keys(data).length > 0 ? (
        <svg width={`${svgWidth}px`} height='470px' id='compositionGroupsSvg'>
          <g transform={`translate(${svgWidth / 2 - 200},${margin.top})`}>
            <g>
              {stackedData.map((d, i) => (
                <g key={i} className='stackedRect'>
                  <rect
                    y={y(d[0][0])}
                    x={120}
                    height={y(d[0][1] - d[0][0])}
                    width={100}
                    fill={UNDPColorModule.categoricalColors.colors[i]}
                  />
                  {d[0][1] !== d[0][0] ? (
                    <>
                      <text
                        textAnchor='start'
                        className='chartLabel'
                        y={y(d[0][0]) + y(d[0][1] - d[0][0]) / 2 + 5}
                        x={230}
                      >
                        {`${(d[0][1] - d[0][0]).toFixed(1)} USD million (${(
                          ((d[0][1] - d[0][0]) / (data as any).Total) *
                          100
                        ).toFixed(1)}%)`}
                      </text>
                      <text
                        textAnchor='end'
                        className='chartLabel'
                        y={y(d[0][0]) + y(d[0][1] - d[0][0]) / 2 + 5}
                        x={110}
                      >
                        {d.key.charAt(0).toUpperCase() + d.key.slice(1)}
                      </text>
                    </>
                  ) : null}
                </g>
              ))}
            </g>
          </g>
        </svg>
      ) : (
        <div className='center-area-error-el'>No data available</div>
      )}
    </div>
  );
}
