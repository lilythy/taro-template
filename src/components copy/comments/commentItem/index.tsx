import React, {useState} from 'react';
import {View, Text, Image} from '@tarojs/components';

import './index.less';
import {beforeTime, dateFormat} from '@/utils';

const Index = props => {
  const detail = props.detail;
  return (
    <View className="course-comments-item row pb64" style={{alignItems: 'start'}}>
      <Image
        className="course-comments-item-icon"
        webp
        src={
          detail.portraitImageUrl ||
          'https://zxhy-web-site-static.oss-cn-hangzhou.aliyuncs.com/assets/user.png'
        }
      />
      <View className="column pl18 flex1 box-size-border ">
        <Text className="regular fs28 color6 lh44 weight4 pb4 weight6">{detail.userName}</Text>
        <Text className="regular fs24 color9 lh36 weight4 pb24">
          {dateFormat(detail.gmtCreate, 'YYYY年MM月DD日 HH:mm:ss')}
        </Text>
        <Text className="regular fs28 color3 lh44 weight4 break-all">{detail.content}</Text>
      </View>
    </View>
  );
};

export default Index;
