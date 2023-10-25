import React from 'react';
import {View} from '@tarojs/components';
import {dateFormat} from '@/utils';

import './index.less';

const App = props => {
  const {data = []} = props;
  return (
    <View className="approval-c-wrap">
      {data.map((item, index) => {
        const cls = item.complete ? 'done' : item.startTime ? 'process' : '';
        return (
          <View className="approval-c-item column" key={`appr_${index}`}>
            <View className="approval-c-content">
              <View className={`approval-c-circle ${cls}`}></View>
              <View className="approval-c-info">
                <View className={`approval-c-result ${cls}`}>{item.actionText || item.name}</View>
                <View className="approval-c-time fs24 regular color9 lh36 weight4">
                  {item.completeTime ? dateFormat(item.completeTime, 'YYYY年MM月DD日 HH:mm') : '--'}
                </View>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default App;
