import React, {CSSProperties} from 'react';
import {Image, View, Radio, Text} from '@tarojs/components';

import FolderIcon from '@/resource/icon-folder.png';

import './index.less';

interface Props {
  coverUrl?: string | undefined;
  fileName: string;
  filePath: string;
  fileSize?: object;
  isFolder: boolean;
  updateDate: string;
  mediaType: string;
  style?: CSSProperties;
  showRadio: boolean;
  check: boolean;
  size;
  onClick: () => any;
  onSelect: (isSelect: boolean) => any;
}

/**
 * @method 素材管理 单个文件/文件夹
 */
const MaterialItem = (props: Props) => {
  const {
    coverUrl,
    fileName,
    isFolder,
    updateDate,
    mediaType,
    style,
    showRadio,
    check,
    onClick,
    onSelect
  } = props;
  return (
    <View className={`c-mi ${check ? 'c-mi-active' : ''}`} onClick={onClick} style={style}>
      <View className="row">
        <View className="c-mi__icon">
          {/*{(mediaType === 'video' || mediaType === 'img') && (*/}
          <Image className="c-mi__icon-img" src={isFolder ? FolderIcon : coverUrl} />
          {mediaType?.includes('video') && <View className="iconfont">&#xe670;</View>}
          {/*)}*/}
        </View>
        <View className="c-mi__msg">
          <View className="c-mi__msg-name">{fileName}</View>
          {updateDate && <View className="c-mi__msg-date">{updateDate}</View>}
        </View>
      </View>
      {showRadio && (
        <View
          className="c-mi__action"
          onClick={e => {
            e.stopPropagation();
            onSelect(!check);
          }}
        >
          <Radio
            color="#2C58C6"
            style={{
              transform: `scale(0.8) translateX(0)`
            }}
            checked={check}
          />
        </View>
      )}
    </View>
  );
};

export default React.memo(MaterialItem);
