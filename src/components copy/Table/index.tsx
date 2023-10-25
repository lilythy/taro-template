import React, {useEffect, useState} from 'react';
import {View, Image, Text} from '@tarojs/components';
import addImg from '@/resource/live/shop/add-img.png';
import Taro from '@tarojs/taro';
import {showToast} from '@/utils';
import {batchUpload} from '@/utils/apiInterface/index';
import {sceneTypes, cameraRotates, sceneMethods} from '@/enum';
import './index.less';

const Index = props => {
  const {list = [], handleUpload, previewVideo, url} = props;
  const [scriptList, setScriptList] = useState<any>([]);

  useEffect(() => {
    setScriptList(list);
  }, [list]);

  /**
   *
   * @param item
   */
  const upload = item => {
    Taro.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 1,
      success: res => {
        Taro.showLoading({
          title: '上传中...',
          mask: true
        });
        batchUpload([res?.tempFilePath], 'video')
          .then(result => {
            Taro.hideLoading();
            const newScriptList = scriptList.map(el => {
              el?.videoPartItemList.forEach(part => {
                if (part?.id === item?.id) {
                  part.poster = result[0]?.coverUrl;
                  part.videoUrl = result[0]?.url;
                  part.fileId = result[0]?.id;
                }
              });
              return el;
            });
            handleUpload([...newScriptList]);
            setScriptList([...newScriptList]);
          })
          .catch(() => {
            Taro.hideLoading();
          });
      },
      fail: err => {
        console.log(err);
        showToast('上传失败。');
      }
    });
  };

  /**
   * 表格行
   * @returns
   */
  const renderRows = () => {
    return scriptList?.map((item, index) => {
      return (
        <View className="tableRow" key={index}>
          <View className="tableTr">{item?.name}</View>
          <View className="tableTr">
            {item?.videoPartItemList.map(subItem => (
              <View className="subtr" key={subItem?.id}>
                <Image
                  src={subItem.poster || addImg}
                  className="uploadIcon"
                  onClick={() => {
                    if (subItem.poster) {
                      previewVideo(subItem);
                    } else {
                      upload(subItem);
                    }
                  }}
                />
                <View className="videoExtral">
                  <View>景别：{sceneTypes[subItem?.sceneryType]?.label}</View>
                  <View>拍摄手法：{sceneMethods[subItem?.shootType]?.label}</View>
                  <View>拍摄角度：{cameraRotates[subItem?.positionType]?.label}</View>
                </View>
                <View className="videoScipt">
                  <View
                    className="videoLable"
                    onClick={() => {
                      previewVideo({
                        url,
                        ...subItem
                      });
                    }}
                  >
                    原视频 <Text className="triangle" />
                  </View>
                  <View className="videoDuration">
                    {/* {formatTime(item?.videoPartItemList[0]?.duration)} */}
                    {`${subItem?.duration.toFixed(2)}秒` || '--'}
                  </View>
                </View>
              </View>
            ))}
          </View>
          <View className="tableTr">{item?.comment}</View>
        </View>
      );
    });
  };

  return (
    <View className="customeTable">
      <View className="tableHeader">
        <View className="tableTd">大纲</View>
        <View className="tableTd">分镜</View>
        <View className="tableTd">台词</View>
      </View>
      <View className="tableBody">{renderRows()}</View>
    </View>
  );
};

export default Index;
