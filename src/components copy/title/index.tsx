import React from 'react';
import {View, Text} from '@tarojs/components';

import './index.less';

const Index = props => {
  const {
    title = '',
    more = false,
    moreClick = () => {},
    bold = false,
    subTitle,
    size = 'normal',
    style = {},
    className = '',
    icon = ''
  } = props;
  return (
    <View className={`title-box ${className}`} style={style}>
      <View className="row">
        {icon}
        <Text className={`title ${bold ? 'bold' : ''} ${size} skeleton-rect`}>{title}</Text>
        {subTitle && <View className="sub-title">{subTitle}</View>}
      </View>
      {more && (
        <Text className="more light skeleton-rect row colorC weight2" onClick={moreClick}>
          查看全部 <Text className="more-icon iconfont-new fs40">&#xe668;</Text>
        </Text>
      )}
    </View>
  );
};

export default Index;
