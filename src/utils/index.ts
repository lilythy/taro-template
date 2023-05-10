import Taro from "@tarojs/taro";

import { devMiniAppIds } from "@/constants";
// @ts-ignore
import { appId, openLink } from "@/utils/platsUtils/index";

export const BASE_URL = devMiniAppIds.includes(appId)
  ? "https://khb-dev.zxhy.com"
  : "https://khb.zxhy.com";

// 获取类型
export function getType(val) {
  return Object.prototype.toString
    .call(val)
    .toLocaleLowerCase()
    .slice(8, -1);
}

export const isFun = arg => typeof arg === "function";

export const doFun = (fun, ...args) => {
  return isFun(fun) ? fun(...args) : undefined;
};

const getRandom = (min: number, max: number) =>
  Math.round(Math.random() * (max - min) + min);

// 生成6位数字、大小写字母随机码
export const getCodeV6 = () => {
  let code = "";
  for (let i = 0; i < 6; i++) {
    const type = getRandom(1, 3);
    switch (type) {
      case 1:
        code += String.fromCharCode(getRandom(48, 57)); // 数字
        break;
      case 2:
        code += String.fromCharCode(getRandom(65, 90)); // 大写字母
        break;
      case 3:
        code += String.fromCharCode(getRandom(97, 122)); // 小写字母
        break;
      default:
      //
    }
  }
  return code;
};

/**
 * 选择器获取节点
 */
export const getGraphList = className => {
  const query = Taro.createSelectorQuery();
  return new Promise(resolve => {
    query
      .selectAll(className)
      .boundingClientRect()
      .exec(rect => {
        resolve(rect[0] || []);
      });
  });
};

interface Cascader {
  label: string | number;
  value: string;
  children?: [];
}

// 获取上周日的日期，如果当前时间是周日，则返回当前日期
export const getSundayDate = date => {
  if (new Date(date).getDay() === 0) return new Date(date);
  let sunday = new Date();
  sunday.setDate(date.getDate() - (date.getDay() || 7));
  return sunday;
};

export const systemInfo = (() => {
  return Taro.getSystemInfoSync();
})();

// 获取屏幕宽度
export function getPageHeight(hideTitleBar: boolean = false) {
  const info: any = systemInfo;

  const {
    windowHeight,
    windowWidth,
    model,
    statusBarHeight,
    titleBarHeight = 0
  } = info;

  return {
    height:
      windowHeight + (hideTitleBar ? statusBarHeight + titleBarHeight : 0),
    statusBarHeight,
    info,
    model,
    width: windowWidth
  };
}

export const jumpTo = async (url = "", type = "navigateTo", params = {}) => {
  const { platform } = systemInfo;
  let newUrl = url;
  if (type === "openLink") {
    return openLink(
      /ios/i.test(platform) || url.indexOf(`${BASE_URL}/link`) > -1
        ? url
        : `${BASE_URL}/link?url=${encodeURIComponent(url)}`
    );
  }
  if (url.startsWith("http")) {
    newUrl = `/pages/webview/index?url=${encodeURIComponent(
      encodeURIComponent(url.replace("http://", "https://"))
    )}`;
  }

  if (Object.keys(params).length > 0) {
    const paramsStr = Object.keys(params).reduce((curr, item) => {
      return `${curr}${curr ? "&" : ""}${item}=${params[item]}`;
    }, "");
    newUrl += `${newUrl.indexOf("?") > 0 ? "&" : "?"}${paramsStr}`;
  }

  Taro[type]({
    url: newUrl,
    fail: () => {
      Taro.navigateTo({ url: "/pages/home/index" });
    }
  });
};
