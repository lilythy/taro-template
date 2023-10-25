import {Text, View} from '@tarojs/components';
import React from 'react';

import './index.less';
interface Props {
  title: React.ReactElement;
  suffix?: React.ReactElement;
  hideIcon?: boolean;
}
function SubTitle(props: Props) {
  const {title, suffix, hideIcon = false} = props;
  return (
    <View className="default-sub-title row">
      <View className="title-icon" hidden={!!hideIcon} />
      <Text className="medium fs32 lh48 color3 weight5 flex1">{title}</Text>
      {suffix}
    </View>
  );
}

export default SubTitle;
