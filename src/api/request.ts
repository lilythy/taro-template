import Taro from "@tarojs/taro";
import { getStorageSync } from "@/utils/platsUtils/index.dd";
import { methods } from "@/enums";
import store from "@/store/index";
import handleLogin from "@/utils/login";
import { devMiniAppIds } from "@/constants";
// @ts-ignore
import { appId } from "@/utils/platsUtils/index";

const BASE_URL = devMiniAppIds.includes(appId)
  ? "https://khb-dev.zxhy.com"
  : "https://khb.zxhy.com";

export const baseOptions = (params, method) => {
  const zxtoken = getStorageSync("zxtoken");
  let { url, data, header = {}, isMock = false } = params;
  const isPost = methods.POST === method;
  const option = {
    url: !isMock ? BASE_URL + url : url,
    data: isPost ? JSON.stringify(data) : data,
    method: isPost ? "POST" : "GET",
    timeout: 2000, // 超时时间
    header: {
      "content-type": "application/json",
      // Authorization: Taro.getStorageSync("Authorization"),
      zxtoken,
      ...header,
    },
    success: function (res) {
      if (res?.data?.success) {
        return res.data;
      }

      if (res?.data?.success === false) {
        Taro.showToast({ title: res?.data?.errMsg || "接口异常！" });
      }
      return Promise.resolve(res?.data);
    },
    fail: function (error) {
      Taro.showToast({ title: JSON.stringify(error) });
      return Promise.reject(error);
    },
  };

  return Taro.request(option);
};

export const get = async (url, data, isMock?: boolean) => {
  const globalState = store.getState();
  if (!globalState.userStore.zxInfo?.zxuid) {
    await handleLogin();
  }
  let option = { url, data, isMock };
  const res = await baseOptions(option, "GET");
  return res?.data;
};

export const post = async (url, data, header?: any, isMock?: boolean) => {
  const globalState = store.getState();
  if (!globalState.userStore.zxInfo?.zxuid) {
    await handleLogin();
  }
  let params = { url, data, header, isMock };
  const res = await baseOptions(params, "POST");
  return res?.data;
};

class httpRequest {
  baseOptions(params, method) {
    const zxtoken = getStorageSync("zxtoken");
    let { url, data, header = {}, isMock = false } = params;
    const isPost = methods.POST === method;

    const option = {
      url: !isMock ? BASE_URL + url : "url",
      data: isPost ? JSON.stringify(data) : data,
      method: isPost ? "POST" : "GET",
      timeout: 20000, // 超时时间
      header: {
        "content-type": "application/json",
        // 'Authorization': Taro.getStorageSync('Authorization'),
        zxtoken,
        ...header,
      },
      success: function (res) {
        if (res?.data?.success) {
          return res.data;
        }

        if (res?.data?.success === false) {
          Taro.showToast({ title: res?.data?.errMsg || "接口异常！" });
        }
        return Promise.resolve(res?.data);
      },
      fail: function (error) {
        Taro.showToast({ title: JSON.stringify(error) });
        return Promise.reject(error);
      },
    };

    return Taro.request(option);
  }

  get = async (url, data, isMock?: boolean) => {
    let option = { url, data, isMock };
    const res = await this.baseOptions(option);
    return res?.data;
  };

  post = async (url, data, header?: any, isMock?: boolean) => {
    let params = { url, data, header, isMock };
    const res = await this.baseOptions(params, "POST");
    return res?.data;
  };

  put = async (url, data = "") => {
    let option = { url, data };
    const res = await this.baseOptions(option, "PUT");
    return res?.data;
  };

  delete = async (url, data = "") => {
    let option = { url, data };
    const res = await this.baseOptions(option, "DELETE");
    return res?.data;
  };
}

const request = new httpRequest();

// export const get = request.get;
// export const post = request.post;
export default request;
