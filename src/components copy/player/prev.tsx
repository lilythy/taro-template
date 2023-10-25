import store from '@/store';
import {CHANGE_GLOBAL} from '@/store/global';
import {Text, View} from '@tarojs/components';
import React, {useEffect} from 'react';
import Player from './index';

import './index.less';

/**
 * 视频预览，点击后再中间弹出视频，底部有关闭按钮
 * @param props
 * @returns
 */
interface Props {
  src?: string;
  setPlay: (arg: {}) => void;
}
function PrevPlayer(props: Props) {
  const {src, setPlay} = props;
  const changeOverflowY = src => {
    store.dispatch({
      type: CHANGE_GLOBAL,
      payload: {
        overflowY: src ? 'hidden' : 'auto'
      }
    });
  };
  useEffect(() => {
    changeOverflowY(src);
    return () => {
      changeOverflowY('');
    };
  }, [src]);
  if (!src) return null;
  return (
    <View className="default-prev-player-warp">
      <Player src={src} className="default-prev-player" />
      <View className="default-big-button-box">
        <Text className="default-big-button" onClick={() => setPlay({})}>
          关闭
        </Text>
      </View>
      <View className="fixed-bg" />
    </View>
  );
}

export default PrevPlayer;
