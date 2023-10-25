import {View, Image, Text, Button} from '@tarojs/components';
import usePopupModal from '@/model/usePopupModal';
import useSelectedMaterial from '@/model/useSelectedFilesInfo';
import {configList} from '@/constants/index';
import React from 'react';
import Taro from '@tarojs/taro';
import useMaterialRootList from '@/model/useMaterialRootList';
import {hideLoading, showLoading, showToast} from '@/utils';
// @ts-ignore
import {batchUpload} from '@/utils/apiInterface/index';
import './index.less';

type ModalProps = {
  visibility: boolean;
  type: string;
  style?: any;
  addFolder?: Function;
  uploadCallback?: Function;
};
const PopupModal = (props: ModalProps) => {
  const {toggleVisible} = usePopupModal();
  const {changeSelectedFileList} = useSelectedMaterial();
  const {materialRootList} = useMaterialRootList();
  const {
    visibility,
    type,
    style = {},
    addFolder = () => {
      console.log('新建文件夹');
    },
    uploadCallback
  } = props;
  const handleUploadFile = (fileList, type, cb) => {
    showLoading();
    batchUpload(fileList, type === 'img' ? 'image' : 'video', true)
      .then(res => {
        changeSelectedFileList(res);
        hideLoading();
        cb && cb(res);
      })
      .catch(err => {
        console.log(err);
        showToast('上传失败。');
        hideLoading();
      });
  };
  const typeList = configList[type]; // 当前展示操作列表
  const handleClick = item => {
    let fileId;
    // 拍照
    if (item.type.toLowerCase() === 'photograph') {
      fileId = materialRootList.find(item => item.fileName === '图片')?.fileId;
      Taro.chooseImage({
        sourceType: ['camera'],
        success: res => {
          handleUploadFile(res?.tempFiles || res?.tempFilePaths, 'img', list => {
            uploadCallback && uploadCallback(list, type, fileId);
          });
        }
      });  
    }
    // 相册
    if (item.type.toLowerCase() === 'album') {
      console.log(1);
      fileId = materialRootList.find(item => item.fileName === '图片')?.fileId;
      Taro.chooseImage({
        count: 9,
        sourceType: ['album'],
        success: res => {
          handleUploadFile(res?.tempFiles || res?.tempFilePaths, 'img', list => {
            uploadCallback && uploadCallback(list, type, fileId);
          });
        }
      });
      return;
    }
    if (item.type.toLowerCase() === 'record') {
      fileId = materialRootList.find(item => item.fileName === '视频')?.fileId;
      Taro.chooseVideo({
        sourceType: ['album'],
        maxDuration: 60,
        success: res => {
          // res?.filePath
          handleUploadFile([res?.tempFilePath], 'video', list => {
            uploadCallback && uploadCallback(list, type, fileId);
          });
        },
        fail: err => {
          console.log(err);
          showToast('上传失败。');
        }
      });
      return;
    } else {
      if (item.type === 'MAKEDIR') {
        addFolder && addFolder();
      }
    }
  };
  const cancelVisible = () => {
    toggleVisible();
  };
  const renderBodyItems = () => {
    return (
      <>
        {typeList.map(item => {
          return (
            <View className="body-item">
              <Image
                src={item.url}
                className="item-icon"
                onClick={() => {
                  handleClick(item);
                }}
              ></Image>
              <Text className="item-text">{item.text}</Text>
            </View>
          );
        })}
      </>
    );
  };
  return (
    <View
      className="container"
      onClick={e => {
        cancelVisible();
        e.preventDefault();
      }}
      style={{
        display: visibility ? 'block' : 'none'
      }}
    >
      <View className="popup" style={style}>
        <View className="popup-header">
          <Text className="header-title">上传</Text>
        </View>
        <View className="popup-body">{renderBodyItems()}</View>
        <View className="popup-footer">
          <Button className="footer-btn" onClick={cancelVisible}>
            取消
          </Button>
        </View>
      </View>
      {/* <View className="mask">222</View> */}
    </View>
  );
};
export default React.memo(PopupModal);
