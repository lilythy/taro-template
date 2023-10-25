import api from '@/apis';
import useInterval from '@/hooks/useInterval';
import {doFun} from '@/utils';
import {Text, View, Video} from '@tarojs/components';
// @ts-ignore
import Taro, {ENV_TYPE, isIDE} from '@tarojs/taro';
import React, {useCallback, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {useLatest, useThrottleFn} from 'taro-hooks';
import Audio from './Audio';
import './index.less';
interface Props {
  src: string;
  poster?: string;
  children?: React.ReactElement | React.ReactElement[];
  onEnded?: Function;
  attachmentId?: string;
  lessonId?: string;
  changePlayTime?: (arg1: number) => void;
  lastPlayTime?: number;
  type?: 'video' | 'audio';
  title?: string;
  className?: string;
}
const Player = (props: Props, ref) => {
  const {
    src,
    poster = '',
    className = '',
    children,
    attachmentId,
    lessonId,
    changePlayTime,
    lastPlayTime = 0,
    type = 'video',
    title = '',
    onEnded
  } = props;

  const [space] = useState(!isIDE ? 1000 : 1);
  const [enter, setEnter] = useState(false);

  const [videoPlayer, setVideoPlayer] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [playTime, setPlayTime] = useState(0);

  // const [startDefaultPlay, setStartDefaultPlay] = useState(false);
  // const [maxPlayTime, setMaxPlayTime] = useState(0);

  // const maxVideo;
  // const previous = usePrevious(playTime);

  // useEffect(() => {
  // if (startDefaultPlay && playTime - (previous || 0) > 1) {
  //   if (playTime > maxPlayTime) {
  //     showToast('禁止拖动');
  //     videoPlayer.seek(maxPlayTime);
  //   } else {
  //     videoPlayer.seek(playTime);
  //   }
  // } else {
  //   if (playTime > maxPlayTime) {
  //     setMaxPlayTime(playTime);
  //   }
  // }
  // }, [playTime, previous, maxPlayTime]);

  const playTimeRef = useLatest(playTime);

  const log = useCallback(
    (time = 5) => {
      time > 0 &&
        lessonId &&
        api.course.train.log({
          duration: time,
          lessonAttachmentId: attachmentId,
          lessonId,
          lastPlayLocation: playTimeRef.current
        });
    },
    [attachmentId, lessonId, playTimeRef]
  );
  const {reset, stop, start, pause, count} = useInterval(5, log);
  const currentCount = useLatest(count);

  useEffect(() => {
    return () => {
      log(currentCount);
    };
  }, []);

  useEffect(() => {
    reset();
    setEnter(false);
    setLoading(true);
    if (type !== 'video') return;
    const video_context = Taro.createVideoContext('myVideo');
    setVideoPlayer(video_context);
    setTimeout(() => {
      video_context?.play();
    }, 500);
    // setPlayTime(0);
    // setTimeout(() => setPlayTime(0.1));
    // setStartDefaultPlay(false);
    // setMaxPlayTime(0);
  }, [src]);

  useEffect(() => {
    loading &&
      setTimeout(() => {
        setLoading(false);
      }, 300);
  }, [loading]);

  const {run: changeTime} = useThrottleFn(
    time => {
      setPlayTime(time | 0);
      doFun(changePlayTime, time | 0);
    },
    {wait: 500}
  );
  const audioRef: any = useRef();
  useImperativeHandle(ref, () => {
    return {
      pause: () => {
        audioRef.current?.pause();
      },
      play: () => audioRef.current?.play(),
      seek: n => audioRef.current?.seek(n)
    };
  });

  return (
    <View className={className} key={src}>
      <View className="video-control row colorF" hidden></View>
      {loading ? (
        <View className="default-video-loading">
          <Text>加载中</Text>
        </View>
      ) : type === 'video' ? (
        <Video
          className="default-video"
          enablePlayGesture
          enableAutoRotation
          nativeProps={{
            enableNative: true
          }}
          title={title}
          controls
          {...{
            id: 'myVideo',
            src,
            onWaiting: () => {},
            poster,
            autoplay: false,
            enableNative: true,
            onPlay: () => {
              start();
            },
            onPause: () => {
              pause();
            },
            onTimeUpdate: ({detail: {currentTime}}: any) => {
              const time = currentTime / space;
              changeTime(time);
              if (!enter && lastPlayTime > 0) {
                videoPlayer.seek(lastPlayTime);
                setEnter(true);
              }
            },
            onEnded: () => {
              stop();
              doFun(onEnded);
            }
          }}
        />
      ) : (
        // @ts-ignore
        <Audio
          {...{src, title, start, pause, setPlayTime, lastPlayTime, changeTime, onEnded, audioRef}}
        />
      )}
      {children}
    </View>
  );
};

export default React.forwardRef(Player);
