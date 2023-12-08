/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { scaleLinear } from 'd3-scale';
import { stack } from 'd3-shape';
import UNDPColorModule from 'undp-viz-colors';
import { ExternalDebtType } from '../../Types';

interface Props {
  data: ExternalDebtType[];
  sections: string[];
  id: string;
  maxValue: number;
}

export function Graph(props: Props) {
  const { data, sections, id, maxValue } = props;
  const margin = { top: 20, right: 30, bottom: 50, left: 60 };
  const graphHeight = 500 - margin.top - margin.bottom;
  const stackedData = stack().keys(sections)(data as any);
  const y = scaleLinear().domain([0, maxValue]).range([0, graphHeight]).nice();
  return (
    <div>
      {data !== undefined ? (
        <svg width='580px' height='470px' id={id}>
          <g transform={`translate(${margin.left},${margin.top})`}>
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
                {d[0][1] !== d[0][0] ? (
                  <>
                    <text
                      textAnchor='start'
                      className='chartLabel'
                      y={y(d[0][0]) + y(d[0][1] - d[0][0]) / 2 + 5}
                      x={230}
                    >
                      {`${(d[0][1] - d[0][0]).toFixed(1)} USD million`}
                    </text>
                    <text
                      textAnchor='end'
                      className='label'
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
        </svg>
      ) : (
        <div className='center-area-error-el'>No data available</div>
      )}
    </div>
  );
}
