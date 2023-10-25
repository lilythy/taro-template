import React, {useEffect, useState} from 'react';
import {getGraphList, isFun} from '../../utils';
import {BaseEventOrigFunction, ScrollView, ScrollViewProps} from '@tarojs/components';
import {useRouter, useThrottleFn} from 'taro-hooks';
import store from '@/store';
import {connect} from 'react-redux';
import {CHANGE_GLOBAL} from '@/store/global';

interface Props extends ScrollViewProps {
  children: React.ReactNode;
  onScroll?: BaseEventOrigFunction<ScrollViewProps.onScrollDetail>;
  className?: string;
  onScrollEnd?: Function;
  style?: React.CSSProperties;
  dataResult?: any;
  spaceBottom?: number;
  hideTitleBar?: boolean;
  globalStore?: {overflowY: 'hidden' | 'auto'};
}

const DefaultScrollView = (props: Props) => {
  const {
    children,
    onScroll: defaultOnScroll = () => {},
    className = '',
    onScrollEnd = () => {},
    style = {},
    dataResult,
    hideTitleBar = false,
    globalStore = {overflowY: 'auto'},
    spaceBottom = 30,
    ...others
  } = props;

  const [randomId] = useState(
    Math.random()
      .toString()
      .slice(2)
  );
  const [{path}] = useRouter();
  useEffect(() => {
    store.dispatch({
      type: CHANGE_GLOBAL,
      payload: {
        overflowY: 'auto'
      }
    });
  }, [path]);

  const [height, setHeight] = useState(0);
  useEffect(() => {
    async function getViewHeight() {
      const scrollViewHeight: any = await getGraphList(`.default-scroll-view-${randomId}`);
      if (scrollViewHeight && scrollViewHeight[0]?.height) {
        setHeight(scrollViewHeight[0]?.height);
      }
    }
    setTimeout(() => {
      getViewHeight();
    }, 500);
  }, []);

  const {run: pageEndFun} = useThrottleFn(
    () => {
      let sendData = {};
      if (dataResult) {
        const {pageNo, totalPage, pageSize} = dataResult;
        const nextPage = pageNo + 1;
        if (nextPage <= totalPage) {
          sendData = {pageNo: nextPage, pageSize};
          onScrollEnd && onScrollEnd(sendData);
        }
      }
    },
    {wait: 400, trailing: false}
  );

  const getViewHeight = async () => {
    const scrollViewHeight: any = await getGraphList(`.default-scroll-view-${randomId}`);
    if (scrollViewHeight && scrollViewHeight[0]?.height) {
      setHeight(scrollViewHeight[0]?.height);
    }
  };

  const onScroll = e => {
    isFun(defaultOnScroll) && defaultOnScroll(e);
    height === 0 && getViewHeight();

    const {
      detail: {scrollHeight, scrollTop}
    } = e;

    // 页面到底部了
    if (scrollHeight - scrollTop - height <= spaceBottom) {
      pageEndFun();
    }
  };

  const [scrollStyle, setScrollStyle] = useState({});
  const {overflowY} = globalStore;

  useEffect(() => {
    if (overflowY) {
      setScrollStyle({overflowY: overflowY});
    } else {
      setScrollStyle({});
    }
  }, [overflowY]);

  return (
    <ScrollView
      style={{
        ...style,
        ...scrollStyle
      }}
      className={`default-scroll-view ${className} default-scroll-view-${randomId}`}
      {...others}
      scrollY
      onScroll={onScroll}
    >
      {children}
    </ScrollView>
  );
};

export default connect(({globalStore}: any) => ({
  globalStore
}))(DefaultScrollView);
