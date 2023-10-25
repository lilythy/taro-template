import store from '@/store';
import {CHANGE_GLOBAL} from '@/store/global';
import {doFun, getGraphList, isFull} from '@/utils';
import {View, Text, ScrollView} from '@tarojs/components';
import Taro, {stopPullDownRefresh, useDidShow} from '@tarojs/taro';
import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import {useThrottleFn} from 'taro-hooks';
import Button from '../button';

import './index.less';

interface bottomButton {
  text: string;
  onClick?: Function;
  className?: string;
  style?: React.CSSProperties;
}

interface Props {
  height?: string;
  button: undefined | React.ReactElement[] | React.ReactElement | string;
  className?: string;
  children: React.ReactElement | React.ReactElement[];
  header?: false | string | React.ReactElement;
  canClose?: boolean;
  showHideBar?: boolean;
  bottomButton?: false | bottomButton;
  wait?: number;
  contentStyle?: React.CSSProperties;
  closeIconStyle?: React.CSSProperties;
  inTab?: boolean;
  canMove?: boolean;
  moveClose?: number;
  onShow?: undefined | Function;
  onHide?: undefined | Function;
  afterClose?: undefined | Function;
  afterShow?: undefined | Function;
  mask?: boolean;
  maskClickHide?: boolean;
  catchMove?: undefined | boolean;
  contentScrollStyle?: React.CSSProperties;
  bottom?: any;
}

export interface DrawerRef {
  show: Function;
  hide: Function;
}
function Drawer(props: Props, ref) {
  const {
    height = '70vh',
    button,
    className,
    children,
    header = 'Drawer',
    canClose = true,
    showHideBar = false,
    bottomButton = false,
    wait = 150,
    contentStyle = {},
    contentScrollStyle = {},
    closeIconStyle = {},
    inTab = false,
    canMove = true,
    moveClose = 100,
    onShow,
    onHide,
    afterClose,
    afterShow,
    catchMove,
    maskClickHide = true,
    mask = true,
    bottom: bottomDom = null,
  } = props;
  const [randomId] = useState(Math.random().toString().slice(2));
  const formatBottom =
    height.indexOf('calc') > -1 ? height.replace('calc(', 'calc(-') : `-${height}`;
  const [visible, setVisible] = useState(false);
  const [dom, setDom] = useState();
  const [bottom, setBottom] = useState<number | string>(formatBottom);
  const [touch, setTouch] = useState(false);
  const [startY, setY] = useState(0);
  const [waitTime, setWaitTime] = useState(wait);
  const [autoCatchMove, setAutoCatchMove] = useState<Boolean | undefined>();

  useEffect(() => {
    let newDom;
    if (typeof button === 'string') {
      newDom = (
        <Text className={className} onClick={show}>
          {button}
        </Text>
      );
    } else if (Array.isArray(button)) {
      newDom = (
        <View className={className} onClick={show}>
          {button}
        </View>
      );
    } else if (React.isValidElement(button)) {
      // @ts-ignore
      const onClick = () => {
        // @ts-ignore
        const result = doFun(button?.props?.onClick);
        if (result === false) return;
        show();
      };
      // @ts-ignore
      newDom = React.cloneElement(button, {...button.props, onClick});
    } else {
      newDom = button;
    }
    setDom(newDom);
  }, [button]);

  useDidShow(() => {
    if (visible) {
      store.dispatch({
        type: CHANGE_GLOBAL,
        payload: {
          overflowY: 'hidden',
        },
      });
    }
  });
  const show = async () => {
    const result = await doFun(onShow);
    if (result === false) return;

    store.dispatch({
      type: CHANGE_GLOBAL,
      payload: {
        overflowY: 'hidden',
      },
    });
    inTab && Taro.hideTabBar();
    setVisible(true);
    setTimeout(() => {
      setBottom(0);
      doFun(afterShow);
    }, 50);
  };
  useEffect(() => {
    setTimeout(async () => {
      const scrollEle: any = await getGraphList(`.drawer-content-scroll-${randomId}`);
      const scrollMain: any = await getGraphList(`.drawer-content-scroll-main-${randomId}`);
      const [{height: height1} = {height: 0}] = scrollMain || [];
      const [{height: height2} = {height: 0}] = scrollEle || [];
      setAutoCatchMove(height1 > height2);
    }, 500);
  }, [children, visible]);

  const hide = async (cancel: boolean = true) => {
    const result = await doFun(onHide);
    if (result === false) {
      return setBottom('0');
    }

    setBottom(formatBottom);
    setTimeout(() => {
      setVisible(false);
      inTab && Taro.showTabBar();
      store.dispatch({
        type: CHANGE_GLOBAL,
        payload: {
          overflowY: 'auto',
        },
      });
      doFun(afterClose, cancel);
    }, 120);
  };

  useImperativeHandle(ref, () => {
    return {
      show,
      hide,
    };
  });

  const {run: buttonClick} = useThrottleFn(
    async () => {
      let result = true;
      if (bottomButton && bottomButton.onClick) {
        result = await doFun(bottomButton.onClick);
      }
      if (result !== false) {
        hide();
      }
    },
    {wait: 1000}
  );
  return (
    <>
      {dom}
      {visible && (
        <>
          {mask && <View className="fixed-bg" onClick={() => maskClickHide && hide()} />}
          <View
            catchMove
            className="drawer-box"
            style={{
              height,
              bottom,
              transitionDuration: `${waitTime}ms`,
            }}
            onTouchStart={e => {
              if (!canMove) return;
              e.stopPropagation();
              stopPullDownRefresh();
              const py = e.touches[0].clientY;
              setWaitTime(0);
              setTouch(true);
              setY(py);
            }}
            onTouchMove={e => {
              e.stopPropagation();
              stopPullDownRefresh();
              if (!touch) return;
              const py = e.touches[0].clientY;
              const a = py - startY;
              if (a > 0) {
                setBottom(`-${a}px`);
              }
            }}
            onTouchEnd={() => {
              setTouch(false);
              setWaitTime(wait);
              const count = bottom.toString()?.split('-').pop()?.trim().replace(/\D+/g, '');
              if (Number(count) > moveClose) {
                hide();
              } else {
                setBottom(`0`);
              }
            }}
          >
            {showHideBar && (
              <View className="hide-bar-box column">
                <View className="hide-bar" />
              </View>
            )}
            {canClose && (
              <Text
                onClick={() => hide()}
                className="drawer-close color9 fs38 iconfont-new"
                style={{...closeIconStyle}}
              >
                &#xe66a;
              </Text>
            )}
            {header &&
              (typeof header === 'string' ? (
                <View className="drawer-header">
                  <Text className="drawer-header-title lh52 fs34 lh44 weight6 semibold color3">
                    {header}
                  </Text>
                </View>
              ) : (
                header
              ))}
            <View
              className={`drawer-content ${bottomButton ? 'has-button' : ''}`}
              catchMove={catchMove === undefined ? !!autoCatchMove : !!catchMove}
            >
              <ScrollView
                scrollY
                style={contentStyle}
                className={`drawer-content-scroll flex1 column drawer-content-scroll-${randomId}`}
              >
                <View
                  className={`drawer-content-scroll-main flex1 column drawer-content-scroll-main-${randomId}`}
                  style={contentScrollStyle}
                >
                  {children}
                </View>
              </ScrollView>
            </View>
            {bottomDom || null}
            {bottomButton && (
              <View
                className={`drawer-bottom-box ${bottomButton.className}`}
                style={{paddingBottom: isFull ? '14px' : 0, ...bottomButton.style}}
              >
                <Button className="default-big-button" onClick={buttonClick}>
                  {bottomButton.text}
                </Button>
              </View>
            )}
          </View>
        </>
      )}
    </>
  );
}

export default forwardRef(Drawer);
