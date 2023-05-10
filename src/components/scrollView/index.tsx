import React, { useEffect, useState } from "react";
import { getGraphList } from "../../utils";
/** @ts-ignore */
import {
  ScrollView,
  ScrollViewProps,
  BaseEventOrigFunction,
} from "@tarojs/components";
import { useThrottleFn } from "taro-hooks";

interface Props extends ScrollViewProps {
  children: React.ReactElement;
  onScroll?: BaseEventOrigFunction<ScrollViewProps.onScrollDetail>;
  className?: string;
  onScrollEnd?: Function;
  style?: React.CSSProperties;
  dataResult?: any;
  spaceBottom?: number;
}
const DefaultScrollView = (props: Props) => {
  const {
    children,
    onScroll: defaultOnScroll = () => {},
    className = "",
    onScrollEnd = () => {},
    style = {},
    dataResult,
    spaceBottom = 30,
    ...others
  } = props;

  const [randomId] = useState(Math.random().toString().slice(2));

  const [height, setHeight] = useState(0);
  useEffect(() => {
    async function getViewHeight() {
      const scrollViewHeight: any = await getGraphList(
        `.default-scroll-view-${randomId}`
      );
      if (scrollViewHeight && scrollViewHeight[0]?.height) {
        setHeight(scrollViewHeight[0]?.height);
      }
    }
    setTimeout(() => {
      getViewHeight();
    }, 500);
  }, []);

  const { run: pageEndFun } = useThrottleFn(
    () => {
      let sendData = {};
      if (dataResult) {
        const { pageNo, totalPage, pageSize } = dataResult;
        const nextPage = pageNo + 1;
        if (nextPage <= totalPage) {
          sendData = { pageNo: nextPage, pageSize };
          onScrollEnd && onScrollEnd(sendData);
        }
      }
    },
    { wait: 400, trailing: false }
  );

  const getViewHeight = async () => {
    const scrollViewHeight: any = await getGraphList(
      `.default-scroll-view-${randomId}`
    );
    if (scrollViewHeight && scrollViewHeight[0]?.height) {
      setHeight(scrollViewHeight[0]?.height);
    }
  };

  const onScroll = (e) => {
    defaultOnScroll(e);
    height === 0 && getViewHeight();

    const {
      detail: { scrollHeight, scrollTop },
    } = e;

    // 页面到底部了
    if (scrollHeight - scrollTop - height <= spaceBottom) {
      pageEndFun();
    }
  };

  return (
    <ScrollView
      style={{
        ...style,
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

export default DefaultScrollView;
