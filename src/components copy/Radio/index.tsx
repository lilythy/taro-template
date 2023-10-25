import React from 'react';
import {Icon, View} from '@tarojs/components';

import './index.less';

/**
 * @method 自定义单选框，原生的Radio不是受控组件
 */
const CustomRadio = ({checked, disabled, style = {}, onChange, ...rest}) => {
  return (
    <View
      className={`c-cr ${checked ? 'c-cr__active' : ''} ${disabled ? 'c-cr__disabled' : ''}`}
      style={style}
      {...rest}
      onClick={() => !disabled && onChange && onChange(!checked)}
    >
      {checked && (
        <Icon
          className="c-cr__icon"
          color={disabled ? '#ccc' : '#fff'}
          size="14"
          type="success_no_circle"
        />
      )}
    </View>
  );
};

export default React.memo(CustomRadio);
