import React from 'react';
import {View} from '@tarojs/components';
import './index.less';

const Interval = ({height = '0.2rem'}) => {
  return (
    <View className="interval" style={{height}}>
      &nbsp;
    </View>
  );
};

export default Interval;
