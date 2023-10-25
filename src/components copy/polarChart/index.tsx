import React, {useEffect, useRef} from 'react';
import * as F2 from '@antv/f2/lib/index';
import F2Canvas from '@/components/F2Canvas';
import NoData from '@/components/noData';

interface LineChartProps {
  data: any[];
  id: string;
  xAxis?: string;
  yAxis?: string;
  type?: string;
  color?: string[];
  width?: string | number;
  height?: string | number;
  padding?: number | number[];
  /**
   * 自定义中心样式
   */
  html?: any;
}

export default (props: LineChartProps) => {
  const {
    data = [],
    id = 'polar-chart-id',
    color = [],
    width = '100%',
    height = '100%',
    padding = 30,
    xAxis = 'x',
    yAxis = 'y',
    type = 'type',
    html = ''
  } = props;

  const chartRef = useRef<any>();

  useEffect(() => {
    chartRef.current?.changeData(data);
  }, [data]);

  const map = {};
  data.forEach(item => {
    map[item.name] = item.value;
  });

  const initChart = config => {
    const chart: any = new F2.Chart(config);
    chart.clear();
    chart.source(data, {
      adjust: 'stack'
    });
    chart.axis(false);
    chart.legend({
      position: 'top',
      itemFormatter: val => {
        return val + '：' + map[val];
      }
    });
    chart.tooltip(false);
    chart.coord('polar', {
      transposed: true,
      innerRadius: 0.7,
      radius: 0.85
    });

    chart
      .interval()
      .position(`${type}*${yAxis}`)
      .color(xAxis, color);
    if (html) {
      chart.guider.html({
        position: ['50%', '45%'],
        html: html
      });
    }

    chartRef.current = chart;
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
