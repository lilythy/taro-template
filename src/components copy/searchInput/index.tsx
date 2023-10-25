import React from 'react';
import {Icon, View, Input} from '@tarojs/components';

import './index.less';

interface Props {
  value?: string;
  onInput: any;
  maxlength?: number;
  handleSearch?: any;
  controlled?: boolean;
  onClear: Function;
  defaultProps?: object | undefined;
}

/**
 * @method 搜索框
 */
const SearchInput = (props: Props) => {
  const {
    value,
    onInput,
    handleSearch,
    maxlength = 15,
    controlled = true,
    onClear = () => {},
    defaultProps = {}
  } = props;
  return (
    <View className="c-si">
      <Icon size="16" type="search" color="#ccc" />
      <Input
        className="c-si__input"
        placeholderClass="c-si__input-plc"
        value={value}
        onInput={e => onInput(e.detail.value)}
        type="text"
        placeholder="搜索素材文件"
        maxlength={maxlength}
        onConfirm={handleSearch}
        onBlur={handleSearch}
        confirmType="搜索"
        controlled={controlled}
        cursor={20}
        {...defaultProps}
      />
      {value && (
        <View
          onClick={() => {
            onClear();
          }}
        >
          <Icon size="16" type="clear" color="#ccc" />
        </View>
      )}
    </View>
  );
};

export default React.memo(SearchInput);
