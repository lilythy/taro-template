import store from '@/store';
import {CHANGE_GLOBAL} from '@/store/global';
import {isFull} from '@/utils';
import {View} from '@tarojs/components';
import React, {useState} from 'react';
import {connect} from 'react-redux';

function Page(props) {
  const {children, globalStore} = props;
  const {moveActive} = globalStore;

  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  return (
    <View
      catchMove
      className={`column ${isFull ? 'full-screen' : ''}`}
      style={{width: '100vw', height: '100vh'}}
      onTouchStart={e => {
        setStartX(e.touches[0].clientX);
        setStartY(e.touches[0].clientY);
      }}
      onTouchMove={e => {
        const {clientX, clientY} = e.touches[0];
        if (!moveActive) {
          if (Math.abs(clientX - startX) > 10) {
            store.dispatch({
              type: CHANGE_GLOBAL,
              payload: {
                moveActive: 'X'
              }
            });
          }
          if (Math.abs(clientY - startY) > 10) {
            store.dispatch({
              type: CHANGE_GLOBAL,
              payload: {
                moveActive: 'Y',
                moveId: '0'
              }
            });
          }
        }
      }}
      onTouchEnd={() => {
        store.dispatch({
          type: CHANGE_GLOBAL,
          payload: {
            moveActive: undefined
          }
        });
      }}
    >
      {children}
    </View>
  );
}

export default connect(({globalStore}: any) => ({
  globalStore
}))(Page);
