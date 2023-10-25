import {View, Image, Text} from '@tarojs/components';
import Taro from '@tarojs/taro';
import React, {useEffect, useState} from 'react';
import './index.less';
import api from '@/apis';
import {showToast} from '@/utils';

const BindDoudianModal = props => {
  const {visible, shopId, close} = props;
  const [preBindInfo, setPreBindInfo] = useState<{
    preBindUrlQrCode: string;
    preBindId: string;
    preBindUrl: string;
  } | null>(null);
  let timer;

  useEffect(() => {
    if (shopId && visible) {
      handleDouyinAuth();
    }
  }, [shopId, visible]);

  useEffect(() => {
    if (preBindInfo?.preBindId) {
      checkQrcodeStatus();
      timer = setInterval(() => {
        checkQrcodeStatus();
      }, 2000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [preBindInfo?.preBindId]);

  /**
   * 检测二维码状态
   */
  const checkQrcodeStatus = async () => {
    const res = await api.Live.getQrcodeStatus({
      preBindId: preBindInfo?.preBindId
    });
    if (res) {
      const {status} = res;
      if (status === 'scanned') {
        console.log('扫码成功');
      } else if (status === 'confirmed') {
        Taro.showToast({
          title: '授权成功',
          icon: 'success'
        });
        setPreBindInfo(null);
        close?.();
      }
    } else {
      // 出错处理
      setPreBindInfo(null);
      timer && clearInterval(timer);
    }
  };

  /**
   * 抖音账号授权
   */
  const handleDouyinAuth = async () => {
    Taro.showLoading({
      title: '加载中...',
      mask: true
    });
    const res = await api.Live.bindViaQrcode({
      shopId
    });
    Taro.hideLoading();
    if (res) {
      if (!res?.preBindUrlQrCode) {
        showToast('获取授权抖店二维码失败！');
      }
      setPreBindInfo({
        ...res
      });
    }
  };

  const handleClose = () => {
    setPreBindInfo(null);
    close?.();
  };

  return visible && preBindInfo?.preBindUrlQrCode ? (
    <View className="modal-qrcode" onClick={handleClose}>
      <View className="modal-body">
        <View className="title">抖音账号授权</View>
        <View className="tip">
          <View>截图或保存图片，打开抖音「搜索」-「扫一扫</View>
          <View>点击相册，选择二维码</View>
        </View>
        <Image
          className="code-img"
          src={`data:image/png;base64,${preBindInfo?.preBindUrlQrCode}`}
        />
        {Taro.getEnv() == 'WEB' ? null : (
          <View
            className="save-img"
            onClick={e => {
              Taro.downloadFile({
                url: preBindInfo?.preBindUrl,
                success: res => {
                  // @ts-ignore
                  console.log(res?.filePath);
                  Taro.saveImageToPhotosAlbum({
                    filePath: res.filePath,
                    success: () => {
                      Taro.showToast({
                        title: '保存成功'
                      });
                    },
                    fail: err => {
                      console.log(err, '保存失败');
                      Taro.showToast({
                        title: '保存失败',
                        icon: 'error'
                      });
                    }
                  });
                },
                fail: err => {
                  console.log(err, '下载失败');
                  Taro.showToast({
                    title: '保存失败',
                    icon: 'error'
                  });
                }
              });
              e.stopPropagation();
            }}
          >
            保存相册
          </View>
        )}
      </View>
    </View>
  ) : null;
};

export default BindDoudianModal;
