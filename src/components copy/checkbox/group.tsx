import React, {useEffect, useState} from 'react';
import {View} from '@tarojs/components';
import Checkbox from './index';
import './index.less';

interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

interface CheckProps {
  value?: any[];
  className?: string;
  options: string[] | number[] | Option[];
  initValue?: any[];
  disabled?: boolean;
  onChange?: (res: any) => void;
}

const App = (props: CheckProps) => {
  const {disabled, options, onChange, className, initValue = [], value} = props;
  const [arr, setArr] = useState<any>(value || initValue);

  useEffect(() => {
    setArr(value || initValue)
  }, [value, initValue])
  
  const callback = (item, check: boolean) => {
    let temptArr = [...arr];
    if (check) {
      temptArr = typeof item === 'string' ? [...new Set([...temptArr, ...[item]])] : [...new Set([...temptArr, ...[item.value]])]
    } else {
      const findIdx = temptArr.findIndex(it => it === item || it === item.value);
      temptArr.splice(findIdx, 1);
    }
    setArr(temptArr);
    onChange && onChange(temptArr);
  }
  return (
    <View className={className}>
      {options.map((item, i) => {
        if (typeof item !== 'string' && typeof item !== 'number') {
          return <Checkbox checked={arr.some(val => val === item.value)} text={item.label} key={i} disabled={disabled || item?.disabled} onChange={(res) => {callback(item, res)}} />
        }
        return <Checkbox checked={arr.includes(item)} text={item} key={i} disabled={disabled} onChange={(res) => {callback(item, res)}} />
      })}
    </View>
  )
}

export default App;
