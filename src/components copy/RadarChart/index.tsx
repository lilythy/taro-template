import React, {useEffect, useRef} from 'react';
import * as F2 from '@antv/f2/lib/index-all';
import F2Canvas from '@/components/F2Canvas';
import NoData from '@/components/noData';
import Tooltip from '@antv/f2/lib/plugin/tooltip';
import _ from 'lodash';

F2.Chart.plugins.register(Tooltip);

interface LineChartProps {
  data: any[];
  id?: string;
  /**
   * 横坐标key
   */
  xAxis?: string;
  /**
   * 纵坐标key
   */
  yAxis?: string;
  yAxisRight?: string;
  percent?: boolean;
  valueText?: string[];
  color?: string[];
  /**
   * 是否打点
   */
  isPoint?: boolean;
  /**
   * 是否柱状图
   */
  rightColumn?: boolean;
  width?: string | number;
  height?: string | number;
  padding?: number | number[];
  type?: string;
}

export default (props: LineChartProps) => {
  const {data = [], id = 'radar-chart-id', width = '100%', height = '100%', padding = 30} = props;
  const chartRef = useRef<any>();

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current?.changeData(data);
    }
  }, [data]);
  const initChart = () => {
    const chart = new F2.Chart({
      id,
      pixelRatio: window.devicePixelRatio
    });
    chart.clear();
    chart.coord('polar');
    chart.source(data, {
      score: {
        min: 0,
        max: 120,
        nice: false,
        tickCount: 4
      }
    });
    chart.axis('score', {
      label: function label(_text, index, total) {
        if (index === total - 1) {
          return null;
        }
        return {
          top: true
        };
      },
      grid: {
        lineDash: null,
        type: 'arc' // 弧线网格
      }
    });
    chart.axis('item', {
      grid: {
        lineDash: null
      }
    });
    chart
      .line()
      .position('item*score')
      .color('user');
    chart
      .point()
      .position('item*score')
      .color('user')
      .style({
        stroke: '#fff',
        lineWidth: 1
      });
    chart.render();
    return chart;
  };

  if (!data.length) {
    return (
      <NoData
        text="无数据"
        style={{
          height: '100%',
          padding: 0
        }}
      />
    );
  }
  return (
    <F2Canvas
      id={id}
      key={data.length}
      style={{width, height}}
      customWidth={width}
      onInit={initChart}
      padding={padding}
    />
  );
};
