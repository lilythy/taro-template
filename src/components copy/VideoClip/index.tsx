import React, {useCallback, useEffect, useState} from 'react';
import {View, Video} from '@tarojs/components';
import Taro from '@tarojs/taro';
import dayjs from 'dayjs';

import {getNodeDomInfo} from '@/utils/page';

import './index.less';
import {isH5, timeHandel} from '@/utils';

// 临时位置信息
let temPositionValue = 0;

/**
 * @method 自定义视频剪裁
 * @param {number} videoDuration 视频时长 单位s
 * @param {string} videoUrl 视频url
 * @param {string} poster 视频封面url 选填
 * @param {number} clipTime 固定裁剪时长 单位s (选填)
 * @param onChange return startTime&endTime
 * @param style 容器样式（选填）
 */

// test video url https://zxhy-live.oss-cn-hangzhou.aliyuncs.com/4D%E8%AF%86%E4%BA%BA%E8%AF%86%E5%B7%B1.mp4
const VideoClip = ({
  videoDuration = 12006,
  videoUrl = '',
  poster = '',
  clipTime = 0,
  onChange = (startTime, endTime) => console.log(startTime, endTime),
  style = {},
  onlyView = false
}) => {
  // 剪裁开始结束时间
  const [startTime, setStartTime] = useState<string>('00:00:00');
  const [endTime, setEndTime] = useState<string>('00:00:00');
  // const [resultTime, setResultTime] = useState<number>(0);

  // 元素几何位置
  const [width, setWidth] = useState<number>(0);
  const [left, setLeft] = useState<number>(0);
  const [boxWidth, setBoxWidth] = useState<number>(0);
  const [boxMinWidth, setBoxMinWidth] = useState<number>(0);
  const [boxLeft, setBoxLeft] = useState<number>(0);
  const [muted, setMuted] = useState<boolean>(false);

  // 滑块渲染最小宽度
  const [realMinWidth, setRealMinWidth] = useState<number>(0);
  // 最小宽度对应的市场是多少秒
  let videoContext: any = null;
  // 视频播放跳转
  const toSeek = useCallback(
    second => {
      if (isH5) {
        videoContext.seek(second);
      } else {
        videoContext.play();
        setTimeout(() => {
          videoContext.seek(second);
          setTimeout(() => {
            videoContext.pause();
          }, 500);
        }, 500);
      }
    },
    [videoContext]
  );

  useEffect(() => {
    if (videoContext && !isH5) {
      toSeek(0);
    }
    // eslint-disable-next-line
  }, [videoContext]);

  // 根据时长初始化几何位置信息
  useEffect(() => {
    setTimeout(() => {
      videoContext = Taro.createVideoContext('c-vc__video-com');
      let initResultDuration = clipTime || 1;
      if (!clipTime && initResultDuration <= 0) {
        initResultDuration = 1;
      }
      // setResultTime(videoDuration);
      setEndTime(
        dayjs()
          .startOf('day')
          .add(videoDuration, 'second')
          .format('HH:mm:ss')
      );

      getNodeDomInfo('.c-vc__clip').then((res: any) => {
        const {width: _width, left: allLeft} = res;
        getNodeDomInfo('.c-vc__clip-box').then((clipBpx: any) => {
          const {left: _left} = clipBpx;
          setWidth(_width);
          setLeft(allLeft);
          setBoxLeft(_left - allLeft);
          const minWidth = _width * (initResultDuration / videoDuration) || 1;
          setBoxMinWidth(minWidth);
          setBoxWidth(_width);
        });
        // 最小宽度40px 对应的真实物理宽度
        getNodeDomInfo('.c-vc__empty').then((emptyBox: any) => {
          setRealMinWidth(emptyBox.width);
        });
      });
    }, 100);
  }, [clipTime, videoDuration]);

  const onTouchStart = useCallback(e => {
    if (!isH5) {
      // @ts-ignore
      Taro.vibrateShort({type: 'medium'}).then();
    }
    e.stopPropagation();
    temPositionValue = e.touches?.[0]?.pageX;
  }, []);

  const onTouchMove = useCallback(
    (e, type) => {
      e.stopPropagation();
      if (videoDuration <= 1) return;
      const {pageX} = e.touches?.[0] || {};
      let moveX = pageX - temPositionValue;
      if (type === 'right') {
        if (clipTime) return;
        setBoxWidth(prevState => {
          let newWidth = prevState + moveX;
          // 左右超出
          if (newWidth + boxLeft > width) {
            return prevState;
          }
          if (newWidth > width) {
            return width;
          }
          // 不得小于1s
          if (newWidth < boxMinWidth) {
            return boxMinWidth;
          }
          return newWidth;
        });
      }
      if (type === 'left') {
        if (clipTime) return;
        // 小于1s
        if (boxWidth - moveX <= realMinWidth) {
          return;
        }
        // 左侧超出
        if (moveX + boxLeft < 0) {
          setBoxLeft(0);
          return;
        }
        setBoxWidth(prevState => {
          return prevState - moveX;
        });
        setBoxLeft(prevState => {
          return prevState + moveX;
        });
      }
      if (type === 'middle') {
        setBoxLeft(prevState => {
          // 左侧超出
          if (prevState + moveX < 0) {
            return 0;
          }

          if (boxWidth < realMinWidth) {
            if (prevState + boxWidth + moveX > width - realMinWidth + boxWidth) {
              return width - realMinWidth;
            }
          }
          // 右侧超出
          if (prevState + boxWidth + moveX > width) {
            return width - boxWidth;
          }
          return prevState + moveX;
        });
      }
      setTimeout(() => {
        const startSecond = Math.round((boxLeft / width) * videoDuration);
        let endSecond = Math.round(((boxLeft + boxWidth) / width) * videoDuration);
        setStartTime(
          dayjs()
            .startOf('day')
            .add(startSecond, 'second')
            .format('HH:mm:ss')
        );
        setEndTime(
          dayjs()
            .startOf('day')
            .add(endSecond, 'second')
            .format('HH:mm:ss')
        );
      }, 10);
      temPositionValue = pageX;
    },
    [boxLeft, boxMinWidth, boxWidth, clipTime, realMinWidth, videoDuration, width]
  );

  const onTouchEnd = useCallback(
    (e, type) => {
      e.stopPropagation();
      temPositionValue = 0;
      // 根据距离计算时长
      let startSecond = Math.round((boxLeft / width) * videoDuration);
      let endSecond = Math.round(((boxLeft + boxWidth) / width) * videoDuration);
      if (boxWidth < realMinWidth) {
        getNodeDomInfo('.c-vc__clip-box').then((res: any) => {
          if (res.left + res.width - left >= width) {
            endSecond = videoDuration;
            if (clipTime) {
              startSecond = endSecond - clipTime;
            } else {
              startSecond = endSecond - Math.round((boxWidth / width) * videoDuration);
            }
          }
        });
      }
      setTimeout(() => {
        setStartTime(
          dayjs()
            .startOf('day')
            .add(startSecond, 'second')
            .format('HH:mm:ss')
        );
        setEndTime(
          dayjs()
            .startOf('day')
            .add(endSecond, 'second')
            .format('HH:mm:ss')
        );
      }, 200);
      if (type === 'left' || type === 'middle') {
        toSeek(startSecond);
      } else {
        toSeek(endSecond);
      }
    },
    [boxLeft, boxWidth, clipTime, left, realMinWidth, toSeek, videoDuration, width]
  );
  return (
    <View className="c-vc" style={style}>
      <View
        className="c-vc__video"
        style={{
          height: onlyView ? '100vh' : '65vh'
        }}
      >
        <Video
          id="c-vc__video-com"
          className="c-vc__video-com"
          style={{
            height: onlyView ? '100vh' : '65vh'
          }}
          src={videoUrl ? decodeURIComponent(videoUrl) : ''}
          controls
          autoplay={false}
          muted={muted}
          poster={poster}
          nativeProps={{
            enableNative: true
          }}
          // @ts-ignore
          enableNative
          onLoadedMetaData={() => console.log(111)}
        />
      </View>
      {/*<View className="c-vc__desc">
        提示：为了确保更好的裁剪效果，建议原视频时长不得小于三秒,不得大于一小时。
      </View>*/}
      {!onlyView && (
        <View className="c-vc__dur">
          <View>视频总时长：{timeHandel(videoDuration, 's', false)}</View>
          <View className="c-vc__dur-btn" onClick={() => setMuted(!muted)}>
            {!muted ? '静音' : '取消静音'}
          </View>
        </View>
      )}
      {!onlyView && (
        <View className="c-vc__footer">
          <View className="c-vc__footer-title">剪辑视频</View>
          <View className="c-vc__clip_box">
            <View
              className="c-vc__clip"
              onTouchStart={onTouchStart}
              onTouchMove={e => onTouchMove(e, 'middle')}
              onTouchEnd={e => onTouchEnd(e, 'middle')}
            >
              <View
                className="c-vc__clip-box"
                style={{left: boxLeft + 'px', width: boxWidth + 'px'}}
              >
                <View
                  className="c-vc__clip-left"
                  onTouchStart={onTouchStart}
                  onTouchMove={e => onTouchMove(e, 'left')}
                  onTouchEnd={e => onTouchEnd(e, 'left')}
                >
                  <View className="c-vc__clip-line" />
                </View>
                {/*<View className="c-vc__clip-value">{resultTime}s</View>*/}
                <View
                  className="c-vc__clip-right"
                  onTouchStart={onTouchStart}
                  onTouchMove={e => onTouchMove(e, 'right')}
                  onTouchEnd={e => onTouchEnd(e, 'right')}
                >
                  <View className="c-vc__clip-line" />
                </View>
              </View>
            </View>
          </View>
          <View className="c-vc__wrap">
            <View>
              <View className="c-vc__result-desc">已选视频时间段</View>
              <View className="c-vc__result">
                <View className="c-vc__result-text">{startTime}</View>-
                <View className="c-vc__result-text c-vc__result-end">{endTime}</View>
              </View>
            </View>
            <View className="c-vc__btn" onClick={() => onChange(startTime, endTime)}>
              导出
            </View>
          </View>
        </View>
      )}

      <View className="c-vc__empty" />
    </View>
  );
};

export default React.memo(VideoClip);
