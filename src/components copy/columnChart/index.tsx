import React, {useEffect, useRef} from 'react';
import * as F2 from '@antv/f2/lib/index-all';
import F2Canvas from '@/components/F2Canvas';
import NoData from '@/components/noData';
import Tooltip from '@antv/f2/lib/plugin/tooltip';
import {unitTenThousand} from '@/utils';
import Taro from '@tarojs/taro';

F2.Chart.plugins.register(Tooltip);

interface ChartProps {
  data: any[];
  id: string;
  xAxis?: string;
  yAxis?: string;
  unit?: string;
  yAxisRight?: string;
  percent?: boolean;
  percentRight?: boolean;
  valueText?: string[];
  color?: string[];
  width?: string | number;
  height?: string | number;
  padding?: number | number[];
}

export default (props: ChartProps) => {
  const {
    data = [],
    id = 'column-chart-id',
    color = ['#2C58C6'],
    width = '100%',
    height = '100%',
    padding = 30,
    xAxis = 'x',
    yAxis = 'y',
    yAxisRight = '',
    valueText = [],
    percentRight = false,
    percent = false,
    unit = ''
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
      [xAxis]: {tickCount: 5},
      [yAxis]: {
        min: 0,
        nice: true,
        tickCount: 6,
        max: percent ? 1 : undefined
      }
    });
    chart.legend(false);
    chart.tooltip({
      showItemMarker: true,
      triggerOn: ['touchstart', 'touchmove'],
      triggerOff: 'touchend',
      showTitle: true,
      showCrosshairs: true,
      crosshairsType: 'xy',
      snap: true,
      onShow: ev => {
        const items = ev.items;
        if (valueText.length) {
          items[0].name = valueText[0];
          items[0].value = `${items[0].value}${unit}`;
        }
        if (percent) {
          items[0].value = (Number(items[0]?.value) * 100).toFixed(1) + '%';
        }
      }
    });
    chart.axis(yAxis, {
      position: 'left',
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
        textCfg.fontSize = 8;
        return textCfg;
      },
      grid: () => {
        return {stroke: '#eee'};
      }
    });

    if (yAxisRight) {
      chart.axis(yAxisRight, {
        position: 'right',
        label: function label(val) {
          const textCfg: any = {};
          if (Number(val) > 10000) {
            textCfg.text = unitTenThousand(Number(val), 1);
          }
          if (percentRight) {
            textCfg.text = (val * 100).toFixed(0) + '%';
          }

          textCfg.fill = color.length ? color?.[1] : '#000';
          textCfg.fontWeight = 400;
          return textCfg;
        },
        grid: () => {
          return {stroke: '#eee'};
        }
      });
    }

    chart
      .interval()
      .position(`${xAxis}*${yAxis}`)
      .color(color)
      .size(10);
    if (yAxisRight) {
      chart
        .line()
        .position(`${xAxis}*${yAxisRight}`)
        .color(color?.[1] || color)
        .shape('smooth');
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
      onInit={initChart}
      padding={padding}
    />
  );
};
