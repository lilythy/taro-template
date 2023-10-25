import {Text, TextProps} from '@tarojs/components';
import React, {ReactElement} from 'react';
import './index.less';

interface Props extends TextProps {
  type?: 'success' | 'error' | 'default' | 'black';
  scale?: number;
  children: string | ReactElement;
  className?: string;
  style?: any;
}

function StatusText(props: Props) {
  const {type = 'default', scale = 0.83, children, className = '', style = {}, ...other} = props;
  return (
    <Text
      className={`row regular fs24 lh30 weight4 color3 default-status ${type} ${className}`}
      style={{transform: `scale(${scale})`, ...style}}
      {...other}
    >
      {children}
    </Text>
  );
}

export default StatusText;
