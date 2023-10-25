import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  forwardRef,
  useImperativeHandle
} from 'react';
import {View, Swiper, SwiperItem} from '@tarojs/components';
import Taro from '@tarojs/taro';
import dayjs from 'dayjs';

import './index.less';
import {useDebounceFn} from 'taro-hooks';

/**
 * @method 日历组件
 * @param {string} date
 * @param {type} week/month
 * @param {function} return ReactElement customItem 自定义日期显示
 * @param {function} onChange 日历切换
 * @param {function} handleChooseDate 选择日期
 * @function ref function handleScrollChangeWithSwiper(dateType) 父组件自定义切换swiper
 */
interface Props {
  date?: string;
  type: any;
  customItem?: any;
  onChange: (res: any) => void;
  handleChooseDate: (res: any) => void;
}

const Calendar = forwardRef(({date, type, customItem, onChange, handleChooseDate}: Props, ref) => {
  const [current, setCurrent] = useState<number>(1);
  const [currentDay, setCurrentDay] = useState<string>(dayjs().format('YYYY-MM-DD'));

  const [activeValue, setActiveValue] = useState<any>(date);

  const [calendarList, setCalendarList] = useState<any[]>([]);

  /**
   * @method 根据月份生成日历
   */
  const getCalendarList = useCallback(month => {
    if (!month) month = dayjs();
    // 月第一天
    let firstOfMonth = month.startOf('month');
    const curFirstOfMonth = month.startOf('month');
    // 第一天是周几
    const firstOfWeek = firstOfMonth.day();
    // 最后一天
    const lastOfMoth = month.endOf('month');
    // 最后一天是周几
    const lastOfWeek = lastOfMoth.day();
    const dateList: string[] = [];
    // 月初到月尾
    while (firstOfMonth < lastOfMoth) {
      dateList.push(firstOfMonth.format('YYYY-MM-DD'));
      firstOfMonth = firstOfMonth.add(1, 'day');
    }
    // 首部插入 是周几第一行就插入几条
    const headLength = firstOfWeek;
    const headList: string[] = [];
    for (let i = 0; i < headLength; i++) {
      headList.push(curFirstOfMonth.subtract(i + 1, 'day').format('YYYY-MM-DD'));
    }
    // 尾部插入
    const endLength = 7 - lastOfWeek - 1;
    const endList: string[] = [];
    for (let i = 0; i < endLength; i++) {
      endList.push(lastOfMoth.add(i + 1, 'day').format('YYYY-MM-DD'));
    }
    return [...headList.reverse(), ...dateList, ...endList];
  }, []);

  /**
   * @method 生成本周list
   */
  const getCalendarListByWeek = useCallback(cur => {
    const result: string[] = [];
    let startOfWeek = dayjs(cur).startOf('week');
    const endOfWeek = dayjs(cur).endOf('week');
    while (startOfWeek < endOfWeek) {
      result.push(startOfWeek.format('YYYY-MM-DD'));
      startOfWeek = startOfWeek.add(1, 'day');
    }
    return result;
  }, []);

  const initCalendarList = useCallback(
    curDay => {
      if (type === 'month') {
        setCalendarList([
          {
            id: curDay.subtract(1, 'month').format('YYYY-MM'),
            list: getCalendarList(curDay.subtract(1, 'month'))
          },
          {id: curDay.format('YYYY-MM'), list: getCalendarList(curDay)},
          {
            id: curDay.add(1, 'month').format('YYYY-MM'),
            list: getCalendarList(curDay.add(1, 'month'))
          }
        ]);
      } else {
        setCalendarList([
          {
            id: curDay.subtract(1, 'week').format('YYYY-MM-DD'),
            list: getCalendarListByWeek(curDay.subtract(1, 'week'))
          },
          {id: curDay.format('YYYY-MM-DD'), list: getCalendarListByWeek(curDay)},
          {
            id: curDay.add(1, 'week').format('YYYY-MM-DD'),
            list: getCalendarListByWeek(curDay.add(1, 'week'))
          }
        ]);
      }
    },
    [getCalendarList, getCalendarListByWeek, type]
  );

  /**
   * @method 根据当前日期生成当月上月下月日历
   */
  useEffect(() => {
    if (!date) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      date = dayjs().format('YYYY-MM-DD');
    }
    setCurrent(1);
    const curDay = dayjs(currentDay || date);
    setCurrentDay(curDay.format('YYYY-MM-DD'));
    initCalendarList(curDay);
  }, [type]);

  const theadList = useMemo(() => {
    return [
      {name: '日', value: 0},
      {name: '一', value: 1},
      {name: '二', value: 2},
      {name: '三', value: 3},
      {name: '四', value: 4},
      {name: '五', value: 5},
      {name: '六', value: 6}
    ];
  }, []);

  /**
   * @method 将日历按七天一行转换为二位数组
   */
  const parseToTable = useCallback(list => {
    const rowCount = list.length / 7;
    const result: any[] = [];
    for (let i = 0; i < rowCount; i++) {
      result.push(list.slice(i * 7, 7 * i + 7));
    }
    return result;
  }, []);

  /**
   * @method 点击日期
   */
  const handleClickDate = useCallback(
    v => {
      setActiveValue(v);
      setCurrentDay(v);
      handleChooseDate(v);
    },
    [handleChooseDate]
  );

  const {run: debounceChange} = useDebounceFn(
    v => {
      onChange(v);
    },
    {wait: 300}
  );

  /**
   * @method 切换后如果为最后一项或者第一项  补充下一月
   * @param type push/insert
   * @param month 月份对象
   */
  const handleAddList = useCallback(
    (eventType, day, isScroll = false) => {
      let newList;
      if (type === 'month') {
        newList = getCalendarList(day);
      } else {
        newList = getCalendarListByWeek(day);
      }
      const newItem = {id: day.format(type === 'month' ? 'YYYY-MM' : 'YYYY-MM-DD'), list: newList};
      if (eventType === 'push') {
        setCalendarList(prevState => [...prevState, newItem]);
        if (isScroll) {
          setTimeout(() => {
            setCurrent(calendarList.length - 1);
          }, 100);
        }
      } else {
        setTimeout(() => {
          setCurrent(1);
          setCalendarList(prevState => [newItem, ...prevState]);
        }, 100);
      }
    },
    [calendarList.length, getCalendarList, getCalendarListByWeek, type]
  );

  /**
   * @method 左右切换周、月
   */
  const handleChangeSwiper = useCallback(
    (key, v?: any) => {
      let newDay = currentDay;
      let changeTime = key - current;
      // 判断切换到上月还是下月
      if (key > current) {
        if (v) {
          newDay = v;
        } else {
          newDay = dayjs(newDay)
            .add(Math.abs(changeTime), type)
            .startOf(type)
            .format('YYYY-MM-DD');
        }
      }
      if (key < current) {
        if (v) {
          newDay = v;
        } else {
          newDay = dayjs(newDay)
            .subtract(Math.abs(changeTime), type)
            .startOf(type)
            .format('YYYY-MM-DD');
        }
      }
      // 是否为最后一项
      if (!calendarList[key + 1]) {
        handleAddList(
          'push',
          dayjs(newDay)
            .startOf(type)
            .add(1, type)
        );
      }
      // 是否为第一项
      if (!calendarList[key - 1]) {
        handleAddList(
          'insert',
          dayjs(newDay)
            .startOf(type)
            .subtract(1, type)
        );
      }
      setCurrent(key);
      setCurrentDay(newDay);
      setActiveValue(newDay);
      // handleChooseDate && handleChooseDate(newDay);
      debounceChange(newDay);
    },
    [calendarList, current, currentDay, debounceChange, handleAddList, type]
  );

  /**
   * @method 滚动触发swiper切换
   */
  const handleScrollChangeWithSwiper = useCallback(
    day => {
      let findIndex;
      if (type === 'week') {
        findIndex = calendarList.findIndex(item => item.list.includes(day));
      } else {
        let middleDay = dayjs(day)
          .startOf('month')
          .add(15, 'day')
          .format('YYYY-MM-DD');
        findIndex = calendarList.findIndex(item => item.list.includes(middleDay));
      }
      if (findIndex === 0) {
        handleAddList(
          'insert',
          dayjs(day)
            .startOf(type)
            .subtract(1, type),
          true
        );
        setCurrentDay(day);
        setActiveValue(day);
        return;
      }
      if (findIndex === calendarList.length - 1) {
        handleAddList(
          'push',
          dayjs(day)
            .startOf(type)
            .add(1, type),
          true
        );
        setCurrentDay(day);
        setActiveValue(day);
        return;
      }
      if (current !== findIndex) {
        setCurrent(findIndex);
        setCurrentDay(day);
        setActiveValue(day);
      }
      setCurrentDay(day);
      setActiveValue(day);
    },
    [calendarList, current, handleAddList, type]
  );

  // 暴露给父元素 滚动触发切换
  useImperativeHandle(ref, () => ({
    handleScrollChangeWithSwiper,
    calendarCurrentDay: currentDay
  }));

  // 月视角点击非本月数据
  const handleClickOtherDate = useCallback(v => {
    console.log(v, '---');
    // handleChooseDate && handleChooseDate(v);
    // handleChangeSwiper(dayjs(v) > dayjs(currentDay) ? current + 1 : current - 1, v);
  }, []);

  // const backToday = useCallback(() => {
  //   const today = dayjs();
  //   if (calendarList[current]?.list.find(item => item === today)) {
  //     onChange(today);
  //   } else {
  //     initCalendarList(today);
  //     setCurrent(1);
  //     onChange(today, true);
  //   }
  //   setCurrentDay(today.format('YYYY-MM-DD'));
  // }, [calendarList, current, initCalendarList, onChange]);
  return (
    <View className="c-lc">
      <View className="c-lc__title">{dayjs(currentDay).format('YYYY年M月')}</View>
      <View className="c-lc__thead">
        {theadList.map(item => (
          <View className="c-lc__thead-item" key={item.value}>
            {item.name}
          </View>
        ))}
      </View>
      <Swiper
        className="c-lc__swiper"
        current={calendarList.length > 0 ? current : undefined}
        // @ts-ignore
        adjustHeight="none"
        // onAnimationFinish={onAnimationFinish}
        disableProgrammaticAnimation
        onChange={e => handleChangeSwiper(e.detail.current)}
      >
        {calendarList.map(item => (
          <SwiperItem key={item.id} itemId={item.id}>
            <View
              className="c-lc__swiper-item"
              style={{height: type === 'month' ? 'auto' : Taro.pxTransform(80)}}
            >
              {parseToTable(item.list).map(row => {
                return (
                  <View key={row.toString()} className="c-lc__swiper-row">
                    {row.map(value => {
                      const dateDom = (
                        <View
                          className={`c-lc__swiper-item-value ${
                            activeValue === value ? 'c-lc__swiper-item-active' : ''
                          } ${
                            dayjs(value).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
                              ? 'c-lc__swiper-item-today'
                              : ''
                          }`}
                        >
                          {dayjs(value).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
                            ? '今'
                            : dayjs(value).date()}
                        </View>
                      );
                      return (
                        <View
                          className={`c-lc__swiper-date ${
                            dayjs(value).format('YYYY-MM') !==
                              dayjs(currentDay).format('YYYY-MM') ||
                            (type === 'week' && dayjs(value) < dayjs().startOf('day'))
                              ? 'c-lc__swiper-date-disabled'
                              : ''
                          }`}
                          onClick={() => {
                            if (
                              dayjs(value).format('YYYY-MM') !==
                                dayjs(currentDay).format('YYYY-MM') &&
                              type === 'month'
                            ) {
                              handleClickOtherDate(value);
                              return;
                            }
                            handleClickDate(value);
                          }}
                          key={value}
                        >
                          {customItem ? customItem(dateDom, value) : dateDom}
                        </View>
                      );
                    })}
                  </View>
                );
              })}
            </View>
          </SwiperItem>
        ))}
      </Swiper>
      {/*{currentDay !== dayjs().format('YYYY-MM-DD') && (*/}
      {/*  <View className="c-lc__back" onClick={backToday}>*/}
      {/*    返回今天*/}
      {/*  </View>*/}
      {/*)}*/}
    </View>
  );
});

export default memo(Calendar);
