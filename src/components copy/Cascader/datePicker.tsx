import {addZero, dateFormat, doFun, getMonthDay, nowDate} from '@/utils';
import {Input, PickerView, PickerViewColumn, Text, View} from '@tarojs/components';
import React, {useRef, useState} from 'react';
import {useVibrate} from 'taro-hooks';
import Drawer from '../drawer';

interface Year {
  /** 年份列表的开始年份，默认2000 */
  start?: number;
  /** 从开始年份，向后增加 * 年，默认30 */
  count?: number;
}
interface Props {
  /** 点击的dom */
  open: React.ReactElement;
  /** 初始值 */
  value?: string | number | number[];
  /** date 日期 */
  onChange: (date: string) => void;
  /** 组件嵌入form表单时的参数，平时使用不需要传 */
  name?: string;
  /** 组件嵌入form表单时的参数，平时使用不需要传 */
  label?: string;
  /** 抽屉title */
  title?: string;
  /** 可以选择多少年，从2000年开始 */
  year?: Year;
  /** 1|2|3 年月日 */
  level?: number;
}
function DatePicker(props: Props) {
  const [vibrateAction] = useVibrate();

  const {
    open,
    value: defaultValue,
    onChange,
    year: {start: startYear = 2000, count: yearCount = 30} = {},
    level = 3,
    name = '',
    title = '',
    label = ''
  } = props;
  const [daysCount, setDaysCount] = useState<number>(getMonthDay());
  const [value, setValue] = useState<undefined | number[]>(undefined);

  const getDateList = (str?: string | number) =>
    dateFormat(str || '', 'YYYY-MM-DD')
      .split('-')
      .map((i, index) => (index === 0 ? +i - startYear : +i - 1));

  const init = () => {
    if (defaultValue) {
      if (typeof defaultValue === 'string' || typeof defaultValue === 'number') {
        setValue(getDateList(defaultValue));
      } else if (Array.isArray(defaultValue)) {
        setValue(defaultValue);
      }
    } else {
      setValue(getDateList());
    }
  };

  const submit = () => {
    doFun(
      onChange,
      addZero(value?.map((i, index) => (index === 0 ? i + startYear : ++i)).slice(0, level)).join(
        '-'
      )
    );
  };

  const drawerRef = useRef<{hide: Function}>();

  const eleList = [
    <PickerViewColumn key="year">
      {[...Array(yearCount + 1).keys()]
        .map(i => startYear + i)
        .map(item => {
          return <View>{item}年</View>;
        })}
    </PickerViewColumn>,
    <PickerViewColumn key="month">
      {[...Array(12).keys()]
        .map(i => i + 1)
        .map(item => {
          return <View>{item}月</View>;
        })}
    </PickerViewColumn>,
    <PickerViewColumn key="day">
      {[...Array(daysCount).keys()]
        .map(i => i + 1)
        .map(item => {
          return <View>{item}日</View>;
        })}
    </PickerViewColumn>
  ];

  return (
    <>
      <Drawer
        button={open}
        contentStyle={{padding: 0}}
        height="50vh"
        header={false}
        canMove={false}
        canClose={false}
        contentScrollStyle={{overflow: 'hidden'}}
        ref={drawerRef}
        onShow={() => {
          init();
        }}
        afterClose={cancel => {
          if (cancel) {
            init();
          } else {
            submit();
          }
        }}
      >
        <View className="border-bottom pl36 pr36 pt24 pb24">
          <View className="row shrink0" style={{justifyContent: 'space-between'}}>
            <Text className="color9 lh60" onClick={() => drawerRef.current?.hide()}>
              取消
            </Text>
            <Text className="weight6">{title || label}</Text>
            <Text className="link lh60" onClick={() => drawerRef.current?.hide(false)}>
              确定
            </Text>
          </View>
        </View>
        <PickerView
          indicatorStyle="height: 50px;"
          style={{height: 'calc(50vh - 1.08rem)'}}
          className="flex1 row"
          value={value || []}
          onChange={e => {
            vibrateAction();
            const [yearIndex, month = nowDate.getMonth(), day] = e.detail.value;
            // 只有包含日历的时候才需要
            if (level >= 3) {
              const monthDays = getMonthDay(month + 1, yearIndex + startYear);
              setDaysCount(monthDays);
              if (day >= monthDays) {
                setValue([yearIndex, month, 0]);
              } else {
                setValue(e.detail.value);
              }
            } else {
              setValue(e.detail.value);
            }
          }}
        >
          {eleList.slice(0, level)}
        </PickerView>
      </Drawer>
      {name && (
        <View hidden>
          <Input name={name} value={value?.join('/')} />
        </View>
      )}
    </>
  );
}

export default DatePicker;
