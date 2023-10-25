import {View, Text} from '@tarojs/components';
import React, {useEffect} from 'react';
import './index.less';

interface IProps {
  className?: string;
  data: string;
  sensitiveWords: string[];
  isSensitiveOpen?: boolean;
  key?: string;
}
const SensitiveRichText = (props: IProps) => {
  const {className = '', data = '', sensitiveWords = [], isSensitiveOpen = false, key} = props;

  useEffect(() => {}, [data]);

  return (
    <View key={key || `${Math.random()}`} className={`sensitive-rich-text ${className}`}>
      {data?.split(new RegExp(`(${sensitiveWords.join('|')})`, 'g')).map(item => (
        <Text style={isSensitiveOpen && sensitiveWords?.includes(item) ? 'color: #FF0000' : ''}>
          {item}
        </Text>
      ))}
    </View>
    // <RichText
    //   key={key || `${Math.random()}`}
    //   className={`sensitive-rich-text ${className}`}
    //   nodes={[
    //     {
    //       name: 'div',
    //       attrs: {
    //         class: 'div_class'
    //       },
    //       children: data
    //         ? data?.split('\n').map(item => ({
    //             type: 'node',
    //             name: 'div',
    //             children:
    //               item
    //                 ?.replace(/\40/g, '\xa0')
    //                 ?.split(new RegExp(`(${sensitiveWords.join('|')})`, 'g'))
    //                 .map(child => ({
    //                   type: 'node',
    //                   name: 'span',
    //                   attrs: {
    //                     style:
    //                       isSensitiveOpen && sensitiveWords?.includes(child) ? 'color: #FF0000' : ''
    //                   },
    //                   children: [
    //                     {
    //                       type: 'text',
    //                       text: child
    //                     }
    //                   ]
    //                 })) || []
    //           }))
    //         : []
    //     }
    //   ]}
    // />
  );
};

export default SensitiveRichText;
