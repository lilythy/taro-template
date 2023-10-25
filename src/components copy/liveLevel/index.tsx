import React from 'react';
import {View, Text} from '@tarojs/components';
import './index.less';

const levelIconText = {
  'l1': 'Lv1',
  'l2': 'Lv2',
  'l3': 'Lv3',
  'l4': 'Lv4',
  'l5': 'Lv5',
}

const levelToText = {
  'l1': '入门',
  'l2': '初级',
  'l3': '中级',
  'l4': '高级',
  'l5': '专家',
}

const Index = props => {
  const {levelCode = 'l1', className = '', ...options} = props;
  return (
    <View className={`common-level-cls live-level-${levelCode} ${className}`} {...options}>
      {/* <Text className="iconfont star-wrap" style={{color: '#FFF7F1', fontSize: '14px'}}>
      &#xe693;
      </Text> */}
      <View className={`star-wrap fs24`}>{levelIconText[levelCode]}</View>
      <View className='level-text'>{levelToText[levelCode]}</View>
    </View>
  );
};

export default Index;
