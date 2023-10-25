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
  options: ListItem[];
  title?: string;
  open?: React.ReactElement;
  name?: string;
  value?: string;
  onChange?: (lastId: string) => void;
  className?: string;
  chooseEnd?: boolean;
  chooseDirection?: 'row' | 'column';
  level?: number;
  renderList?: (
    list: ListItem[],
    options: {level: number; chooseDeep: number; setChooseDeep: Function}
  ) => React.ReactElement;
  sameChooseList?: boolean;
}

const defaultListItem = {
  label: '请选择',
  value: '0'
};

function TestCascader(props: Props) {
  const [vibrateAction] = useVibrate();
  const {
    options = [],
    name,
    value: defaultValue,
    onChange,
    className = '',
    chooseEnd = false,
    open,
    title = '',
    chooseDirection = 'row',
    level = 10,
    renderList,
    sameChooseList = false
  } = props;
  const [list, setList] = useState<ListItem[]>([defaultListItem]);
  const [renderOptions, setRenderOptions] = useState(options);
  const [deep, setDeep] = useState(0);
  const [chooseDeep, setChooseDeep] = useState(-1);
  const [buttonText, setButtonText] = useState('请选择');
  const [value, setValue] = useState<undefined | string>();

  useEffect(() => {
    doFun(onChange, value);
  }, [value]);

  const init = () => {
    let newList: any[];
    if (sameChooseList) {
      newList =
        (value === undefined
          ? Array.isArray(defaultValue)
            ? defaultValue.join('|||')
            : defaultValue
          : value
        )
          ?.split('|||')
          .map(i => {
            const list = findCurrentItemList(options, i) || [];
            return list[0];
          }) || [];
    } else {
      newList = findCurrentItemList(options, value === undefined ? defaultValue : value) || [];
    }

    let currentOptions = JSON.parse(JSON.stringify(options));
    newList.forEach(currentItem => {
      const a = currentOptions.find(i => i.value + '' === currentItem.value);
      if (a) {
        currentOptions = a.children || [];
      }
    });

    setButtonText(newList.map(i => i.label).join('-') || defaultListItem.label);
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
        const result = currentOptions.find(({value}) => value === i.value + '');
        if (
          result &&
          result.children?.length > 0 &&
          (chooseDeep <= -1 || (chooseDeep > -1 && currentDeep < chooseDeep))
        ) {
          currentOptions = result.children;
          currentDeep++;
        }
      });
      setDeep(currentDeep >= level ? level - 1 : currentDeep);
      if (sameChooseList) {
        setRenderOptions(options);
      } else {
        setRenderOptions(currentOptions);
      }
    }
  }, [options, list, chooseDeep]);

  const submit = () => {
    const newList = list.filter(i => i.label !== '请选择');
    setButtonText(newList.map(i => i.label).join('-') || '请选择');
    setValue(
      newList.length > 0
        ? sameChooseList
          ? newList.map(({value}) => value).join('|||')
          : newList.slice(-1)[0].value
        : ''
    );
  };

  const drawerRef = useRef<{hide: Function}>();

  const defaultOpen = (
    <View
      onClick={() => {
        Taro.hideKeyboard();
      }}
    >
      <Text className={`${className} row ${buttonText === '请选择' ? 'color9' : 'color3'}`}>
        <Text className="flex1">{buttonText}</Text>
        <Text className="shrink0 iconfont-new fs40">&#xe668;</Text>
      </Text>
    </View>
  );

  const isColumn = chooseDirection === 'column';
  const newList: ListItem[] = [...list, ...Array(isColumn ? level : 0).fill(defaultListItem)].slice(
    0,
    isColumn ? level : 10
  );
  const paddingClassName = isColumn ? 'pl54 pr54' : 'pl36 pr36';
  return (
    <>
      <Drawer
        button={open || defaultOpen}
        contentStyle={{padding: 0}}
        height={isColumn ? '60vh' : '50vh'}
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
          <View className={`border-bottom ${paddingClassName} pt24`}>
            <View className="row shrink0" style={{justifyContent: 'space-between'}}>
              <Text className="color9 lh60" onClick={() => drawerRef.current?.hide()}>
                取消
              </Text>
              <Text className="weight6">{title}</Text>
              <Text
                className="link lh60"
                onClick={() => {
                  if (chooseEnd && list.find(i => i.label === defaultListItem.label)) {
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
              <View className={`shrink0 default-choose-list-result ${chooseDirection}`}>
                {newList.map(({label}, index) => (
                  <Text
                    key={index + ''}
                    className={`default-choose-list-result-item mr24 ${
                      (chooseDeep > -1 && index === chooseDeep) ||
                      (chooseDeep <= -1 && list.length - 1 === index)
                        ? 'link'
                        : ''
                    } ${newList[index].label !== defaultListItem.label ? 'chosen' : ''}`}
                    onClick={() => {
                      if (
                        newList[index].label === defaultListItem.label &&
                        newList[index - 1].label === defaultListItem.label
                      ) {
                        return;
                      }
                      vibrateAction();
                      setChooseDeep(index);
                    }}
                  >
                    {label}
                  </Text>
                ))}
              </View>
            )}
          </View>
          <View className={`column flex1 pt24 ${paddingClassName}`} style={{overflowY: 'auto'}}>
            {renderOptions.map((i: {label: string; value: string; children?: []}) => {
              return (
                <Text
                  className={`lh72 ${list.find(({value}) => value === i.value + '') ? 'link' : ''}`}
                  onClick={() => {
                    vibrateAction();
                    const newList = list.slice(0, deep + 1);
                    let lastList = newList;
                    if (newList[deep]?.value === i.value + '') {
                      lastList = newList.slice(0, deep);
                      lastList.push(defaultListItem);
                    } else {
                      lastList[deep] = i;
                      if (!sameChooseList && i.children?.length) {
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

export default TestCascader;
