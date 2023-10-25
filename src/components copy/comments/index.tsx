import React from 'react';
import {Text, View} from '@tarojs/components';
import CommentItem from './commentItem';

import './index.less';

const Index = props => {
  const {list = [], loading, emptySuffix} = props;

  return (list || []).length ? (
    <View className="course-comments-warp">
      {(list || []).map((item, index) => (
        <CommentItem key={index} detail={item} />
      ))}
    </View>
  ) : loading ? (
    <View />
  ) : (
    <View className="column flex1 center">
      <Text className="regular fs26 color9 weight4 mb32">快来做第一个参与讨论的人</Text>
      {emptySuffix}
    </View>
  );
};

export default Index;
