import {doFun} from '@/utils';
import {Text, View} from '@tarojs/components';
import React, {memo, useEffect, useState} from 'react';

function SearchItem(props) {
  const [visible, setVisible] = useState(false);
  const {text, onRemove, onSearch} = props;

  useEffect(() => {
    // addPageClick({
    //   [text]: () => {
    //     setVisible(false);
    //   }
    // });
    // return () => {
    //   removeClick(text);
    // };
  }, []);

  return (
    <Text className="search-history-item mb12" style={{whiteSpace: 'nowrap', maxWidth: '100%'}}>
      {visible && (
        <Text
          className="iconfont-new search-history-item-close w36 lh36 text-center shrink0"
          onClick={e => {
            e.stopPropagation();
            doFun(onRemove);
          }}
        >
          &#xe66a;
        </Text>
      )}
      <View
        className="search-history-item-text row pt12 pb12 pl24 pr24 fs28 color6 weight4 center"
        onClick={() => {
          doFun(onSearch);
        }}
        // @ts-ignore
        onLongTap={() => {
          setVisible(true);
        }}
      >
        <Text className="line1">{text}</Text>
      </View>
    </Text>
  );
}
export default memo(SearchItem);
