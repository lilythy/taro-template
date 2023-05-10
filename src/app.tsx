import React, { Component } from "react";
import ApiRequest from "./api/request";
import { login } from "./api/modules/common";
import {
  getAuthCode,
  corpId,
  appId,
  setStorageSync
} from "./utils/platsUtils/index";
import store from "./store/index";
import { CHANGE_USER } from "./store/user";
import "./app.scss";
import { View } from "@tarojs/components";
import { Provider, connect } from "react-redux";
import Taro from "@tarojs/taro";

const RenderChildren = connect((store: any) => ({
  userStore: store.userStore
}))(props => {
  const { children } = props;
  return children;
});

class App extends Component {
  handleLogin = async () => {
    const authCode = await getAuthCode();
    const { data, success } = await ApiRequest.get(login, {
      miniAppId: appId,
      corpId,
      code: authCode
    });
    // const dingRes = await ApiRequest.get(userView, {})
    const { zxdepartName, zxtenantName, zxtoken, zxuid, zxuname } = data;
    store.dispatch({
      type: CHANGE_USER,
      payload: {
        zxInfo:
          {
            zxtoken,
            zxdepartName,
            zxtenantName,
            zxuid,
            zxuname,
            name: zxuname
          } || {}
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
  };

  componentDidMount() {
    console.log("Taro.getEnv()--", Taro.getEnv());
    this.handleLogin();
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // this.props.children 是将要会渲染的页面
  render() {
    // return this.props.children
    return (
      <View>
        <Provider store={store}>
          <RenderChildren {...this.props} />
        </Provider>
      </View>
    );
  }
}

export default App;
