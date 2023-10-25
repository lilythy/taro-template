import React, {useEffect} from 'react';
import {View} from '@tarojs/components';
import {utilsDefaultSpaceBottom} from '../../utils';
import Skeleton from '../skeleton';
import Taro from '@tarojs/taro';
import Page from './page';

const DefaultPage = props => {
  const {children, className = '', loading = false, showLoading = false, inTab} = props;
  useEffect(() => {
    if (!showLoading) return;
    if (loading === true) {
      Taro.showLoading({
        title: '加载中'
      });
    } else {
      Taro.hideLoading();
    }
  }, [loading]);

  return (
    <Page>
      <View
        className={`default-page column flex1 ${className}`}
        style={{width: '100%', paddingBottom: !inTab ? utilsDefaultSpaceBottom : 0}}
      >
        <Skeleton loading={loading} selector="default-page"></Skeleton>
        {children}
      </View>
    </Page>
  );
};

export default DefaultPage;
