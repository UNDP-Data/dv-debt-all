/* eslint-disable no-console */
import { useRef, useState, useEffect } from 'react';
import { ChartSourceType, CountryCategoryType } from '../Types';

interface Props {
  countryDsa: CountryCategoryType[];
  categories: string[];
  id: string;
  title: string;
  svgHeight: number;
  chartSource: ChartSourceType;
}

export function HorizontalScale(props: Props) {
  const { countryDsa, categories, id, title, svgHeight, chartSource } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgWidth, setSvgWidth] = useState<number | 400>(400);
  const margin = { top: 15, right: 10, bottom: 15, left: 10 };
  const value = countryDsa.length > 0 ? countryDsa[0].category : '';
  const colors = ['#347CBC', '#F6D39E', '#E88666', '#D9382D'].slice().reverse();

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      setSvgWidth(entries[0].target.clientWidth);
    });
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);
  return (
    <div ref={containerRef} className='chart-container rating'>
      <p className='undp-typography margin-bottom-04'>{title}</p>
      {value !== '' && categories.length > 0 ? (
        <>
          <svg width='100%' viewBox={`0 0 ${svgWidth} ${svgHeight}`} id={id}>
            <g transform={`translate(${margin.left},${margin.top})`}>
              {categories.map((d, i) => (
                <g key={i} transform={`translate(${i * 120},0)`}>
                  <rect
                    key={i}
                    x={d === value ? 2 : 0}
                    y={2}
                    height={25}
                    width={d === value ? 116 : 120}
                    fill={colors[i]}
                    className={d === value ? 'highlightScale' : ''}
                  />
                  <text y={45} className='label '>
                    {d}
                  </text>
                </g>
              ))}
            </g>
          </svg>
          {chartSource.source ? (
            <p className='source'>{`Source: ${chartSource.source}`}</p>
          ) : null}
          {chartSource.note ? (
            <p className='source'>{`Note: ${chartSource.note}`}</p>
          ) : null}
        </>
      ) : (
        <div className='not-available'>N/A</div>
      )}
    </div>
  );
}
