import React from 'react';
import * as F2 from '@antv/f2/lib/index-all';
import F2Canvas from '@/components/F2Canvas';
import NoData from '@/components/noData';
import Tooltip from '@antv/f2/lib/plugin/tooltip';

F2.Chart.plugins.register(Tooltip);

interface ChartProps {
  data: any[];
  id: string;
  color?: string[];
  width?: string | number;
  height?: string | number;
  padding?: number | number[];
}

export default (props: ChartProps) => {
  const {
    data = [],
    id = 'map-chart-id',
    color = [],
    width = '100%',
    height = '100%',
    padding = 30
  } = props;

  const initChart = config => {
    const chart: any = new F2.Chart(config);
    chart.clear();
    chart.source(data, {joinBy: {sourceField: 'adcode', geoField: 'adcode'}});
    chart.viewLevel({level: 'country', adcode: 100000});
    chart.legend(false);
    chart.tooltip({showItemMarker: true});

    chart
      .polygon()
      .position(``)
      .color(color);

    chart.render();
    return chart;
  };

  if (!data.length) {
    return <NoData text="无数据" style={{height: 200}} />;
  }
  return (
    <F2Canvas
      id={id}
      key={data.length}
      style={{width, height}}
      onInit={initChart}
      padding={padding}
    />
  );
};
