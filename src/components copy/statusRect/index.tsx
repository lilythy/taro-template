import {View} from '@tarojs/components';
import React from 'react';
import './index.less';

interface Props {
  className: string;
  text: string;
  status: 'noStart' | 'ongoing' | 'success' | 'error';
}
function StatusRect(props: Props) {
  const {className = '', text = '进行中', status = 'start'} = props;
  return <View className={`status-rect fs28 regular weight4 ${className} ${status}`}>{text}</View>;
}

export default StatusRect;
