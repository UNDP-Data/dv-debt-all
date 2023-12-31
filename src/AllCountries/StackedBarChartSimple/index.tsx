/* eslint-disable no-console */
import { ExternalDebtType } from '../../Types';
import { Graph } from './Graph';

interface Props {
  data: ExternalDebtType[];
  sections: string[];
  id: string;
  title: string;
}

export function StackedBarChartSimple(props: Props) {
  const { data, sections, id, title } = props;
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
      <p className='source'>Source:</p>
      <p className='source'>Note:</p>
    </div>
  );
}
