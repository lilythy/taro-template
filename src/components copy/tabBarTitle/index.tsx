import React from 'react';
import {View} from '@tarojs/components';
import './index.less';

const Index = props => {
  const {text = '', className = '', ...options} = props;
  return (
    <View className={`tab-bar-wrap ${className}`} {...options}>
      <View className='tab-bar-icon'/>
      {text}
    </View>
  );
};

export default Index;
