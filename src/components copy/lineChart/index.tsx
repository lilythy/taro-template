import React, {useEffect, useRef} from 'react';
import * as F2 from '@antv/f2/lib/index-all';
import F2Canvas from '@/components/F2Canvas';
import NoData from '@/components/noData';
import {unitTenThousand} from '@/utils';
import Tooltip from '@antv/f2/lib/plugin/tooltip';
import Taro from '@tarojs/taro';

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
  percentRight?: boolean;
  valueText?: string[];
  type?: string;
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
}

export default (props: LineChartProps) => {
  const {
    data = [],
    id = 'line-chart-id',
    xAxis = 'x',
    yAxis = 'y',
    color = ['#2C58C6'],
    isPoint = true,
    width = '100%',
    height = '100%',
    yAxisRight = '',
    valueText = [],
    padding = 30,
    rightColumn = false,
    percentRight = false,
    percent = false
  } = props;
  const chartRef = useRef<any>();

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current?.changeData(data);
    }
  }, [data]);

  const initChart = config => {
    const chart: any = new F2.Chart(config);
    chart.clear();
    chart.source(data, {
      [yAxis]: {
        min: 0,
        nice: true,
        tickCount: 6
      },
      [xAxis]: {
        range: [0, 1],
        tickCount: 3
      }
    });
    if (yAxisRight) {
      chart.scale(yAxisRight, {
        min: 0,
        nice: true,
        tickCount: 6
      });
    }
    chart.axis(xAxis, {
      label: function label(text, index, total) {
        const textCfg: any = {};
        textCfg.fill = '#000';
        textCfg.fontWeight = 400;
        textCfg.text = text?.split(' ')?.[1];
        if (index === 0) {
          textCfg.textAlign = 'left';
        } else if (index === total - 1) {
          textCfg.textAlign = 'right';
        }
        return textCfg;
      }
    });
    chart.axis(yAxis, {
      label: function label(val) {
        const textCfg: any = {};
        if (Number(val) > 10000) {
          textCfg.text = unitTenThousand(Number(val), 1);
        }
        if (percent) {
          textCfg.text = `${(val * 100).toFixed(1)}%`;
        }
        textCfg.fill = color.length ? color?.[0] : '#000';
        textCfg.fontWeight = 400;
        return textCfg;
      },
      grid: () => {
        return {stroke: '#eee'};
      }
    });
    if (yAxisRight) {
      chart.axis(yAxisRight, {
        title: {},
        label: function label(val) {
          const textCfg: any = {};
          textCfg.fill = color.length > 1 ? color?.[1] : '#000';
          textCfg.fontWeight = 400;
          if (percentRight) {
            textCfg.text = (val * 100).toFixed(0) + '%';
          }
          if (percent) {
            textCfg.text = `${(val * 100).toFixed(1)}%`;
          }
          return textCfg;
        },
        grid: () => {
          return {stroke: '#eee'};
        }
      });
    }

    chart.tooltip({
      offsetX: 0,
      offsetXY: 0,
      triggerOn: ['touchstart', 'touchmove'],
      triggerOff: 'touchend',
      showTitle: true,
      showCrosshairs: true,
      crosshairsType: 'xy',
      snap: true,
      onShow: ev => {
        const items = ev.items;
        if (valueText.length) {
          items.map((item, i) => {
            item.name = valueText[i];
            return item;
          });
        }
        if (percent) {
          items[0].value = (Number(items[0]?.value) * 100).toFixed(1) + '%';
        }
        if (percentRight) {
          items[1].value = (Number(items[1].value) * 100).toFixed(0) + '%';
        }
      }
    });
    chart
      .line()
      .position(`${xAxis}*${yAxis}`)
      .color(color)
      .shape('smooth');
    if (yAxisRight && !rightColumn) {
      chart
        .line()
        .position(`${xAxis}*${yAxisRight}`)
        .color(color.length > 1 ? color?.[1] : color?.[0])
        .shape('smooth');
    }
    if (yAxisRight && rightColumn) {
      chart
        .interval()
        .position(`${xAxis}*${yAxisRight}`)
        .color(color.length > 1 ? color?.[1] : color?.[0])
        .size(5);
    }
    if (isPoint) {
      chart
        .point()
        .position(`${xAxis}*${yAxis}`)
        .color(color)
        .size(2);
      if (yAxisRight && !rightColumn) {
        chart
          .point()
          .position(`${xAxis}*${yAxisRight}`)
          .color(color.length > 1 ? color?.[1] : color?.[0])
          .size(2);
      }
    }
    chartRef.current = chart;
    chart.render();
    return chart;
  };

  if (!data.length) {
    return (
      <NoData text="无数据" style={{height: Taro.ENV_TYPE.WEB === Taro.getEnv() ? '10rem' : 200}} />
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
