import {Input, Text, View} from '@tarojs/components';
import React, {useEffect, useState} from 'react';
import {uploadFile, chooseImage} from '@/utils/apiInterface/index';
import Image from '../image';
import './index.less';
import {showToast} from '@/utils';

interface ImageItem {
  url: string;
  id: string;
}

interface Props {
  length?: number;
  disabled?: boolean;
  defaultList?: any[];
  imgStyle?: React.CSSProperties;
  addButton?: React.ReactElement;
  spaceNumber?: number;
  onChange?: (arg: ImageItem[] | string) => void;
  name?: string;
  value?: any;
  className?: string;
}

function UploadImage(props: Props) {
  const {
    disabled = false,
    length = 1,
    defaultList = [],
    imgStyle = {},
    addButton,
    spaceNumber = length,
    onChange = () => {},
    name,
    value: defaultValue = [],
    className = ''
  } = props;
  const [imageList, setImgList] = useState<any[]>(defaultList);

  useEffect(() => {
    Array.isArray(defaultValue) && defaultValue?.length > 0 && setImgList(defaultValue);
  }, [defaultValue]);

  const choose = count => {
    chooseImage(count).then((res = []) => {
      if (!res?.length) return;
      setImgList([...imageList, ...(res || []).map(i => ({localUrl: i}))]);
    });
  };

  useEffect(() => {
    if (imageList.length > 0) {
      const ids = imageList.map(i => i.id).join(',');
      const ids2 = (defaultList || []).map(i => i.fileId).join(',');
      if (ids !== '' && ids === ids2) return;
      const uploadIng = imageList.find(i => i.loading);
      if (uploadIng) return;

      const uploadImage = imageList.find(i => !i.url);
      if (uploadImage) {
        uploadImage.loading = true;
        setImgList([...imageList]);

        uploadFile(uploadImage.localUrl)
          .then(({url, id}: any) => {
            Object.assign(uploadImage, {
              loading: false,
              url,
              id
            });
            setImgList([...imageList]);
            onChange(name ? JSON.stringify(imageList) : imageList);
          })
          .catch(e => {
            showToast(`图片上传失败。${e.errorMessage || e}`);
            setImgList(prev => prev.filter(i => i.localUrl !== uploadImage.localUrl));
          });
      } else {
        onChange(name ? JSON.stringify(imageList) : imageList);
      }
    } else {
      onChange(name ? '[]' : []);
    }
  }, [imageList]);

  return (
    <View className={`default-upload-image-box ${className}`}>
      <View hidden>
        <Input name={name} value={JSON.stringify(imageList)} />
      </View>
      {imageList.map((ite, index) => {
        return (
          <View
            className={`img-list-item ${ite.loading ? 'loading' : ''}`}
            style={{...imgStyle, marginLeft: index % spaceNumber === 0 ? '0' : '.35rem'}}
            key={index}
          >
            {ite.loading && <Text className="img-loading fs24 color9">上传中</Text>}
            {!ite.url && <Text className="img-loading">等待中</Text>}
            <Image
              className="img-item"
              src={ite.url || ite.localUrl}
              mode="aspectFit"
              preview
              urls={imageList.map(({url, localUrl}) => url || localUrl)}
              style={imgStyle}
            />
            {!disabled && (
              <View
                className="img-delete row iconfont-new colorF"
                onClick={() => {
                  setImgList(prev =>
                    prev.filter(i => i.id !== ite.id || i.localUrl !== ite.localUrl)
                  );
                }}
              >
               &#xe66a; 
               {/* &#xe685; */}
              </View>
            )}
          </View>
        );
      })}
      {!disabled &&
        imageList.length < length &&
        (React.isValidElement(addButton) ? (
          addButton
        ) : (
          <View
            className="img-list-item img-list-add iconfont colorC fs40 column center"
            onClick={() => choose(length - imageList.length)}
            style={{...imgStyle, marginLeft: imageList.length % spaceNumber === 0 ? '0' : '.35rem'}}
          >
            &#xe6e0;
          </View>
        ))}
    </View>
  );
}

export default UploadImage;
