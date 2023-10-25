import React from 'react';
import {Text, View, ViewProps} from '@tarojs/components';
import Taro from '@tarojs/taro';
import {doFun, systemInfo} from '@/utils';
import {openLink} from '@/utils/apiInterface';
import {useVibrate} from 'taro-hooks';
import {getOrigin} from '@/apis';

export const jumpTo = async (url = '', type = 'navigateTo', params = {}) => {
  const {platform} = systemInfo;
  let newUrl = url;
  const origin = await getOrigin();
  // 相对路径使用taro 跳转， 绝对地址使用location
  if (Taro.ENV_TYPE.WEB === Taro.getEnv()) {
    if (url.startsWith('http')) {
      return openLink(url);
    }
  }
  if (type === 'openLink') {
    return openLink(
      /ios/i.test(platform) || url.indexOf(`${origin}/link`) > -1
        ? url
        : `${origin}/link?url=${encodeURIComponent(url)}`
    );
  }
  if (url.startsWith('http')) {
    newUrl = `/pages/webview/index?url=${encodeURIComponent(
      encodeURIComponent(url.replace('http://', 'https://'))
    )}`;
  }

  if (Object.keys(params).length > 0) {
    const paramsStr = Object.keys(params).reduce((curr, item) => {
      return `${curr}${curr ? '&' : ''}${item}=${params[item]}`;
    }, '');
    newUrl += `${newUrl.indexOf('?') > 0 ? '&' : '?'}${paramsStr}`;
  }
  Taro[type]({
    url: newUrl,
    fail: () => {
      Taro.navigateTo({url: '/pages/live/index'});
    }
  });
};

interface Props extends ViewProps {
  children: string | React.ReactElement[] | React.ReactElement;
  type?: 'navigateTo' | 'switchTab' | 'redirectTo';
  url?: string;
  to?: string;
  content?: string;
  title?: string;
  needVibrate?: boolean;
}
const Link = (props: Props) => {
  const {
    children,
    type = 'navigateTo',
    className = '',
    content,
    title,
    onClick: defaultClick,
    needVibrate,
    ...options
  } = props;
  const [vibrateAction] = useVibrate();
  let url = props.url || props.to;
  const onClick = async () => {
    needVibrate && vibrateAction();
    const result = await doFun(defaultClick);
    if (result === false) return;
    if (url) {
      if (content && title) {
        Taro.showModal({
          title,
          content,
          success: ({confirm}) => {
            confirm && jumpTo(url, type);
          }
        });
      } else {
        jumpTo(url, type);
      }
    }
  };

  if (typeof children === 'string') {
    return (
      <Text className={className} {...options} onClick={onClick}>
        {children}
      </Text>
    );
  } else if (Array.isArray(children)) {
    return (
      <View className={className} {...options} onClick={onClick}>
        {children}
      </View>
    );
  } else if (React.isValidElement(children)) {
    // @ts-ignore
    return React.cloneElement(children, {...options, onClick});
  }
  return children;
};

export default Link;
