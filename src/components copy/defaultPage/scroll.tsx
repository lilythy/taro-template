import React, {useEffect, useState} from 'react';
import {ScrollViewProps, View, ScrollView} from '@tarojs/components';
import {doFun, getPageHeight, Merge, utilsDefaultSpaceBottom} from '@/utils';
import Skeleton from '../skeleton';
import {useRouter, useThrottleFn} from 'taro-hooks';
import BottomTip, {BottomTipProps} from '@/components/bottomTip';

import NoData from '@/components/noData';
import Taro, {usePullDownRefresh, stopPullDownRefresh} from '@tarojs/taro';
import Page from './page';
import store from '@/store';
import {connect} from 'react-redux';
import {CHANGE_GLOBAL} from '@/store/global';

interface onScrollDetail {
  /** 横向滚动条位置 */
  scrollLeft: number;
  /** 竖向滚动条位置 */
  scrollTop: number;
  /** 滚动条高度 */
  scrollHeight: number;
  /** 滚动条宽度 */
  scrollWidth: number;
  deltaX: number;
  deltaY: number;
}

type Props = Merge<
  ScrollViewProps,
  {
    children: any;
    loading?: boolean;
    onScroll?: (arg: onScrollDetail) => void;
    backgroundColor?: string;
    className?: string;
    onPageEnd?: (arg?: any) => void;
    style?: React.CSSProperties;
    bottomTipConfig?: BottomTipProps;
    dataResult?: any;
    hideBottomTip?: boolean;
    hideTitleBar?: boolean;
    showLoading?: boolean;
    globalStore?: any;
    inTab?: boolean;
    onPullDownRefresh?: () => void;
    spaceBottom?: number;
  }
>;

const ScrollPage = (props: Props) => {
  const {
    children,
    loading = false,
    onScroll: onScrollFunction,
    backgroundColor = '#fff',
    className = '',
    onPageEnd = () => {},
    style = {},
    bottomTipConfig = {},
    dataResult,
    hideBottomTip = false,
    hideTitleBar = false,
    showLoading = false,
    globalStore = {},
    inTab,
    onPullDownRefresh,
    spaceBottom: defaultSpaceBottom = 100,
    ...others
  } = props;

  const [{path}] = useRouter();
  useEffect(() => {
    store.dispatch({
      type: CHANGE_GLOBAL,
      payload: {
        overflowY: 'auto',
      },
    });
  }, [path]);

  const {height} = getPageHeight(hideTitleBar);
  const [enter, setEnter] = useState(true);

  useEffect(() => {
    loading === false && setEnter(false);
  }, [loading]);

  useEffect(() => {
    if (!showLoading) return;
    if (loading) {
      Taro.showLoading({
        title: '加载中',
      });
    } else {
      Taro.hideLoading();
    }
    // eslint-disable-next-line
  }, [loading]);
  const spaceBottom = (!inTab ? utilsDefaultSpaceBottom : 0) + defaultSpaceBottom;

  const {run: pageEndFun} = useThrottleFn(
    () => {
      let sendData = {};
      if (dataResult) {
        const {pageNo, totalPage, pageSize} = dataResult;
        const nextPage = pageNo + 1;
        if (nextPage <= totalPage) {
          sendData = {pageNo: nextPage, pageSize};
          onPageEnd && onPageEnd(sendData);
        }
      }
    },
    {wait: 400, trailing: false}
  );

  const onScroll = e => {
    doFun(onScrollFunction, e.detail);
    const {
      detail: {scrollHeight, scrollTop},
    } = e;

    // 页面到底部了
    if (scrollHeight - scrollTop - height <= spaceBottom) {
      pageEndFun();
    }
  };

  const [scrollStyle, setScrollStyle] = useState({});
  const {overflowY, moveActive} = globalStore;

  useEffect(() => {
    if (overflowY) {
      setScrollStyle({overflowY: !moveActive || moveActive === 'Y' ? overflowY : 'hidden'});
    } else {
      setScrollStyle({});
    }
  }, [overflowY, moveActive]);

  usePullDownRefresh(() => {
    doFun(onPullDownRefresh);
    stopPullDownRefresh();
  });

  return (
    <Page>
      <ScrollView
        className="default-page column"
        style={{
          width: '100vw',
          height: '100vh',
          backgroundColor,
          boxSizing: 'border-box',
          ...scrollStyle,
        }}
        scrollY
        onScroll={onScroll}
        {...others}
      >
        <Skeleton loading={enter && loading} selector="default-page"></Skeleton>
        <View
          className="default-view flex1"
          style={{
            paddingBottom: utilsDefaultSpaceBottom,
            ...style,
          }}
        >
          <View className={`${className}`}>{!children ? <NoData /> : children}</View>
          {!hideBottomTip && bottomTipConfig && <BottomTip {...bottomTipConfig}></BottomTip>}
        </View>
        {/* <View style={{width: '100%', height: spaceBottom}}></View> */}
      </ScrollView>
    </Page>
  );
};

export default connect(({globalStore}: any) => ({
  globalStore,
}))(ScrollPage);
