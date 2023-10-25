import React, {useState} from 'react';
import {View} from '@tarojs/components';
import './index.less';

interface CheckProps {
  text: string | number;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (res: boolean) => void;
}

const App = (props: CheckProps) => {
  const {text, disabled, checked = false, onChange} = props;
  const [check, setChecked] = useState(checked);
  const onClick = () => {
    if (disabled) return;
    setChecked(!check);
    onChange && onChange(!check)
  }
  return (
    <View className={`checkbox-wrap ${disabled ? 'checkbox-disable': ''}`} onClick={onClick}>
      <View className={`modal-item-check ${check ? 'checkbox-current' : ''}`}></View>
      <View className='modal-item-text'>{text}</View>
    </View>
  )
}

export default App;
