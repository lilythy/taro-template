import React, {useEffect, useState} from 'react';
import Taro from '@tarojs/taro';
import {Canvas} from '@tarojs/components';

import {my as F2Context} from '@antv/f2-context';
import {window} from '@tarojs/runtime';

export interface CanvasProps {
  id: string;
  className?: string;
  style?: any;
  onInit: any;
  padding?: number | number[];
  customWidth?: string | number;
}

function wrapEvent(e) {
  if (!e) return;
  if (!e.preventDefault) {
    e.preventDefault = function() {};
  }
  return e;
}

const App = (props: CanvasProps) => {
  const {id = '', className = '', style = '', onInit = () => {}, padding = 0, customWidth} = props;
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(400);
  let INSTANCE_COUNTER = 0;
  const canvasId = id || 'f2-canvas-' + INSTANCE_COUNTER++;
  const pixelRatio = Taro.getSystemInfoSync().pixelRatio;
  let canvasEl: any;
  let chart: any;

  useEffect(() => {
    setTimeout(() => {
      if (process.env.TARO_ENV === 'alipay' || process.env.TARO_ENV === 'dd') {
        onAlipayCanvas();
      } else if (process.env.TARO_ENV === 'weapp') {
        onWxCanvas();
      } else if (Taro.ENV_TYPE.WEB === Taro.getEnv()) {
        onWebCanvas();
      }
    }, 100);
  }, []);

  const onAlipayCanvas = () => {
    const ctx = Taro.createCanvasContext(canvasId);
    const context = F2Context(ctx);
    const query = Taro.createSelectorQuery();
    query
      .select('#' + canvasId)
      .boundingClientRect()
      .exec(res => {
        // 获取画布实际宽高
        const {width: resWidth, height: resHeight} = res?.[0];
        if (!resWidth || !resHeight) return;
        setWidth(resWidth);
        setHeight(resHeight);
        const config = {
          context,
          width: resWidth,
          height: resHeight,
          pixelRatio,
          padding
        };
        let _chart = onInit(config);
        if (chart) {
          chart = _chart;
          canvasEl = _chart.get('el');
        }
      });
  };
  const onWebCanvas = () => {
    // @ts-ignore
    const context = document?.querySelector(`#` + canvasId)?.getContext('2d');
    const contextWidth = window.innerWidth;
    const config = {
      context,
      width: customWidth ? customWidth : contextWidth - 10,
      height: 300,
      pixelRatio,
      padding
    };
    let _chart = onInit(config);
    if (chart) {
      chart = _chart;
      canvasEl = _chart.get('el');
    }
  };
  const onWxCanvas = () => {
    const query = Taro.createSelectorQuery();
    query
      .select('#' + canvasId)
      .fields({
        node: true,
        size: true
      })
      .exec(res => {
        let {node, width: resWidth, height: resHeight} = res?.[0];
        const context = node.getContext('2d');
        // 高清设置
        node.width = resWidth * pixelRatio;
        node.height = resHeight * pixelRatio;

        const config = {context, width: resWidth, height: resHeight, pixelRatio};
        const _chart = onInit(config);
        if (chart) {
          chart = _chart;
          canvasEl = _chart.get('el');
        }
      });
  };

  const touchStart = e => {
    if (canvasEl) {
      canvasEl.dispatchEvent('touchstart', wrapEvent(e));
    }
  };

  const touchMove = e => {
    if (canvasEl) {
      canvasEl.dispatchEvent('touchmove', wrapEvent(e));
    }
  };
  const touchEnd = e => {
    if (canvasEl) {
      canvasEl.dispatchEvent('touchend', wrapEvent(e));
    }
  };

  return (
    <>
      {Taro.ENV_TYPE.WEB === Taro.getEnv() ? (
        <canvas
          style={style || {width, height}}
          width={width}
          height={height}
          canvas-id={canvasId}
          // @ts-ignore
          type="2d"
          id={canvasId}
        ></canvas>
      ) : (
        <Canvas
          className={className}
          style={{...style, width: '100%', height: '100%'}}
          // @ts-ignore
          width={width}
          height={height}
          type="2d"
          id={canvasId}
          canvasId={canvasId}
          onTouchStart={touchStart}
          onTouchMove={touchMove}
          onTouchEnd={touchEnd}
        />
      )}
    </>
  );
};

export default App;
