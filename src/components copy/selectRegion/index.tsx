import {PickerView, PickerViewColumn, View} from '@tarojs/components';
import React, {cloneElement, useEffect, useRef, useState} from 'react';
import Drawer from '@/components/drawer';

import './index.less';

interface Props {
  title?: string;
  button?: any;
  data: any[];
  isOwnAll: boolean;
  onCallback: (res?: any) => void;
}

export default (props: Props) => {
  const {title = '请选择', data = [], onCallback = () => {}, button, isOwnAll} = props;
  const [selectText, setSelectText] = useState('');
  const [selectList, setSelectList] = useState<any[]>([]);
  const [value, setValue] = useState([0]);
  const [first, setFirst] = useState<any[]>([]);
  const [second, setSecond] = useState<any[]>([]);
  const [third, setThird] = useState<any[]>([]);
  const drawerRef = useRef<any>();

  useEffect(() => {
    dataHandel();
  }, [data]);

  const dataHandel = () => {
    setFirst(data);
    const tempSecond = data?.[0]?.children;
    setSecond(tempSecond ?? []);
    setThird(tempSecond?.[0]?.children ?? []);
  };

  const onChange = e => {
    const val = e.detail.value;
    const tempSecond = first?.[val[0] - 1]?.children;
    const tempThird = tempSecond?.[val[1] === -1 ? 0 : val[1] - 1]?.children;
    setSecond(tempSecond ?? []);
    setThird(tempThird ?? []);
    setValue(val);

    const firstItem = first?.[val[0] - 1];
    const secondItem = tempSecond?.[val[1] === -1 ? 0 : val[1] - 1];
    const thirdItem = tempThird?.[val[2] === -1 ? 0 : val[2] - 1];

    let text = '';
    if (firstItem?.nodeName) {
      text = firstItem?.nodeName;
    }
    if (secondItem?.nodeName) {
      text += '-' + secondItem?.nodeName;
    }
    if (thirdItem?.nodeName) {
      text += '-' + thirdItem?.nodeName;
    }
    setSelectText(text);
    setSelectList([firstItem, secondItem, thirdItem]);
  };

  const onConfirm = () => {
    onCallback(selectList);
  };

  return (
    <Drawer
      ref={drawerRef}
      button={cloneElement(button, {
        onClick: () => {
          drawerRef.current?.show && drawerRef.current?.show();
        }
      })}
      bottomButton={{text: '确定', onClick: onConfirm}}
      header={title}
      canMove={false}
    >
      <View className="region-wrap">
        <View className="region-selected">{selectText}</View>
        <PickerView
          value={value}
          onChange={onChange}
          indicatorClass="region-picker-selected"
          indicatorStyle="height: 50px;"
          style="width: 100%; height: 300px;"
        >
          <PickerViewColumn>
            {isOwnAll && <View className="region-item">全部</View>}
            {first.map(item => {
              return (
                <View className="region-item" key={item?.id}>
                  {item?.nodeName}
                </View>
              );
            })}
          </PickerViewColumn>
          <PickerViewColumn>
            {second?.length > 0 && selectList.length > 0 && selectList[0]?.isOwnAll ? (
              <View className="region-item">全部</View>
            ) : (
              <View className="region-item">&nbsp;</View>
            )}
            {second?.length > 0 &&
              second.map(item => {
                return (
                  <View className="region-item" key={item?.id}>
                    {item?.nodeName}
                  </View>
                );
              })}
          </PickerViewColumn>

          <PickerViewColumn>
            {third?.length > 0 && selectList.length > 0 && selectList[1]?.isOwnAll ? (
              <View className="region-item">全部</View>
            ) : (
              <View className="region-item">&nbsp;</View>
            )}
            {third?.length > 0 &&
              third.map(item => {
                return (
                  <View className="region-item" key={item?.id}>
                    {item?.nodeName}
                  </View>
                );
              })}
          </PickerViewColumn>
        </PickerView>
      </View>
    </Drawer>
  );
};
