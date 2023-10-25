import {View, Image, Button, Text} from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.less';
import useHandlePit from '@/model/useHandlePit';
import React, {useEffect, useState} from 'react';
import useTextModal from '@/model/useTextModal';
import useCurrentPit from '@/model/useCurrentPit';
import DeleteIcon from '@/resource/live/delete.png';
// https://c-ssl.dtstatic.com/uploads/item/202007/13/20200713090627_dlwtl.thumb.400_0.webp_webp
const MEDIA_TYPES = {
  image: '图片',
  video: '视频'
};
const TplList = props => {
  const {handleClear, saveCurrentItem, handleToNext} = props;
  const {pitList} = useHandlePit();
  const [clickIndex, setClickIndex] = useState(0);
  const [overflow, setOverFlow] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const {toggleVisible} = useTextModal();
  const {changePitItem} = useCurrentPit();
  useEffect(() => {
    saveCurrentItem(pitList[0]);
  }, []);
  useEffect(() => {
    getIsOverflow();
  }, [clickIndex]);
  const handleItemClick = (item, index) => {
    // 添加素材
    // handleAdd(item);
    // 命中当前素材坑位
    setClickIndex(index);
    // 保存当前点中item;
    saveCurrentItem(item);
    changePitItem(item);
  };
  const getIsDisabled = () => {
    return pitList.filter(item => item.src == '')?.length > 0;
  };
  const getIsOverflow = () => {
    setTimeout(() => {
      const pointValue = (0.8814339661683307).toFixed(2) || 624 / 702; // 标砖比例  0.8814339661683307
      const markQuery = Taro.createSelectorQuery();
      const pitQuery = Taro.createSelectorQuery();
      markQuery.select('.remark').boundingClientRect();
      pitQuery.select('.pit-remark').boundingClientRect();
      markQuery.exec(res => {
        res[0] &&
          pitQuery.exec(res1 => {
            if (res1 && res1[0]) {
              // @ts-ignore
              setOverFlow((res1[0].width / res[0].width).toFixed(2) - pointValue >= 0);
            }
          });
      });
    }, 400);
  };
  const renderItems = () => {
    return (
      <>
        {pitList?.length
          ? pitList.map((item, index) => {
              return (
                // ${getLength() === index && 'active-item'}
                <View
                  className={`selected-item ${clickIndex === index ? 'active-item' : ''}`}
                  key={index}
                >
                  {item?.src ? (
                    <>
                      <View
                        className="img-delete"
                        onClick={() => {
                          handleClear(item);
                          changePitItem({...item, src: '', fileId: '', contentFileId: ''});
                        }}
                      >
                        {/* <Icon size="20" type="clear" color="#fff" /> */}
                        <Image src={DeleteIcon} className="delete-icon" />
                      </View>

                      <Image
                        className="selected-img"
                        src={
                          item.src ||
                          'https://c-ssl.dtstatic.com/uploads/item/202007/13/20200713090627_dlwtl.thumb.400_0.webp_webp'
                        }
                        onClick={() => {
                          setClickIndex(index);
                          changePitItem({...item, src: '', fileId: '', contentFileId: ''});
                          //   handleClear(item);
                        }}
                      ></Image>
                    </>
                  ) : (
                    <View
                      className="pit-origin"
                      onClick={() => {
                        handleItemClick(item, index);
                      }}
                    >
                      <Text className="pit-duration">{item.duration.toFixed(1)}秒</Text>
                      <Text className="pit-desc">
                        {MEDIA_TYPES[item.trackClipType.toLowerCase()]}
                      </Text>
                      <Text className="pit-index">{index + 1}</Text>
                    </View>
                  )}
                </View>
              );
            })
          : null}
      </>
    );
  };

  const doNext = () => {
    setDisabled(true);
    setTimeout(() => setDisabled(false), 2000);
    handleToNext();
  };
  return (
    <View className="tpl-info">
      <View className="tpl-selected">
        <View className="selected-list">{renderItems()}</View>
        <Button
          className={`next-step ${getIsDisabled() ? 'next-disabled' : ''}`}
          disabled={getIsDisabled() || disabled}
          onClick={disabled ? () => {} : doNext}
        >
          下一步
        </Button>
      </View>
      <View className="remark">
        <Text className="pit-remark" onClick={e => console.log(e)}>
          {pitList[clickIndex]?.templateRemark}
        </Text>
        {overflow && (
          <Text
            className="toggle-text"
            onClick={() => {
              toggleVisible();
            }}
          >
            展开
          </Text>
        )}
      </View>
    </View>
  );
};
export default TplList;
