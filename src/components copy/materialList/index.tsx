import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Image, ScrollView, View} from '@tarojs/components';
import {useSelector} from 'react-redux';
import {useDebounceFn} from 'taro-hooks';

import FolderIcon from '@/resource/icon-folder.png';
import EmptyFolder from '@/resource/empty-folder.png';
import AddIcon from '@/resource/add-icon.png';

import useRequest, {api} from '@/hooks/useRequest';
import useCurrentPit from '@/model/useCurrentPit';

import './index.less';
import Taro from '_@tarojs_taro@3.4.12@@tarojs/taro';

interface fileItem {
  coverUrl?: string;
  fileId?: string;
  fileName: string;
  fileSize?: {
    fileSize: 0;
    fileSizeMeasure: string;
  };
  isFolder: boolean;
  mediaType?: string;
}

const defaultRootList: fileItem[] = [
  {fileName: '门店素材', isFolder: true, fileId: ''},
  {fileName: '公共素材', isFolder: true, fileId: ''}
];

/**
 * @method 素材列表
 * @param height
 * @param {function} handleChooseFile 选择文件回调
 */
const MaterialList = ({height = '100vh', handleChooseFile}) => {
  // 部门id
  const {currentShop} = useSelector(({liveStore}) => ({...liveStore}));
  const department = currentShop?.id;

  // 素材模板
  const {pitItem} = useCurrentPit();

  // 素材根目录
  const [rootPrivateList, setRootPrivateList] = useState<fileItem[]>([]);
  const [rootPublicList, setRootPublicList] = useState<fileItem[]>([]);

  // 当前文件夹目录
  const [fileList, setFileList] = useState<fileItem[]>(defaultRootList);
  const [defaultList, setDefaultList] = useState<fileItem[]>(defaultRootList);
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [filePath, setFilePath] = useState<fileItem[]>([]);

  // 初始化根目录
  useEffect(() => {
    if (!department) return;
    const params = {
      department
    };
    api.material.getShopMaterials(params).then(res => {
      setRootPrivateList(res || []);
    });
    api.material.getPublicMaterials().then(res => {
      setRootPublicList(res || []);
    });
  }, [department]);

  /**
   * @method 获取文件列表
   */
  const listFileParams = useMemo(
    () => ({
      pageNo,
      pageSize: 24,
      parentId: filePath.length > 0 ? filePath[filePath.length - 1].fileId : '',
      searchPrefix: '',
      folderOrFileOrAll: 3,
      onlyCurrentDir: true
    }),
    [pageNo, filePath]
  );
  const {request: getFileList} = useRequest(
    () => {
      return api.material.listFile(listFileParams);
    },
    {
      manual: true,
      onSuccess: res => {
        const {rows} = res;
        if (res?.pageNo === 1) {
          setFileList(rows || []);
        } else {
          setFileList(prevState => [...prevState, ...rows]);
        }
        setTotalCount(res?.totalCount || 0);
      }
    }
  );

  useEffect(() => {
    if (filePath.length > 0) {
      getFileList();
    }
    // eslint-disable-next-line
  }, [filePath, pageNo]);

  // 匹配个人素材和公共素材对应类型的fileId
  useEffect(() => {
    if (
      pitItem &&
      pitItem.trackClipType &&
      rootPrivateList.length > 0 &&
      rootPublicList.length > 0
    ) {
      const curTypeText = pitItem.trackClipType === 'Image' ? '图片' : '视频';
      const privateFileId =
        rootPrivateList.find(item => item.fileName === curTypeText)?.fileId || '';
      const publicFileId = rootPublicList.find(item => item.fileName === curTypeText)?.fileId || '';

      const newRootList = [...defaultRootList];
      newRootList[0].fileId = privateFileId;
      newRootList[1].fileId = publicFileId;
      setFileList(newRootList);
      setDefaultList(newRootList);
      setFilePath([]);
      setPageNo(1);
    }
    // eslint-disable-next-line
  }, [pitItem.trackClipType, rootPrivateList, rootPublicList]);

  const onScrollToLower = useCallback(() => {
    if (fileList.length !== totalCount) {
      setPageNo(prevState => prevState + 1);
    }
  }, [totalCount, fileList]);

  const {run: handleScrollToLower} = useDebounceFn(
    () => {
      onScrollToLower();
    },
    {wait: 300}
  );
  /**
   * @method 返回上一步
   */
  const handleClickBack = useCallback(() => {
    if (filePath.length === 1) {
      setFileList(defaultList);
    } else {
      setFileList([]);
    }
    setPageNo(1);
    setTotalCount(0);
    setFilePath(prevState => prevState.slice(0, prevState.length - 1));
  }, [filePath, defaultList]);

  /**
   * @method 是否选中
   * @description 视频
   */
  const isSelect = useCallback(
    item => {
      return item.fileId === pitItem.fileId;
    },
    [pitItem.fileId]
  );

  return (
    <View className="c-ml">
      {filePath.length > 0 && (
        <View className="c-ml__back" onClick={handleClickBack}>
          返回上一级
        </View>
      )}
      <ScrollView
        scrollY
        className="c-ml__list"
        style={{height}}
        onScrollToLower={handleScrollToLower}
      >
        {fileList.length > 0 ? (
          fileList.map((item, index) => (
            <View className="c-ml__item" key={index}>
              {item.isFolder ? (
                <View
                  className="c-ml__folder"
                  onClick={() => {
                    setFileList([]);
                    setFilePath(prevState => [...prevState, item]);
                    setPageNo(1);
                  }}
                >
                  <Image
                    className="c-ml__folder-icon"
                    src={FolderIcon}
                    style={{width: '0.7rem', height: '0.7rem', marginBottom: '0.16rem'}}
                  />
                  <View className="c-ml__folder-name">{item.fileName}</View>
                </View>
              ) : (
                <View
                  className="c-ml__file"
                  onClick={() =>
                    handleChooseFile({...item, templateMaterialId: pitItem.templateMaterialId})
                  }
                >
                  <Image
                    src={item?.coverUrl || ''}
                    className="c-ml__file-img"
                    style={{height: Taro.ENV_TYPE.WEB === Taro.getEnv() ? 'auto' : '100%'}}
                  />
                  {isSelect(item) ? (
                    <View className="c-ml__file-mask"></View>
                  ) : (
                    <View className="c-ml__file-add">
                      <Image src={AddIcon} className="c-add-icon" />
                    </View>
                  )}
                </View>
              )}
            </View>
          ))
        ) : (
          <View className="c-ml__empty">
            <Image src={EmptyFolder} style={{width: '1.4rem', height: '1.4rem'}} />
            <View className="c-ml__empty-text">无相关内容</View>
          </View>
        )}
        {fileList.length > 0 && totalCount === fileList.length && (
          <View className="c-ml__more">没有更多了</View>
        )}
      </ScrollView>
    </View>
  );
};

export default React.memo(MaterialList);
