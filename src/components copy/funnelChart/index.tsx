import React, {useCallback} from 'react';
import * as F2 from '@antv/f2/lib/index-all';
import F2Canvas from '@/components/F2Canvas';
import NoData from '@/components/noData';

interface LineChartProps {
  data: any[];
  id?: string;
  color?: string | string[];
}

export default (props: LineChartProps) => {
  const {
    data = [],
    id = 'funnel-id',
    color = ['#0050B3', '#1890FF', '#40A9FF', '#69C0FF', '#BAE7FF']
  } = props;

  const initChart = useCallback(
    config => {
      const chart: any = new F2.Chart(config);
      chart.clear();
      chart.source(data);
      chart.axis(false);
      chart.coord({
        transposed: true,
        scale: [1, -1]
      });
      // chart.legend(false);
      const obj = {
        offsetX: 10,
        label: (_data, _color) => {
          return {
            text: _data.action,
            fill: _color
          };
        },
        guide: _data => {
          return {
            text: _data.count,
            fill: '#fff'
          };
        }
      };
      chart.intervalLabel(obj);
      chart
        .interval()
        .position('action*count')
        .color('action', color)
        // .adjust('symmetric')
        .shape('funnel');
      chart.render();
      return chart;
    },
    [data]
  );

  if (!data.length) {
    return <NoData text="无数据" style={{height: 200}} />;
  }

  return (
    <F2Canvas
      id={id}
      key={data.length}
      style={{width: '100%', height: 'auto'}}
      onInit={initChart}
      padding={[15, 80, 15, 15]}
    />
  );
};
