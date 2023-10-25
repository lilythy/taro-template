import {doFun} from '@/utils';
import {Input, Text, View} from '@tarojs/components';
import React from 'react';

import './index.less';

interface Props {
  value: string;
  setValue: (value: string) => void;
  backgroundColor?: string;
  inputRef?: any;
  disabled?: boolean;
  onSearch?: (arg?: any) => void;
  placeholder?: string;
  maxlength?: number;
  otherInputProps?: {
    confirmType?: 'send' | 'search' | 'next' | 'go' | 'done';
    onConfirm?: (arg?: any) => void;
    nativeProps?: {type: 'send' | 'search' | 'next' | 'go' | 'done'};
  };
  autoFocus?: boolean;
  onClear?: (arg?: any) => void;
}
function DefaultInput(props: Props) {
  const {
    value,
    setValue,
    backgroundColor = 'rgba(0,0,0,0.04)',
    inputRef,
    disabled = true,
    onSearch,
    placeholder,
    maxlength = 140,
    otherInputProps = {
      onConfirm: onSearch,
      confirmType: 'search',
      nativeProps: {type: 'search'},
    },
    autoFocus = true,
    onClear,
  } = props;

  return (
    <View className="row ml24 mr24 br12 search-input-box">
      <View className="row br12 flex1 skeleton-rect h-full" style={{backgroundColor}}>
        <View className="shrink iconfont-new fs48 colorC pb4 pl6">&#xe623;</View>
        <Input
          className="flex1 fs32 pl8"
          value={value}
          onInput={e => {
            doFun(setValue, e.detail.value);
          }}
          style={{background: 'transparent'}}
          autoFocus={autoFocus}
          ref={inputRef}
          placeholder={placeholder || '请输入'}
          placeholderStyle="color:#999"
          disabled={disabled}
          maxlength={maxlength}
          {...otherInputProps}
        />
        {onClear && (
          <View className="shrink iconfont-new fs40 colorC pr6" onClick={onClear}>
            &#xe68d;
          </View>
        )}
      </View>
      {!disabled && (
        <Text
          className="ml10 fs32"
          onClick={() => {
            doFun(onSearch);
          }}
        >
          搜索
        </Text>
      )}
    </View>
  );
}

export default DefaultInput;
