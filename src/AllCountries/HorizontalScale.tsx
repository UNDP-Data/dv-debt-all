/* eslint-disable no-console */
import { useRef, useState, useEffect } from 'react';
import UNDPColorModule from 'undp-viz-colors';
import { CountryCategoryType } from '../Types';

interface Props {
  countryDsa: CountryCategoryType[];
  categories: string[];
  id: string;
  year: number;
  title: string;
  svgHeight: number;
}

export function HorizontalScale(props: Props) {
  const { countryDsa, categories, id, year, title, svgHeight } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgWidth, setSvgWidth] = useState<number | 400>(400);
  const margin = { top: 0, right: 40, bottom: 20, left: 0 };
  const value = countryDsa.length > 0 ? countryDsa[0].category : '';
  const colors = UNDPColorModule.sequentialColors.negativeColorsx04
    .slice()
    .reverse();

  useEffect(() => {
    if (containerRef.current) {
      setSvgWidth(containerRef.current.clientWidth);
    }
  }, []);
  return (
    <div ref={containerRef}>
      <h5>
        {title} ({year})
      </h5>
      {value !== '' && categories.length > 0 ? (
        <svg
          width='100%'
          height='100%'
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          id={id}
        >
          <g transform={`translate(${margin.left},${margin.top})`}>
            {categories.map((d, i) => (
              <g key={i} transform={`translate(${i * 120},0)`}>
                <rect
                  key={i}
                  x={d === value ? 2 : 0}
                  y={2}
                  height={46}
                  width={d === value ? 116 : 120}
                  fill={colors[i]}
                  className={d === value ? 'highlightScale' : ''}
                />
                <text y={70} className='label '>
                  {d}
                </text>
              </g>
            ))}
          </g>
        </svg>
      ) : (
        <div>N/A</div>
      )}
    </div>
  );
}
