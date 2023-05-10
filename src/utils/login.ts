import { baseOptions } from '@/api/request'
import { getAuthCode, corpId, appId, setStorageSync } from '@/utils/platsUtils/index';
import { login } from '@/api/modules/common';
import store from '@/store/index';
import { CHANGE_USER } from '@/store/user';

let loginPromise;
const handleLogin = async () => {
  if (loginPromise) {
    loginPromise.catch(() => {
      loginPromise = '';
    });
    return loginPromise;
  }
  loginPromise = new Promise(async (resolve, reject) => {
    try {
      // let authCode = '';
      // // @ts-ignore
      // if (Taro.getEnv() === 'dd') {
      //   authCode = await getAuthCode();
      // } else if (Taro.ENV_TYPE.WEAPP === Taro.getEnv()) {
      //   await Taro.login({
      //     success: result => {
      //       if (result.code) {
      //         authCode = result.code;
      //       } else {
      //         console.log('登陆失败');
      //       }
      //     }
      //   })
      // }
      const authCode = await getAuthCode();

      if (!authCode) return false;

      const { data = {} } = await baseOptions({ url: login, data: { miniAppId: appId, corpId, code: authCode } }, 'GET')

      const { zxdepartName, zxtenantName, zxtoken, zxuid, zxuname } = data?.data || {};
      // const dingRes = await ApiRequest.get(userView, {})
      store.dispatch({
        type: CHANGE_USER,
        payload: {
          zxInfo: {
            zxtoken,
            zxdepartName,
            zxtenantName,
            zxuid,
            zxuname,
            name: zxuname
          } || {},
          // dingTalkInfo: dingRes?.data || {}
        }
      });
      setStorageSync({
        zxtoken,
        zxdepartName,
        zxtenantName,
        zxuid,
        zxuname
      });
      resolve({zxdepartName, zxtenantName, zxtoken, zxuid, zxuname});
    } catch (e) {
      reject(e);
      console.log('login error', e);
    }
  });
  return loginPromise;
};

export default handleLogin;
