import React, {useState} from 'react';
import {Text, Image, View} from '@tarojs/components';
import starIcon from '@/resource/star.png';
import unStarIcon from '@/resource/unStar.png';
import './index.less';

interface IStarProps {
  onGetScore: (i: number) => void;
  data: any;
}

const STAR_MAP = {
  0: '非常差',
  1: '较差',
  2: '一般',
  3: '好',
  4: '非常好'
};

const Star = (props: IStarProps) => {
  const {onGetScore, data} = props;
  const [index, setIndex] = useState(data?.score - 1);
  return (
    <View className="startComp">
      {new Array(5).fill('').map((_item, i) => {
        return (
          <Image
            className="star"
            key={i}
            src={index < i ? unStarIcon : starIcon}
            onClick={() => {
              setIndex(i);
              onGetScore({
                ...data,
                score: i + 1
              });
            }}
          />
        );
      })}
      {index > -1 && <Text className="level">{STAR_MAP[index]}</Text>}
    </View>
  );
};

export default Star;
