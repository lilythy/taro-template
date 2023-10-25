import React from 'react';
import {Image, View} from '@tarojs/components';
import emptyImg from '@/resource/empty.png';
import './index.less';

interface IProps {
  className?: string;
  des?: any;
}
const Empty = (props: IProps) => {
  const {des} = props;
  return (
    <View className="empty-wrap">
      <Image className="img" src={emptyImg} />
      <View className="des">{des || '暂无数据'}</View>
    </View>
  );
};

export default Empty;
