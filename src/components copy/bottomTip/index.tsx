import React from 'react';
import {View, Text, ViewProps} from '@tarojs/components';
import './index.less';
import {isFull} from '@/utils';

interface BottomTipProps extends ViewProps {
  tip?: string;
  lineWidth?: number | string;
}
const BottomTip = (props: BottomTipProps) => {
  const {tip = '已经到底了', lineWidth = '0.64rem', className = '', ...options} = props;
  return (
    <View className={`default-bottom-tip pb${isFull ? 34 : 64} pt20 ${className}`} {...options}>
      <View className="bottom-line" style={{width: lineWidth}} />
      <Text className="bottom-text fs24 colorC">{tip}</Text>
      <View className="bottom-line" style={{width: lineWidth}} />
    </View>
  );
};

export {BottomTipProps};
export default BottomTip;
