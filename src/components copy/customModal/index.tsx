import React from 'react';
import {Image, View} from '@tarojs/components';

import CloseIcon from './close-icon.png';

import './index.less';

interface ModalProps {
  visible: boolean;
  title: string | boolean;
  children?: any;
  okText?: string;
  cancelText?: string;
  footer?: any;
  showIcon?: boolean;
  type?: string;
  onOk?: (res) => any;
  onCancel?: () => any;
}

const CustomModal = (props: ModalProps) => {
  const {
    visible = false,
    title = '提示',
    footer = true,
    okText = '确定',
    cancelText = '取消',
    children,
    type = 'normal',
    showIcon = false,
    onOk = () => {},
    onCancel = () => {}
  } = props;

  if (!visible) return null;
  return (
    <View className="c-cm__mask">
      <View className="c-cm">
        <View className="c-cm__title">{title}</View>
        <View className="c-cm__body">{children}</View>
        {showIcon && (
          <View className="c-cm__close" onClick={onCancel}>
            <Image className="c-cm__close-icon" src={CloseIcon} />
          </View>
        )}
        {footer && (
          <View className="c-cm__footer">
            <View
              className="c-cm__footer-btn c-cm__footer-cancel"
              onClick={onCancel}
              style={{color: type === 'danger' ? '#2C58C6' : '#999999'}}
            >
              {cancelText}
            </View>
            <View
              className="c-cm__footer-btn c-cm__footer-ok"
              onClick={onOk}
              style={{color: type === 'danger' ? '#FF4D4F' : '#2C58C6'}}
            >
              {okText}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default React.memo(CustomModal);
