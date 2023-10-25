import React from 'react';
import {Image, Swiper, SwiperItem, View} from '@tarojs/components';
import Link from '@/components/link';
import './index.less';
import {boxMargin} from '@/utils';

const Banner = props => {
  const {bannerList = [], height = 200} = props;
  if (!bannerList.length) {
    return null;
  }
  return (
    <View className="banner-wrap skeleton-rect pt16" style={{height}}>
      <Swiper
        className="banner-swiper"
        indicatorColor="#999"
        indicatorActiveColor="#333"
        circular
        indicatorDots
        autoplay
      >
        {bannerList.map((item, i) => {
          return (
            <SwiperItem key={i} style={{height}}>
              <View style={{...boxMargin, marginTop: 0}}>
                <Link to={item.actionUrl}>
                  <Image
                    className="img"
                    src={item.imageUrl}
                    style={{height: height, borderRadius: '8px'}}
                  />
                </Link>
              </View>
            </SwiperItem>
          );
        })}
      </Swiper>
    </View>
  );
};

export default Banner;
