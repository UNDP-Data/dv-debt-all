/* eslint-disable no-console */
import { useRef, useState, useEffect } from 'react';
import UNDPColorModule from 'undp-viz-colors';
import { ChartSourceType, CountryCategoryType } from '../Types';

interface Props {
  countryDsa: CountryCategoryType[];
  categories: string[];
  id: string;
  year: number;
  title: string;
  svgHeight: number;
  chartSource: ChartSourceType;
}

export function HorizontalScale(props: Props) {
  const { countryDsa, categories, id, year, title, svgHeight, chartSource } =
    props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgWidth, setSvgWidth] = useState<number | 400>(400);
  const margin = { top: 20, right: 40, bottom: 20, left: 0 };
  const value = countryDsa.length > 0 ? countryDsa[0].category : '';
  const colors = UNDPColorModule.sequentialColors.negativeColorsx04
    .slice()
    .reverse();

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      setSvgWidth(entries[0].target.clientWidth);
    });
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);
  return (
    <div ref={containerRef} className='chart-container rating'>
      <h6 className='undp-typography margin-bottom-01'>{title}</h6>
      <p className='undp-typography small-font margin-bottom-01'>
        Year: {year}
      </p>
      {value !== '' && categories.length > 0 ? (
        <>
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
          {chartSource.note ? (
            <p className='source'>{`Note: ${chartSource.note}`}</p>
          ) : null}
          {chartSource.source ? (
            <p className='source'>{`Source: ${chartSource.source}`}</p>
          ) : null}
        </>
      ) : (
        <div className='margin-top-06'>N/A</div>
      )}
    </div>
  );
}
