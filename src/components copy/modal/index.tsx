import React from 'react';
import {Button, View} from '@tarojs/components';

import './index.less';

interface ModalProps {
  className?: string;
  visible: boolean;
  title: string | boolean;
  width?: number;
  height?: number;
  children?: any;
  okText?: string;
  cancelText?: string;
  footer?: boolean;
  onOk?: (res) => any;
  onCancel?: () => any;
  okProps?: any;
  cancleProps?: any;
}

const App = (props: ModalProps) => {
  const {
    className = '',
    visible = false,
    title = '提示',
    footer = true,
    okText = '确定',
    cancelText = '取消',
    children,
    width = 600,
    height = 400,
    onOk = () => {},
    onCancel = () => {},
    okProps = {},
    cancleProps = {}
  } = props;

  return (
    <View
      className={`default-modal-mask ${className}`}
      style={{display: visible ? 'block' : 'none'}}
    >
      {/* style={{width: `${width / 100}rem`}} */}
      <View className="default-modal-wrap">
        {title && <View className="default-modal-title">{title}</View>}
        <View className="default-modal-content" style={{height: `${height / 100}rem`}}>
          {children}
        </View>
        {footer && (
          <View className="default-modal-footer">
            {cancelText && (
              <Button className="button cancle-btn" onClick={onCancel} {...cancleProps}>
                {cancelText}
              </Button>
            )}
            {okText && (
              <Button className="button sure-btn" type="primary" onClick={onOk} {...okProps}>
                {okText}
              </Button>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default App;
