/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { scaleLinear } from 'd3-scale';
import { stack } from 'd3-shape';
import UNDPColorModule from 'undp-viz-colors';

interface Props {
  data: object[];
}

export function Graph(props: Props) {
  const { data } = props;
  const margin = { top: 20, right: 30, bottom: 50, left: 0 };
  const graphHeight = 500 - margin.top - margin.bottom;
  const valueArray: number[] = data.map((d: any) => Number(d.number));
  const percentageData = data.filter(d => (d as any).value === 'percentage');
  const numberData = data.filter(d => (d as any).value === 'number')[0];
  const subgroups = Object.keys(data[0]).slice(2);
  const stackedData = stack().keys(subgroups)(percentageData as any);
  const y = scaleLinear().domain([0, 100]).range([0, graphHeight]).nice();
  return (
    <div>
      {valueArray.length > 0 ? (
        <svg width='500px' height='500px' id='creditRating'>
          <g transform={`translate(${margin.left},${margin.top})`}>
            <g>
              {stackedData.map((d, i) => (
                <g key={i}>
                  <rect
                    y={y(d[0][0])}
                    x={120}
                    height={y(d[0][1] - d[0][0])}
                    width={100}
                    fill={UNDPColorModule.sequentialColors.negativeColorsx05[i]}
                    opacity={0.8}
                  />
                  {(numberData as any)[d.key] > 0 ? (
                    <>
                      <text
                        textAnchor='end'
                        className='chartLabel'
                        y={y(d[0][0]) + y(d[0][1] - d[0][0]) / 2}
                        x={110}
                      >
                        {`${(d[0][1] - d[0][0]).toFixed(2)}% `}
                      </text>
                      <text
                        textAnchor='end'
                        className='chartLabel'
                        y={y(d[0][0]) + y(d[0][1] - d[0][0]) / 2 + 15}
                        x={110}
                      >
                        {`${Math.round((numberData as any)[d.key])}  ${
                          (numberData as any)[d.key] > 1
                            ? 'countries'
                            : 'country'
                        }`}
                      </text>
                      <text
                        className='label'
                        y={y(d[0][0]) + y(d[0][1] - d[0][0]) / 2 + 5}
                        x={230}
                      >
                        {d.key}
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
