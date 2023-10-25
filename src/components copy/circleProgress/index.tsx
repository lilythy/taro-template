import {Canvas, CanvasProps, Text, View} from '@tarojs/components';
import Taro, {createCanvasContext} from '@tarojs/taro';
import React, {useEffect, useState} from 'react';
import usePrevious from '@/hooks/usePrevious';
import {useLatest} from 'taro-hooks';
import './index.less';

function angle(n, startAngle) {
  let newN = n + startAngle;
  if (newN > 360) {
    newN = newN - 360;
  }
  return (newN * Math.PI) / 180;
}
const DrawCanvas = (id, start, progress, options) => {
  const {
    strokeColor = '#e6edff',
    activeColor = '#2c58c6',
    lineWidth = 6,
    pixelRatio,
    startAngle = 142,
    maxAngle = 256,
    size = 140,
  } = options;
  var ctx = createCanvasContext(id);

  const trueNumber = n => n * pixelRatio;
  const draw = count => {
    ctx.beginPath();
    ctx.setLineWidth(trueNumber(lineWidth));
    ctx.setStrokeStyle(strokeColor);
    ctx.setLineCap('round');
    ctx.arc(
      trueNumber(size / 2),
      trueNumber(size / 2),
      trueNumber(size / 2 - 5),
      angle(0, startAngle),
      angle(maxAngle, startAngle),
      false
    );
    ctx.stroke();

    if (count > 0) {
      ctx.beginPath();
      ctx.setStrokeStyle(activeColor);
      ctx.setLineCap('round');
      ctx.arc(
        trueNumber(size / 2),
        trueNumber(size / 2),
        trueNumber(size / 2 - 5),
        angle(0, startAngle),
        angle(maxAngle * (count / 100), startAngle),
        false
      );
      ctx.stroke();
    }

    ctx.draw();
  };
  let space = progress / 40;
  let startProgress = start;

  const timer = setInterval(() => {
    startProgress += space;
    if (startProgress > progress) {
      startProgress = progress;
    }
    draw(startProgress);
    startProgress === progress && clearInterval(timer);
  }, 1000 / 60);
};

declare module 'react' {
  interface CanvasProps {
    height: number;
    width: number;
  }
}
interface Props extends CanvasProps {
  /** 当前进度，只能为数字 0-100 */
  progress: number;
  /** 中间文本，只能为数字 */
  text: number;
  /** 中间文本 样式 */
  textStyle?: React.CSSProperties;
  /** 进度条下的文本 */
  suffix?: React.ReactElement;
  /** 文字后缀 */
  textSuffix?: React.ReactNode;
  /** 组件 最外层的className */
  className?: string;
  /** 组件 最外层样式 */
  style?: React.CSSProperties;
  /** 进度条配置 */
  options?: {
    /** 进度条底色 */
    strokeColor?: string;
    /** 进度条亮色 */
    activeColor?: string;
    /** 进度条的宽度 */
    lineWidth?: number;
    /** 开始角度，默认 142 */
    startAngle?: number;
    /** 最大多少度 0-360，默认 256 */
    maxAngle?: number;
    /** 进度条宽高 */
    size?: number;
  };
}

/**
 * 圆环进度条
 * @param progress: 0-100
 * @param options.strokeColor: 背景色
 * @param options.activeColor: 颜色
 * @param options.lineWidth: 线条粗度
 */
let circleProgressTimer;
function CircleProgress(props: Props) {
  const [{pixelRatio}] = useState(Taro.getSystemInfoSync());
  const {
    className = '',
    progress,
    text,
    options = {},
    suffix,
    textStyle = {},
    style = {},
    textSuffix = '',
    ...canvasProps
  } = props;

  const startProgress = usePrevious(progress);
  const [showText, setText] = useState(-1);

  const curr = useLatest<number>(showText);
  const [randomId] = useState(Math.random().toString().slice(2));

  useEffect(() => {
    clearInterval(circleProgressTimer);

    if (progress !== undefined) {
      if (progress === 0) {
        setText(0);
        DrawCanvas(`canvasId${randomId}`, startProgress || 0, progress, {...options, pixelRatio});
        return;
      }
      circleProgressTimer = setInterval(() => {
        let newNumber = curr.current + 1;
        if (newNumber > text) {
          newNumber = text;
        }

        setText(newNumber);
        newNumber >= text && clearInterval(circleProgressTimer);
      }, 1000 / 100);
      DrawCanvas(`canvasId${randomId}`, startProgress || 0, progress, {...options, pixelRatio});
    }
  }, [progress, text]);
  const {size = 140} = options;

  return (
    <View className={`default-progress-box ${className} mb12`} style={style}>
      <Canvas
        // @ts-ignore
        style={{width: size, height: size}}
        // @ts-ignore
        width={size * pixelRatio}
        height={size * pixelRatio}
        {...canvasProps}
        id={`canvasId${randomId}`}
      />
      {text !== undefined && (
        <Text className="text fs100 semibold weight6 pt10 row" style={textStyle}>
          {showText < 0 ? 0 : showText}
          {textSuffix}
        </Text>
      )}
      {suffix !== undefined && <View className="suffix">{suffix}</View>}
    </View>
  );
}
export default CircleProgress;
