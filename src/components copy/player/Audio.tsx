import {doFun, getGraphList, toMinute} from '@/utils';
import {getBackgroundAudioManager} from '@/utils/apiInterface';
import {Text, View} from '@tarojs/components';
// @ts-ignore
import Taro, {ENV_TYPE, isIDE, useDidHide} from '@tarojs/taro';
import React, {useEffect, useState, memo, useImperativeHandle} from 'react';
import {useLatest} from 'taro-hooks';
import './index.less';

let __audioIntervalTimer__;
const Audio = props => {
  const [randomId] = useState(
    Math.random()
      .toString()
      .slice(2)
  );
  const {
    src,
    title,
    start,
    pause,
    setPlayTime: playerSetPlayTime,
    lastPlayTime,
    changeTime,
    onEnded,
    audioRef
  } = props;
  const [left, setLeft] = useState(0);
  const [moveX, setMove] = useState(0);
  const [startX, setStartX] = useState(0);
  const [touch, setTouch] = useState(false);
  const [duration, setDuration] = useState<number>(isIDE ? 100 : 0);
  const [playTime, setPlayTime] = useState(0);
  const [currentAudio, setCurrentAudio] = useState<any>();

  const lastCurrentAudio = useLatest(currentAudio);
  const [maxLeft, setMaxLeft] = useState(0);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    if (paused) {
      pause();
    } else {
      start();
    }
  }, [paused]);
  const getWidth = async () => {
    const ele1: any = await getGraphList(`.audio-progress-box-${randomId}`);
    const ele2: any = await getGraphList(`.audio-huakuai-${randomId}`);
    if (ele1 && ele1[0] && ele2 && ele2[0]) {
      setMaxLeft(ele1[0].width - ele2[0].width);
    }
  };

  useEffect(() => {
    !touch && setLeft((playTime / duration) * maxLeft);
    playerSetPlayTime(playTime);
  }, [playTime]);

  useEffect(() => {
    src && setTimeout(getWidth, 100);
    setDuration(0);
    const audio = getBackgroundAudioManager();
    audio.src = src;
    audio.seek(lastPlayTime);
    // 监听播放事件
    audio.onPlay = () => {
      setDuration((audio?.duration || 320) | 0);
      setPaused(false);
      setCurrentAudio(audio);
    };
    // 监听播放进度
    audio.onTimeUpdate = (e: any) => {
      setPlayTime(e?.currentTime || 0);
      changeTime(e?.currentTime || 0);
    };
    // 监听暂停事件
    audio.onPause = () => {
      setPaused(true);
    };
    // 监听暂停事件
    audio.onEnded = () => {
      setPaused(true);
      doFun(onEnded);
    };

    // 监听error事件
    audio.onError = () => {
      // showToast(JSON.stringify(e));
      setPaused(true);
      doFun(onEnded);
    };

    Taro.setKeepScreenOn({keepScreenOn: true});
    return () => {
      audio.pause();
      Taro.setKeepScreenOn({keepScreenOn: false});
    };
  }, [src]);

  useImperativeHandle(audioRef, () => {
    return {
      pause: () => lastCurrentAudio.current?.pause(),
      play: () => lastCurrentAudio.current?.play(),
      seek: n => lastCurrentAudio.current?.seek(n)
    };
  });
  useDidHide(() => {
    lastCurrentAudio.current?.pause!();
  });
  const resultLeft = left + moveX < 0 ? 0 : left + moveX > maxLeft ? maxLeft : left + moveX;
  return (
    <View className="column default-audio-warp">
      <View className="row center semibold fs28 color3 weight6 pt32 pb98 mb20">
        正在播放：{title}
      </View>
      <View className="row pl32 pr32 box-size-border" style={{width: '100%'}}>
        <Text
          className="mr18 regular fs24 color9 weight3"
          onClick={() => currentAudio.seek(playTime - 15 < 0 ? 0 : playTime - 15)}
        >
          - 15s
        </Text>
        <View
          className={`flex1 audio-progress-box br2 backgroundC audio-progress-box-${randomId}`}
          catchMove
        >
          <View className="audio-progress" style={{width: resultLeft || 0}}></View>
          <View
            className="audio-huakuai-tip row center color6 fs28"
            style={{display: touch ? 'flex' : 'none'}}
          >
            <Text className="audio-time-text neue audio-time-text1">
              {toMinute(Math.floor((resultLeft / maxLeft) * duration)).join(':')}
            </Text>
            <Text className="pr8">/</Text>
            <Text className="audio-time-text neue audio-time-text2">
              {toMinute(duration).join(':')}
            </Text>
          </View>
          <View
            className={`audio-huakuai pt10 pb10 pl16 pr16 regular fs32 weight4 colorF row center audio-huakuai-${randomId}`}
            style={{transform: `translate(${resultLeft | 0}px, -50%) scale(0.66)`}}
            onTouchStart={e => {
              clearInterval(__audioIntervalTimer__);
              const pX = e.touches[0].clientX;
              setTouch(true);
              setStartX(pX);
            }}
            onTouchMove={e => {
              if (!touch) return;
              const px = e.touches[0].clientX;
              let move = px - startX;
              setMove(move);
            }}
            onTouchEnd={() => {
              currentAudio.play();
              currentAudio.seek(((resultLeft / maxLeft) * duration) | 0);
              setTouch(false);
              setLeft(resultLeft);
              setMove(0);
            }}
          >
            <Text className="audio-time-text neue audio-time-text1 row center">
              {toMinute(Math.floor((resultLeft / maxLeft) * duration)).join(':')}
            </Text>
            <Text className="fs24 pr8">/</Text>
            <Text className="audio-time-text neue audio-time-text2">
              {toMinute(duration).join(':')}
            </Text>
          </View>
        </View>
        <Text
          className="ml18 regular fs24 color9 weight3"
          onClick={() => currentAudio.seek(playTime + 15 > duration ? duration - 1 : playTime + 15)}
        >
          + 15s
        </Text>
      </View>
      <View className="row center pt48">
        {paused ? (
          <Text
            className="iconfont-new fs96 "
            style={{color: '#2C58C6'}}
            onClick={() => {
              currentAudio.play();
            }}
          >
            &#xe670;
          </Text>
        ) : (
          <Text
            className="iconfont-new fs96 "
            style={{color: '#2C58C6'}}
            onClick={() => {
              currentAudio.pause();
            }}
          >
            &#xe671;
          </Text>
        )}
      </View>
    </View>
  );
};
export default memo(Audio, (prev: any, next: any) => {
  return (
    (prev.src || '').split('?')[0].replace(/.[^.]+$/, '') ===
    (next.src || '').split('?')[0].replace(/.[^.]+$/, '')
  );
});
