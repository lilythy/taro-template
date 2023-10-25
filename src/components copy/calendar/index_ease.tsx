import React, {useState} from 'react';
import {View} from '@tarojs/components';
import './index.less';

const App = (props) => {
  const {marks = [{value: '2022-08-10', color: 'pink', size: '10px'}]} = props;
  let MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const WEEK_NAMES = ['日', '一', '二', '三', '四', '五', '六'];
  const LINES = [1, 2, 3, 4, 5, 6];
  const [loinsYear, setLoinsYear] = useState(0);
  const [loinsMonth, setLoinsMonth] = useState(new Date().getMonth());
  const [currentDate, setcurrentDate] = useState(new Date());
  const [tag, setTag] = useState(false);

  // 获取当前月份
  const getMonth = (date: Date): number => {
    return date.getMonth();
  };
  // 获取当前年份
  const getFullYear = (date: Date): number => {
    return date.getFullYear();
  };

  const getCurrentMonthDays = (month: number, year: number): number => {
    let _year = year + currentDate.getFullYear();
    if (_year % 100 != 0 && _year % 4 == 0 || _year % 400 == 0) {
      MONTH_DAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    }
    return MONTH_DAYS[month];
  };

  // 当月第一天是周几
  const getDateByYearMonth = (year: number, month: number, day: number = 1): Date => {
    const date = new Date();
    date.setFullYear(year);
    date.setMonth(month, day);
    return date;
  };
  const getWeeksByFirstDay = (year: number, month: number): number => {
    const date = getDateByYearMonth(year, month);
    return date.getDay();
  };

  const markDate = marks.map(item => item.value);
  const getDayText = (line: number, weekIndex: number, weekDay: number, monthDays: number): any => {
    const number = line * 7 + weekIndex - weekDay + 1;
    const markIndex = markDate.indexOf(number);
    if (number <= 0 || number > monthDays) {
      return <View className='day-c' key={weekIndex}>&nbsp;</View>;
    }
    return <View className='day-c' key={weekIndex}>
      <View className='day'>{number}</View>
      {markIndex && <View className='day-marks' />}
      <View className='desc'>可约</View>
    </View>;
  };

  const setCurrentYearMonth = (date) => {
    const month = getMonth(date);
    const year = getFullYear(date);
    setLoinsYear(year);
    setLoinsMonth(month);
    setTag(false);
  };

  const monthChange = (monthChanged: number) => {
    if (tag) {
      return;
    } else {
      setTag(true);
    }

    const monthAfter = loinsMonth + monthChanged;
    const date = getDateByYearMonth(loinsYear, monthAfter);
    setCurrentYearMonth(date);
  };
  const formatNumber = (num: number): string => {
    const _num = num + 1;
    return _num < 10 ? `0${_num}` : `${_num}`;
  };

  let weekDay = getWeeksByFirstDay(loinsYear, loinsMonth);

  let _startX = 0;

  return (
    <View
      className='loins-calendar'
      onTouchEnd={(val) => {
        if (_startX > val.changedTouches[0]['clientX'] + 30) {
          monthChange(1);
        }
        if (_startX < val.changedTouches[0]['clientX'] - 30) {
          monthChange(-1);
        }
      }} onTouchStart={(val) => {
      _startX = val.changedTouches[0]['clientX'];

    }}
    >
      <View className='loins-calendar-tabbar'>
        <View
          onClick={() => {
            monthChange(-1);
          }}
        >
          &lt;
        </View>
        <View
          className='loins-calendar-title'
        >
          {loinsYear + currentDate.getFullYear()} 年 {formatNumber(loinsMonth)}月
        </View>
        <View
          onClick={() => {
            monthChange(1);
          }}
        >
          &gt;
        </View>
      </View>
      {
        WEEK_NAMES.map((week, key) => {
          return <View className='title-c' key={key}>{week}</View>;
        })
      }
      {
        LINES.map((_l, key) => {
          return (<View key={key} className='day-content'>
            {
              WEEK_NAMES.map((_week, index) => {
                return getDayText(key, index, weekDay, getCurrentMonthDays(loinsMonth, loinsYear));
              })
            }
          </View>);
        })
      }
    </View>
  );
};

export default App;
