import React, {useEffect, useState} from 'react';
import {ScrollView} from '@tarojs/components';
import {useDebounceFn} from 'taro-hooks';
import {getGraphList} from '@/utils';

export default props => {
  const {children, bottomFn = () => {}, className, spaceBottom = 100} = props;
  const [listHeight, setListHeight] = useState(0);

  const {run: getHeight} = useDebounceFn(
    () => {
      getGraphList('.scroll-y-warp').then((res: [any]) => {
        const {height = 0} = res[0] || {};
        setListHeight(height);
      });
    },
    {wait: 300}
  );

  const {run: bottomDoFun} = useDebounceFn(
    () => {
      bottomFn();
    },
    {wait: 300}
  );

  useEffect(() => {
    getHeight();
  }, [children]);

  return (
    <ScrollView
      scrollY
      className={`scroll-y-warp ${className}`}
      onScroll={e => {
        const {
          detail: {scrollHeight, scrollTop}
        } = e;
        if (scrollHeight - scrollTop >= listHeight + spaceBottom) {
          return false;
        }
        bottomDoFun();
      }}
    >
      {children}
    </ScrollView>
  );
};
