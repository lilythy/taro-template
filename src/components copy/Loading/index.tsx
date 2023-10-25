import {View} from '@tarojs/components';
import React from 'react';
import './index.less';

function Loading(props) {
  const {className = ''} = props;
  return (
    <View className={`default-loading-spin-warp row center ${className}`}>
      <View className="default-loading-spin-item"></View>
      <View className="default-loading-spin-item"></View>
      <View className="default-loading-spin-item"></View>
      <View className="default-loading-spin-item"></View>
      <View className="default-loading-spin-item"></View>
      <View className="default-loading-spin-item"></View>
      <View className="default-loading-spin-item"></View>
      <View className="default-loading-spin-item"></View>
    </View>
  );
}
function TimeLoading(props) {
  const {color = '#fff', className = ''} = props;
  return (
    <View className={`default-loading-warp ${className}`} style={{borderColor: color}}>
      <View className="default-loading-warp-icon1" style={{backgroundColor: color}} />
      <View className="default-loading-warp-icon2" style={{backgroundColor: color}} />
    </View>
  );
}

function TextLoading(props) {
  const {color = '#fff', className = ''} = props;
  return (
    <View
      className={`default-loading-text-warp row center ${className}`}
      style={{borderColor: color}}
    >
      <View className="default-loading-text">智</View>
      <View className="default-loading-text">行</View>
      <View className="default-loading-text">合</View>
      <View className="default-loading-text">一</View>
      {/* <View className="default-loading-text">.</View>
      <View className="default-loading-text">.</View>
      <View className="default-loading-text">.</View> */}
    </View>
  );
}
export {TimeLoading, TextLoading};
export default Loading;
