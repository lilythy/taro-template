import {doFun, findCurrentItemList, showToast} from '@/utils';
import {Input, Text, View} from '@tarojs/components';
import Taro from '@tarojs/taro';
import React, {useEffect, useRef, useState} from 'react';
import {useVibrate} from 'taro-hooks';
import Drawer from '../drawer';
import './index.less';

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
  /** 默认value，"id1|||id2" 或 [id1,id2] */
  value?: string | string[];
  /** onChange, 返回id列表 */
  onChange?: (ids: string[]) => void;
  /** 同级选择有几层，默认为2 */
  level?: number;
  /** 如果觉得选择后的列表不符合，可以自定义渲染这里 */
  renderList?: (
    list: ListItem[],
    options: {level: number; chooseDeep: number; setChooseDeep: Function}
  ) => React.ReactElement;
}

const defaultListItem = {
  label: '请选择',
  value: '0'
};

function SameCascader(props: Props) {
  const [vibrateAction] = useVibrate();
  const {
    options = [],
    name,
    value: defaultValue,
    onChange,
    open,
    title = '',
    level = 2,
    label = '',
    renderList
  } = props;
  const [list, setList] = useState<ListItem[]>([...Array(level).fill(defaultListItem)]);
  const [renderOptions, setRenderOptions] = useState(options);
  const [chooseDeep, setChooseDeep] = useState(0);
  const [buttonText, setButtonText] = useState('请选择');
  const [value, setValue] = useState<undefined | string>();

  useEffect(() => {
    setRenderOptions([...options]);
  }, [options]);

  useEffect(() => {
    if (
      (typeof defaultValue === 'string' && value !== defaultValue) ||
      (Array.isArray(defaultValue) && defaultValue.join('|||') !== value)
    ) {
      doFun(onChange, value?.split('|||').filter(Boolean));
    }
  }, [value]);

  const init = () => {
    let newList: any[] =
      (value === undefined
        ? Array.isArray(defaultValue)
          ? defaultValue.join('|||')
          : defaultValue
        : value
      )
        ?.split('|||')
        .filter(Boolean)
        .map(i => {
          const list = findCurrentItemList(options, i) || [];
          return list[0];
        }) || [];

    setButtonText(newList.map(i => i.label).join('-') || defaultListItem.label);
    setList([...newList, ...Array(level).fill(defaultListItem)].slice(0, level));
  };

  useEffect(() => {
    if (defaultValue) {
      options.length && init();
    }
  }, [defaultValue, options]);

  const submit = () => {
    const newList = list.slice(0, level).filter(i => i.label !== '请选择');
    setButtonText(newList.map(i => i.label).join('-') || '请选择');
    setValue(newList.map(({value}) => value).join('|||'));
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
        height="60vh"
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
            setChooseDeep(0);
          } else {
            submit();
          }
        }}
      >
        <View className="column" style={{height: '100%'}}>
          <View className="border-bottom pl54 pr54 pt24">
            <View className="row shrink0" style={{justifyContent: 'space-between'}}>
              <Text className="color9 lh60" onClick={() => drawerRef.current?.hide()}>
                取消
              </Text>
              <Text className="weight6">{title || label}</Text>
              <Text
                className="link lh60"
                onClick={() => {
                  const trueLength = list
                    .slice(0, level)
                    .filter(i => i.label !== defaultListItem.label).length;
                  if (trueLength !== 0 && trueLength !== level) {
                    showToast('请选择');
                    return;
                  }
                  drawerRef.current?.hide(false);
                }}
              >
                确定
              </Text>
            </View>
            {renderList ? (
              renderList(list, {level, chooseDeep, setChooseDeep})
            ) : (
              <View className={`shrink0 default-choose-list-result column`}>
                {list.map(({label}, index) => (
                  <View
                    key={index + ''}
                    className={`default-choose-list-result-item mr24 ${
                      (chooseDeep > -1 && index === chooseDeep) ||
                      (chooseDeep <= -1 && list.length - 1 === index)
                        ? 'link'
                        : ''
                    } ${list[index]?.label !== defaultListItem.label ? 'chosen' : ''}`}
                    onClick={() => {
                      vibrateAction();
                      setChooseDeep(index);
                    }}
                  >
                    <View className="before" />
                    <View className="after" />
                    {label}
                  </View>
                ))}
              </View>
            )}
          </View>
          <View className="column flex1 pt24 pl54 pr54" style={{overflowY: 'auto'}}>
            {renderOptions.map((i: ListItem) => {
              return (
                <Text
                  className={`lh72 ${
                    i.value === list[chooseDeep].value &&
                    options.find(({value}) => value === list[chooseDeep].value + '')
                      ? 'link'
                      : ''
                  }`}
                  onClick={() => {
                    vibrateAction();
                    const newList = list.map((item, index) =>
                      index === chooseDeep ? (item?.value === i.value ? defaultListItem : i) : item
                    );

                    setList(newList);
                    if (newList[chooseDeep + 1]?.label === defaultListItem.label) {
                      setChooseDeep(chooseDeep + 1 >= level ? level - 1 : chooseDeep + 1);
                    }
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

export default SameCascader;
