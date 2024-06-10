import { useRef, useEffect, useState } from 'react';
import { Graph } from './Graph';
import { ChartSourceType } from '../../Types';
import { DownloadImageButton } from '../../Components/DownloadImageButton';
import { DownloadDataButton } from '../../Components/DownloadDataButton';

interface Props {
  data: object[];
  indicators: string[];
  id: string;
  title: string;
  svgHeight: number;
  selectedCountryCode: string;
  chartSource: ChartSourceType;
  dataLink: string;
}

export function LineChart(props: Props) {
  const {
    data,
    indicators,
    id,
    title,
    selectedCountryCode,
    svgHeight,
    chartSource,
    dataLink,
  } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const graphDiv = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [divToBeDownloaded, setDivToBeDownloaded] = useState<any>(null);
  const [svgWidth, setSvgWidth] = useState<number | 400>(400);
  const yearsDomain = [2000, 2025];

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      setSvgWidth(entries[0].target.clientWidth);
    });
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);
  useEffect(() => {
    setDivToBeDownloaded(graphDiv.current);
  }, [graphDiv.current]);
  return (
    <div className='chart-container flex-half-screen'>
      <div ref={graphDiv}>
        <div className='margin-bottom-07 flex-div flex-space-between flex-vert-align-center'>
          <h6 className='undp-typography margin-bottom-00'>
            {title}{' '}
            {data.length > 0 ? `${yearsDomain[0]} - ${yearsDomain[1]}` : ''}
          </h6>
          <div className='flex-div no-shrink'>
            <DownloadImageButton element={divToBeDownloaded} />
            <DownloadDataButton link={dataLink} />
          </div>
        </div>
        <div ref={containerRef} className='margin-bottom-02 flex-half-screen'>
          {data.length > 0 ? (
            <Graph
              data={data}
              indicators={indicators}
              id={id}
              yearDomain={yearsDomain}
              svgWidth={svgWidth}
              svgHeight={svgHeight}
              selectedCountryCode={selectedCountryCode}
            />
          ) : (
            <div className='center-area-error-el'>No data available</div>
          )}
        </div>
        {data.length > 0 ? (
          <div className='margin-top-04'>
            {chartSource?.source ? (
              <p className='source'>{`Source: ${chartSource.source}`}</p>
            ) : null}
            {chartSource?.note ? (
              <p className='source'>{`Note: ${chartSource.note}`}</p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
