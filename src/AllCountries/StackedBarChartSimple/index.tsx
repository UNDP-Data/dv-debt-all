/* eslint-disable no-console */
import { ChartSourceType, ExternalDebtType } from '../../Types';
import { Graph } from './Graph';

interface Props {
  data: ExternalDebtType[];
  sections: string[];
  id: string;
  title: string;
  chartSource: ChartSourceType;
}

export function StackedBarChartSimple(props: Props) {
  const { data, sections, id, title, chartSource } = props;
  return (
    <div className='chart-container'>
      <div className='margin-bottom-03'>
        <div>
          <h6 className='undp-typography margin-bottom-01'>{title}</h6>
        </div>
      </div>
      {data.length > 0 ? (
        <Graph
          data={data}
          sections={sections}
          id={id}
          maxValue={data[0].total}
        />
      ) : (
        <div>No data available</div>
      )}
      {chartSource.note ? (
        <p className='source'>{`Note: ${chartSource.note}`}</p>
      ) : null}
      {chartSource.source ? (
        <p className='source'>{`Source: ${chartSource.source}`}</p>
      ) : null}
    </div>
  );
}
