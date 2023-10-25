/**
 * scroll tab
 */

import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {ScrollView, View} from '@tarojs/components';

import './index.less';

const App = (props, ref) => {
  const {
    data = [],
    type = 1,
    onChange = () => {},
    itemStyle = {},
    lineStyle = {},
    activeColor = '#2C58C6'
  } = props;
  const [active, setActive] = useState(type);

  useImperativeHandle(ref, () => ({
    changeActive: setActive
  }));
  return (
    <View className="tab-wrap">
      <View className="tab-item-box">
        <ScrollView className="tab-scroll-view" scrollX>
          {data
            .filter(i => !i.hidden)
            .map((item, index) => {
              const activeItemStyle = {};
              if (active === item.type) {
                Object.assign(activeItemStyle, {
                  color: activeColor
                });
              }
              if (index === 0) {
                Object.assign(activeItemStyle, {
                  // paddingLeft: 0
                });
              }
              return (
                <View
                  className={`tab-item regular fs28 weight4 ${
                    active === item.type ? 'tab-item-active semibold weight6' : ''
                  }`}
                  key={`tab_item_${item.type}`}
                  style={{...itemStyle, ...activeItemStyle}}
                  onClick={() => {
                    if (active !== item.type) {
                      setActive(item.type);
                      onChange(item?.type);
                    }
                  }}
                >
                  {item?.title}
                  <View
                    className="tab-item-line"
                    style={{backgroundColor: activeColor, ...lineStyle}}
                  />
                </View>
              );
            })}
          {/* </View> */}
        </ScrollView>
      </View>
    </View>
  );
};

export default forwardRef(App);
