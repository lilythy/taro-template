import React, {memo, useState} from 'react';
import {Image, ImageProps} from '@tarojs/components';
import {doFun, getGraphList} from '@/utils';
import Taro from '@tarojs/taro';
import {defaultImageHost} from '@/enum';

interface Props extends ImageProps {
  preview?: boolean;
  urls?: string[];
  style?: React.CSSProperties;
  autoHeight?: boolean;
  autoWidth?: boolean;
  width?: number;
  height?: number;
}

const DefaultImage = (props: Props) => {
  const [randomId] = useState(
    Math.random()
      .toString()
      .slice(2)
  );
  const {
    preview,
    onClick,
    src: defaultSrc,
    urls: defaultUrls,
    className,
    style = {},
    autoHeight,
    autoWidth
  } = props;
  const src =
    defaultSrc.startsWith('http') ||
    defaultSrc.startsWith('data') ||
    defaultSrc.startsWith('/https')
      ? defaultSrc
      : defaultImageHost + defaultSrc;

  let urls = defaultUrls || [src];

  const [calcStyle, setCalcStyle] = useState({});

  return (
    <Image
      {...props}
      src={src}
      style={{backgroundRepeat: 'no-repeat', ...style, ...calcStyle}}
      className={`${className} image-${randomId}`}
      onLoad={({detail: {height, width}}) => {
        if (typeof height === 'number' && typeof width === 'number') {
          getGraphList(`.image-${randomId}`).then(([res = {}]: any[]) => {
            const {width: activeWidth, height: activeHeight} = res;
            if (activeWidth && activeHeight) {
              if (autoHeight) {
                setCalcStyle({height: (activeWidth / width) * height});
              } else if (autoWidth) {
                setCalcStyle({height: (activeHeight / height) * width});
              }
            }
          });
        }
      }}
      onClick={() => {
        const result = doFun(onClick);
        result !== false &&
          preview &&
          Taro.previewImage({
            current: src,
            urls
          });
      }}
    />
  );
};

export default memo(DefaultImage, (prev, next) => {
  if (next.preview && next.urls) {
    return (
      (prev.urls || []).map((i = '') => i.split('?')[0]).join('') ===
      (next.urls || []).map((i = '') => i.split('?')[0]).join('')
    );
  }
  return (prev.src || '').split('?')[0] === (next.src || '').split('?')[0];
});
