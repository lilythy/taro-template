import {View, Text, Button} from '@tarojs/components';
import useTextModal from '@/model/useTextModal';
import React from 'react';
import './index.less';
type ModalProps = {
  visibility: boolean;
  data: object;
};
const TextModal = (props: ModalProps) => {
  const {visibility, data} = props;
  const {toggleVisible} = useTextModal();
  const cancelVisible = () => {
    toggleVisible();
  };
  return (
    <View
      className="container"
      onClick={e => {
        cancelVisible();
        e.preventDefault();
      }}
      style={{
        display: visibility ? 'block' : 'none'
      }}
    >
      <View className="popup">
        <View className="popup-header">
          <Text className="header-title">素材要求说明</Text>
          <Text className="iconfont close-modal" onClick={cancelVisible}>
            &#xe66c;
          </Text>
        </View>
        <View className="popup-body">{data?.templateRemark}</View>
      </View>
    </View>
  );
};
export default React.memo(TextModal);
