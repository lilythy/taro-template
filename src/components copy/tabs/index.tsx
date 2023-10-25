import React, {useState,useEffect} from 'react';
import {getGraphList} from '@/utils';
import {useDebounceFn} from 'taro-hooks';
import {Text, View} from '@tarojs/components';
import './index.less';

/**
 * Tabs
 * @param props
 * @props tabs
 * @props defaultTab
 * @props onChange
 * @props autoHeight
 * @returns Element
 */
const App = props => {
  const {
    tabs = [],
    defaultTab = 0,
    onChange,
    children = [],
    autoHeight = false,
    lineWidth,
    className = '',
    style = {}
  } = props;
  const [active, setActive] = useState(defaultTab);
  const [height, setHeight] = useState<'auto' | number>('auto');

  useEffect(() => {
    autoHeight && getHeight(active);
    typeof onChange === 'function' && onChange(active);
  }, [active]);

  useEffect(() => {
    defaultTab !== active && setActive(defaultTab);
  }, [defaultTab]);

  const getHeight = (index = 0) => {
    getGraphList('.tabs-wrap .swiper-item > *').then((res: any) => {
      res && res[index]?.height && setHeight(res[index]?.height || 'auto');
    });
  };

  const {run: getHeightDebounce} = useDebounceFn(
    () => {
      getHeight(defaultTab);
    },
    {wait: 300}
  );

  useEffect(() => {
    getHeightDebounce();
  }, [children]);
  return (
    <View className={`tabs-wrap ${className}`} style={style}>
      <View className='tabs-control-box pb4'>
        {tabs.map((i, index) => (
          <Text
            className={`tabs-item fs28 ${active === index ? 'active weight6' : 'weight4'}`}
            onClick={() => setActive(index)}
          >
            {i}
          </Text>
        ))}
        <View
          className='tabs-space-box'
          style={{
            bottom: 0,
            width: (1 / tabs.length) * 100 + '%',
            left: active * (1 / tabs.length) * 100 + '%'
          }}
        >
          <View className='tabs-space' style={{width: lineWidth ?? '30%'}}></View>
        </View>
      </View>
      <View
        className='flex1 column'
        style={{
          width: '100%',
          overflow: 'hidden',
          height,
          transition: 'all .2s'
        }}
      >
        {children.map((i, index) => (
          <View hidden={index !== active} className='flex1 column' style={{overflow: 'hidden'}}>
            {i}
          </View>
        ))}
        {/* {!enter && children[active]} */}
        {/* <Swiper
          current={active}
          onChange={e => {
            const index = e.detail.current;
            setActive(index);
          }}
        >
          {(children || []).slice(0, tabs.length).map((i, index) => (
            <SwiperItem key={index} style={{width: '100%'}} className="swiper-item">
              {i}
            </SwiperItem>
          ))}
        </Swiper> */}
      </View>
    </View>
  );
};

export default App;
