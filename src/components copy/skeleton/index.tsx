import React, {useState} from 'react';
import {useReady} from '@tarojs/taro';
import {View} from '@tarojs/components';
import './index.less';
import {getGraphList} from '@/utils';

const Skeleton = props => {
  const {selector = 'skeleton', loading = true, inner} = props;
  const [radiusList, setRadiusList] = useState([]);
  const [rectList, setRectList] = useState([]);

  /**
   * 等待父页面渲染后获取生成骨架屏
   */
  //  Taro?.Current?.router?.onReady

  useReady(() => {
    initSkeleton();
  });

  /**
   * 初始化请求
   */
  const initSkeleton = () => {
    getGraphList(`.${selector} .skeleton-radius`).then((res: any) => {
      setRadiusList(res);
    });
    getGraphList(`.${selector} .skeleton-rect`).then((res: any) => {
      setRectList(res);
    });
  };
  const style = {
    backgroundColor: '#fff',
    width: '100vw',
    height: '100vh'
  };
  if (inner) {
    Object.assign(style, {
      backgroundColor: 'transparent',
      width: '0',
      height: '0'
    });
  }

  return (
    <View>
      {loading && (
        <View className="SkeletonCmpt" style={style}>
          {radiusList.map((radiusItem: any) => (
            <View
              className="skeleton skeleton-radius skeleton-animate-gradient"
              style={{
                width: `${radiusItem.width}px`,
                height: `${radiusItem.height}px`,
                top: `${radiusItem.top}px`,
                left: `${radiusItem.left}px`
              }}
            />
          ))}
          {rectList.map((rectItem: any) => (
            <View
              className="skeleton skeleton-rect skeleton-animate-gradient"
              style={{
                width: `${rectItem.width}px`,
                height: `${rectItem.height}px`,
                top: `${rectItem.top}px`,
                left: `${rectItem.left}px`
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
};
export default Skeleton;
