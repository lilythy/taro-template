import React from 'react';
import {Text, TextProps} from '@tarojs/components';

import './index.less';
import {showToast} from '@/utils';

interface Props extends TextProps {
  children: string | React.ReactElement;
  disabled?: boolean;
  disabledTip?: string;
  type?: string;
}
const Index = (props: Props) => {
  const {disabled, className, children, onClick, disabledTip, style = {}} = props;
  return (
    <Text
      className={`default-button ${className} ${disabled ? 'disabled' : ''}`}
      style={style}
      onClick={e => {
        if (disabled) {
          disabledTip && showToast(disabledTip, 900);
          return false;
        }
        typeof onClick === 'function' && onClick(e);
      }}
    >
      {children}
    </Text>
  );
};

export default Index;
