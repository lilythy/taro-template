import {doFun, findCurrentItemList, showToast} from '@/utils';
import {Input, Text, View} from '@tarojs/components';
import Taro from '@tarojs/taro';
import React, {useEffect, useRef, useState} from 'react';
import {useVibrate} from 'taro-hooks';
import Drawer from '../drawer';
import SameCascader from './SameCascader';

const defaultListItem = {
  label: '请选择',
  value: '0'
};

interface ListItem {
  label: string;
  value: string;
  [name: string]: any;
}
interface Props {
  /** 选项列表 */
  options: ListItem[];
  /** 抽屉title */
  title?: string;
  /** 点击开启抽屉的按钮 */
  open?: React.ReactElement;
  /** 组件嵌入form表单时的参数，平时使用不需要传 */
  name?: string;
  /** 组件嵌入form表单时的参数，平时使用不需要传 */
  label?: string;
  /** 默认value，id */
  value?: string;
  /** 是否需要选择到最后一个，默认为false */
  chooseEnd?: boolean;
  /** onChange, 返回id列表 */
  onChange?: (ids: string[]) => void;
}
function Cascader(props: Props) {
  const [vibrateAction] = useVibrate();
  const {
    open,
    options = [],
    name,
    value: defaultValue,
    onChange,
    title = '',
    label = '',
    chooseEnd = false
  } = props;
  const [list, setList] = useState<{label: string; value: string}[]>([defaultListItem]);
  const [renderOptions, setRenderOptions] = useState(options);
  const [deep, setDeep] = useState(0);
  const [chooseDeep, setChooseDeep] = useState(-1);
  const [buttonText, setButtonText] = useState('请选择');
  const [value, setValue] = useState<undefined | string>();

  useEffect(() => {
    doFun(onChange, value, list);
  }, [value]);

  const init = () => {
    const newList: any[] =
      findCurrentItemList(options, value === undefined ? defaultValue : value) || [];

    let currentOptions = JSON.parse(JSON.stringify(options));
    newList.forEach(currentItem => {
      const a = currentOptions.find(i => i.value === currentItem.value);
      if (a) {
        currentOptions = a.children || [];
      }
    });

    setButtonText(newList.map(i => i.label).join('-') || '请选择');
    if (currentOptions?.length) {
      newList.push(defaultListItem);
    }
    setList(newList);
  };

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
      options.length && init();
    }
  }, [defaultValue, options]);

  useEffect(() => {
    if (options.length > 0) {
      let currentOptions = options;
      let currentDeep = 0;
      list.forEach(i => {
        const result = currentOptions.find(({value}) => value === i.value);
        if (
          result &&
          result.children?.length > 0 &&
          (chooseDeep <= -1 || (chooseDeep > -1 && currentDeep < chooseDeep))
        ) {
          currentOptions = result.children;
          currentDeep++;
        }
      });
      setDeep(currentDeep);
      setRenderOptions(currentOptions);
    }
  }, [options, list, chooseDeep]);

  const submit = () => {
    const newList = list.filter(i => i.label !== '请选择');
    setButtonText(newList.map(i => i.label).join('-') || '请选择');
    setValue(newList.length > 0 ? newList.slice(-1)[0].value : '');
  };

  const drawerRef = useRef<{hide: Function}>();

  const defaultOpen = (
    <View
      onClick={() => {
        Taro.hideKeyboard();
      }}
    >
      <Text className={`row ${buttonText === '请选择' ? 'color9' : 'color3'}`}>
        <Text className="flex1">{buttonText}</Text>
        <Text className="shrink0 iconfont-new fs40">&#xe668;</Text>
      </Text>
    </View>
  );
  return (
    <>
      <Drawer
        button={open || defaultOpen}
        contentStyle={{padding: 0}}
        height="50vh"
        header={false}
        canMove={false}
        canClose={false}
        contentScrollStyle={{overflow: 'hidden'}}
        ref={drawerRef}
        onShow={() => {
          if (value) {
            init();
          }
        }}
        afterClose={cancel => {
          if (cancel) {
            setList([defaultListItem]);
            setRenderOptions([]);
            setDeep(0);
            setChooseDeep(-1);
          } else {
            submit();
          }
        }}
      >
        <View className="column" style={{height: '100%'}}>
          <View className="border-bottom pl36 pr36 pt24">
            <View className="row shrink0" style={{justifyContent: 'space-between'}}>
              <Text className="color9 lh60" onClick={() => drawerRef.current?.hide()}>
                取消
              </Text>
              <Text className="weight6">{title || label}</Text>
              <Text
                className="link lh60"
                onClick={() => {
                  if (
                    chooseEnd &&
                    // 未选择的情况
                    list.filter(i => i.label !== defaultListItem.label).length > 0 &&
                    // 已选择完整的情况
                    list.filter(i => i.label === defaultListItem.label).length > 0
                  ) {
                    showToast('请选择完整');
                    return;
                  }
                  drawerRef.current?.hide(false);
                }}
              >
                确定
              </Text>
            </View>
            <View className="row shrink0 lh80">
              {list.map(({value, label}, index) => (
                <Text
                  key={value}
                  className={`mr24 color3 ${
                    (chooseDeep > -1 && index === chooseDeep) ||
                    (chooseDeep <= -1 && list.length - 1 === index)
                      ? 'link'
                      : ''
                  }`}
                  onClick={() => {
                    vibrateAction();
                    setChooseDeep(index);
                  }}
                >
                  {label}
                </Text>
              ))}
            </View>
          </View>
          <View className="column flex1 pt24 pl36 pr36" style={{overflowY: 'auto'}}>
            {renderOptions.map((i: {label: string; value: string; children?: []}) => {
              return (
                <Text
                  className={`lh72 color3 ${
                    list.find(({value}) => value === i.value) ? 'link' : ''
                  }`}
                  onClick={() => {
                    vibrateAction();
                    const newList = list.slice(0, deep + 1);
                    let lastList = newList;
                    if (newList[deep]?.value === i.value) {
                      lastList = newList.slice(0, deep);
                      lastList.push(defaultListItem);
                    } else {
                      lastList[deep] = i;
                      if (i.children?.length) {
                        lastList.push(defaultListItem);
                      }
                    }
                    setList([...lastList]);
                    setChooseDeep(-1);
                  }}
                >
                  {i.label}
                </Text>
              );
            })}
          </View>
        </View>
      </Drawer>
      {name && (
        <View hidden>
          <Input name={name} value={value} />
        </View>
      )}
    </>
  );
}

export {SameCascader};
export default Cascader;
