import {doFun} from '@/utils';
import {View} from '@tarojs/components';
import {setStorageSync, getStorageSync, useRouter} from '@tarojs/taro';
import React, {useEffect, useRef, useState} from 'react';

import './index.less';
import DefaultInput from './input';
import SearchItem from './searchItem';

interface Props {
  onSearch?: Function;
  className?: string;
  style?: React.CSSProperties;
  onClick?: Function;
  autoFocus?: boolean;
  placeholder?: string;
  path?: string;
  hideSearch?: boolean;
  defaultValue?: string;
  hideMask?: boolean;
  maxlength?: number;
  maxSearchKeyLength?: number;
  disabled?: boolean;
}
function HeaderSearchInput(props: Props) {
  const {
    onSearch,
    className = '',
    style = {},
    onClick,
    autoFocus = false,
    placeholder,
    path: defaultPath,
    hideSearch = false,
    defaultValue,
    hideMask = false,
    maxlength = 30,
    maxSearchKeyLength = 15,
  } = props;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const path = defaultPath || useRouter().path;
  const [value, setValue] = useState(defaultValue || '');
  const [lastSearchKey, setLastSearchKey] = useState('');
  const [visible, setVisible] = useState(false);
  const [focus, setFocus] = useState(false);
  const inputRef = useRef<any>();
  const [storageKey] = useState(path.split('/').filter(Boolean).join('-'));
  const [searchHistoryList, setSearchHistoryList] = useState<string[]>([]);

  useEffect(() => {
    const searchList = getStorageSync(storageKey);
    setSearchHistoryList(searchList.split('||||').filter(Boolean));
  }, [path]);

  useEffect(() => {
    setStorageSync(storageKey, searchHistoryList.slice(0, maxSearchKeyLength).join('||||'));
  }, [JSON.stringify(searchHistoryList), path]);

  // input后的搜索事件点击
  const inputSearch = () => {
    const result = value.trim();
    const list = [...searchHistoryList];
    const currentIndex = list.findIndex(i => i === result);
    if (currentIndex > -1) {
      const currentList = list.splice(currentIndex, 1);
      setSearchHistoryList([...currentList, ...list]);
    } else {
      result && setSearchHistoryList([result, ...searchHistoryList]);
    }
    setLastSearchKey(result);
    doFun(onSearch, result);
    setVisible(false);
    setFocus(false);
  };

  // 搜索历史的item点击
  const searchHistoryItemClick = (index, val) => {
    let list = [...searchHistoryList];
    const newItem = list.splice(index, 1);
    setSearchHistoryList([...newItem, ...list]);
    setValue(val);
    setLastSearchKey(val);
    doFun(onSearch, val);
    setVisible(false);
  };
  useEffect(() => {
    if (autoFocus) {
      setVisible(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [autoFocus]);

  const handleClear = () => {
    doFun(onSearch, '');
    setVisible(false);
    setFocus(false);
    setValue('');
  };

  return (
    <View className={`default-search-input-warp ${className}`} style={style}>
      <View
        onClick={() => {
          if (typeof onClick === 'function') {
            onClick();
          } else {
            setVisible(true);
            setTimeout(() => {
              setFocus(true);
              inputRef.current?.focus();
            }, 100);
          }
        }}
      >
        <DefaultInput {...{value, setValue, maxlength}} />
      </View>
      {visible && (
        <>
          <View
            className="fixed-bg"
            onClick={() => {
              setVisible(false);
              if (value.trim() !== lastSearchKey) {
                inputSearch();
              }
            }}
            hidden={hideMask}
          />
          <View className="search-input-true backgroundF pb24 pt24">
            <DefaultInput
              {...{
                value,
                setValue,
                inputRef,
                disabled: false,
                onSearch: inputSearch,
                placeholder,
                maxlength,
                autoFocus: focus,
                onClear: handleClear,
              }}
            />
            {!hideSearch && (
              <View className="row pl24 pr24 pt24" style={{flexWrap: 'wrap'}}>
                {(searchHistoryList || []).slice(0, maxSearchKeyLength).map((i, index) => (
                  <SearchItem
                    text={i}
                    key={i + index}
                    onRemove={() =>
                      setSearchHistoryList(searchHistoryList.filter(item => item !== i))
                    }
                    onSearch={() => searchHistoryItemClick(index, i)}
                  />
                ))}
              </View>
            )}
          </View>
        </>
      )}
    </View>
  );
}

export default HeaderSearchInput;
