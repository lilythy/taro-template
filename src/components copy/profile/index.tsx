import React from 'react';
import {Text, Image, View} from '@tarojs/components';
import {user_icon} from '@/enum';
import {openLink} from '@/utils/apiInterface';
// @ts-ignore
import {corpId, env} from '@tarojs/taro';
import {devMiniAppIds} from '@/constants';
import {appId} from '@/utils/apiInterface/index';
import './index.less';

const App = props => {
  const {
    data = {},
    className = 'backgroundF',
    shopInfo = null,
    currentRole = null,
    hasZhuboCertificate = false
  } = props;
  const {name, portraitImageUrl, organizationName} = data;
  const openCertificate = async () => {
    //  判断当前应用环境
    const czbAppId = devMiniAppIds.includes(+appId) ? '114697' : '117004';
    const url = `dingtalk://dingtalkclient/action/open_micro_app?appId=${czbAppId}&corpId=${corpId}&page=pages/certification/index`;
    openLink(url);
  };
  return (
    <View className={`profile-wrap ${className} p32 pb48`}>
      <Image className="profile-logo" src={portraitImageUrl || user_icon} />
      <View>
        <View className="medium fs40 color3 weight5 lh56">{name}</View>
        <View className="info-box">
          <View>
            <View className="profile-company regular mt16 lh32 fs24 weight4 pl8 pr8">
              <Text className="company-name">{organizationName}</Text>
              <Text className="profile-shop">{shopInfo ? shopInfo?.name : '--'}</Text>
            </View>
          </View>
          {currentRole?.roleCode === 'zhubo' ? (
            <>
              {hasZhuboCertificate ? (
                <Text className="zhubo-vertify">认证主播</Text>
              ) : (
                <Text className="zhubo-unvertify" onClick={openCertificate}>
                  去考取主播证
                </Text>
              )}
            </>
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default App;
