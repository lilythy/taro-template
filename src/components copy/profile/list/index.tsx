import React, {useEffect, useState} from 'react';
import {Text, View} from '@tarojs/components';
import Link from '@/components/link';
import Image from '@/components/image';

import './index.less';

const App = props => {
  const {list = [], shopBindInfo} = props;
  useEffect(() => {
    handleBageIsShow();
  }, [shopBindInfo]);
  const [badge, setBadge] = useState(false);
  /**
   * 红点提醒是否展示
   * @returns
   */
  const handleBageIsShow = () => {
    if (shopBindInfo.toString() !== '{}') {
      Object.keys(shopBindInfo).forEach(key => {
        if (
          !shopBindInfo[key] ||
          (key === 'douyinExpireDate' && shopBindInfo?.douyinExpireDate < Date.now())
        ) {
          setBadge(true);
        } else {
          setBadge(false);
        }
      });
    }
  };

  return (
    <View className="my-list-wrap br16">
      {list.map((item, index) => {
        return item.url ? (
          <Link className="pl32 my-list-item-box" to={item.url} key={index}>
            <View className="flex1 row">
              {typeof item.icon === 'string' ? (
                <Image src={item.icon} className="shrink0 icon"></Image>
              ) : (
                item.icon
              )}
              <View className="my-list-item box-size-border flex1 row ml24">
                <Text className="flex1 regular fs32 color3 weight4">{item.text}</Text>
                <Text className="icon-wrap">
                  <Text>{item?.tip || ''}</Text>
                  {/* {item.url.includes('shopSet/index') && <View className="note-badge"></View>} */}
                  {badge && item.url.includes('shopSet/index') && (
                    <View className="note-badge"></View>
                  )}

                  {/* &#xe642; */}
                  <Text className="iconfont-new color6 shrink0 mr30 fs32">&#xe64a;</Text>
                </Text>
              </View>
            </View>
            {item.subText && <View className="list-sub-text">{item.subText}</View>}
          </Link>
        ) : (
          <View className="pl32 my-list-item-box" key={index} onClick={item?.onClick}>
            <View className="flex1 row">
              {typeof item.icon === 'string' ? (
                <Image src={item.icon} className="shrink0 icon"></Image>
              ) : (
                item.icon
              )}
              <View className="my-list-item box-size-border flex1 row ml24">
                <Text className="flex1 regular fs32 color3 weight4">{item.text}</Text>
                <Text className="icon-wrap">
                  <Text>{item?.tip || ''}</Text>
                  <Text className="iconfont-new color6 shrink0 mr30 fs32">&#xe64a;</Text>
                </Text>
              </View>
            </View>
            {item.subText && <View className="list-sub-text">{item.subText}</View>}
          </View>
        );
      })}
    </View>
  );
};

export default App;
