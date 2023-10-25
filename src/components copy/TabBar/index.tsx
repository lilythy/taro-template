import {View, Image} from '@tarojs/components';
import React from 'react';
import Taro from '@tarojs/taro';
import './index.less';

interface Props {
  current?: number;
  background?: string;
  color?: string;
  tintColor?: string;
  fixed?: boolean;
  onClick?: (res: number) => void;
  tabList: any[];
}

export default (props: Props) => {
  const {
    current = 0,
    background = '#fff',
    color = '#999',
    tintColor = '#6190e8',
    fixed = false,
    onClick = () => {},
    tabList = []
  } = props;

  const onSwitchTab = (item, index) => {
    if (current === index) {
      return false;
    }
    Taro.reLaunch({url: '/' + item.pagePath});
    // if (item.pagePath === 'pages/live/index' || item.pagePath === 'pages/guiderData/index') {
    //   Taro.switchTab({url: '/' + item.pagePath});
    // } else {
    //   Taro.redirectTo({url: '/' + item.pagePath});
    // }
  };

  const urlHandel = url => {
    if (url.indexOf('http') === -1) {
      return '/' + url;
    }
    return url;
  };

  return (
    <View className={`tab-bar-custom-wrap ${fixed ? 'tab-bar-fixed' : ''}`}>
      <View className="tab-bar-list" style={{backgroundColor: background}}>
        {tabList.map((item, index) => {
          return (
            <View
              className="tab-bar-item"
              key={item.pagePath}
              onClick={() => {
                onSwitchTab(item, index);
                onClick(index);
              }}
            >
              <Image
                className="tab-bar-icon"
                src={
                  current === index ? urlHandel(item.selectedIconPath) : urlHandel(item.iconPath)
                }
              />
              <View className="tab-bar-text" style={{color: current === index ? tintColor : color}}>
                {item.text}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};
