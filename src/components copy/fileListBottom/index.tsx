import React, {useCallback, useMemo} from 'react';
import Taro from '@tarojs/taro';
import {View} from '@tarojs/components';
import {api} from '@/hooks/useRequest';
import usePreviewFileInfo from '@/model/usePreviewFileInfo';

import {hideLoading, showLoading, showToast} from '@/utils';

import './index.less';

interface Props {
  isCommon?: boolean;
  isRecycle?: boolean;
  chooseFileList?: any[];
  resetChooseFileList?: () => any;
  rename?: () => any;
  moveFile?: () => any;
  deleteFile?: () => any;
  recovery?: () => any; // 恢复
}
const isWeb = Taro.ENV_TYPE.WEB === Taro.getEnv();
// 素材列表-底部操作栏
const FileListBottom = (props: Props) => {
  const {preViewInfo} = usePreviewFileInfo();
  const {
    isCommon = false, // 是否为公共素材 公共只可以下载
    isRecycle = false, // 是否为回收站
    chooseFileList = [],
    resetChooseFileList = () => {},
    rename = () => {},
    moveFile = () => {},
    deleteFile = () => {},
    recovery = () => {},
  } = props;

  const getVideoUrl = useCallback(file => {
    return new Promise<string>(resolve => {
      const params = {
        fileId: file?.fileId,
      };
      api.material.getFileMeta(params).then(res => {
        resolve(res?.accessUrl);
      });
    });
  }, []);

  // 下载
  const download = useCallback(() => {
    showLoading();
    let downloadFileList = chooseFileList;
    if (chooseFileList.length === 0) {
      downloadFileList = [preViewInfo];
    }
    const promiseList = downloadFileList.map(item => {
      return new Promise(async (resolve, reject) => {
        if (item.mediaType.includes('image')) {
          // @ts-ignore
          dd.saveImage({
            url: item.coverUrl,
            success: result => resolve(result),
            fail: err => reject(err),
          });
        }
        if (item.mediaType.includes('video')) {
          Taro.downloadFile({
            // 视频获取对应的url
            url: await getVideoUrl(item),
            success: res => {
              // @ts-ignore
              dd.saveVideoToPhotosAlbum({
                filePath: res.filePath,
                success: result => resolve(result),
                fail: err => reject(err),
              });
            },
            fail: err => reject(err),
          });
        }
      });
    });
    Promise.all(promiseList)
      .then(() => {
        hideLoading();
        showToast('下载成功');
        resetChooseFileList && resetChooseFileList();
      })
      .catch(err => {
        console.log(err);
        showToast('下载失败');
        hideLoading();
      });
  }, [chooseFileList, resetChooseFileList, preViewInfo]);

  // 选中的有多个不同类型时
  const someElseFileType = useMemo(() => {
    return [...new Set(chooseFileList.map(item => item.mediaType))].length > 1;
  }, [chooseFileList]);

  const actionList = useMemo(() => {
    if (isRecycle) {
      return [
        {name: '恢复', icon: 'icon-huifu', disabled: someElseFileType, action: recovery},
        {name: '删除', icon: 'icon-shanchu', disabled: false, action: deleteFile},
      ];
    }

    if (isCommon && !isWeb) {
      return [
        {
          name: '下载',
          icon: 'icon-xiazai',
          // disabled: chooseFileList.some(item => item.isFolder),
          disabled: chooseFileList.some(item => item.isFolder),
          message: '文件夹不可下载',
          action: download,
        },
      ];
    }
    const baseActions = [
      {
        name: '重命名',
        icon: 'icon-zhongmingming',
        disabled: chooseFileList.length > 1,
        message: '不可重命名多个文件或文件夹',
        action: rename,
      },
      {
        name: '移动',
        icon: 'icon-yidong',
        disabled: chooseFileList.some(item => item.isFolder),
        message: '文件夹不可移动',
        action: moveFile,
      },
      {name: '删除', icon: 'icon-shanchu', disabled: false, message: '', action: deleteFile},
    ]
    return isWeb ? [...baseActions] : [
      {
        name: '下载',
        icon: 'icon-xiazai',
        disabled: chooseFileList.some(item => item.isFolder),
        message: '文件夹不可下载',
        action: download,
      },
      ...baseActions
    ];
  }, [isRecycle, isCommon, download, rename, moveFile, deleteFile, chooseFileList, recovery]);
  return (
    <View className="c-fb">
      {actionList.map(item => (
        <View
          className="c-fb__item"
          key={item.icon}
          style={{opacity: isRecycle && item.disabled ? 0.3 : 1}}
          onClick={() => {
            if (item.disabled) {
              showToast(item.message);
              return;
            }
            item.action();
          }}
        >
          <View
            className={`iconfont ${item.icon}`}
            style={{color: '#333333', fontSize: Taro.pxTransform(36)}}
          />
          <View className="c-fb__item-text">{item.name}</View>
        </View>
      ))}
    </View>
  );
};

export default React.memo(FileListBottom);
