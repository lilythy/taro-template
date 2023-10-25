import React from 'react';
import {View, Text, Image} from '@tarojs/components';

import './index.less';

interface Props {
  text?: any;
  img?: string;
  className?: string;
  imgStyle?: any;
  suffix?: any;
  style?: any;
}
const App = (props: Props) => {
  const {
    img = '',
    imgStyle = {},
    text = '暂无内容',
    className,
    suffix,
    style,
    ...otherProps
  } = props;
  return (
    <View className={`no-data-wrap column ${className}`} style={style} {...otherProps}>
      {img && (
        <View className="column mb64" style={{alignItems: 'center'}}>
          <Image className="no-data-img" style={imgStyle} mode="aspectFit" src={img} />
        </View>
      )}
      <View>
        <Text className="fs28 color9 lh40 weight2 light">{text}</Text>
      </View>
      {suffix}
    </View>
  );
};

export default App;
