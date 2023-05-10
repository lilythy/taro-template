import { getType } from "../index";
import ApiRequest from "@/api/request";
import { oss } from "@/api/modules/common";
import Taro from "@tarojs/taro";
// import { getAppIdSync } from '@tarojs/taro';

export const corpId = dd.corpId;

const appIdRes = dd.getAppIdSync();
export const appId = appIdRes.appId;

export const getAuthCode = (count = 10) => {
  return new Promise((resolve, reject) => {
    dd.getAuthCode({
      success: function (res) {
        // Taro.showModal({ title: res?.authCode });
        resolve(res?.authCode);
        /*{
              authCode: 'hYLK98jkf0m' //string authCode
          }*/
      },
      fail: function (err) {
        // Taro.showModal({ title: JSON.stringify(err) });
        reject(err);
      },
    });
  });
};

export const setStorageSync = (key, data) => {
  if (getType(key) === "object") {
    return Object.keys(key).map((itemKey) => {
      return dd.setStorageSync({ key: itemKey, data: key[itemKey] });
    });
  }
  return dd.setStorageSync({ key, data });
};

export const getStorageSync = (key) => {
  if (getType(key) === "array") {
    return key.map(
      (i) =>
        dd.getStorageSync({
          key: i,
        }).data
    );
  }
  return dd.getStorageSync({
    key,
  }).data;
};

export const clearStorageSync = () => {
  return dd.clearStorageSync();
};

export const showActionSheet = (options) => {
  dd.showActionSheet({ ...options, cancelButtonText: "取消" });
};

export const showCallMenu = (options) => {
  dd.showCallMenu({
    code: "+86", // 国家代号，中国是+86
    showDingCall: true, // 是否显示钉钉电话
    success: function (res) {},
    fail: function (err) {},
    ...options,
  });
};

export const chooseUser = (options?: any) => {
  return new Promise((resolve) => {
    dd.complexChoose({
      title: "选人", //标题
      multiple: false, //是否多选
      responseUserOnly: true, //返回人，或者返回人和部门
      success: function (res) {
        resolve(res);
      },
      ...options,
    });
  });
};

export const chooseImage = (count = 10) => {
  return new Promise((resolve) => {
    dd.chooseImage({
      count,
      success: ({ filePaths }) => {
        resolve(filePaths);
      },
    });
  });
};

export const chooseVideo = (duration = 60) => {
  return new Promise((resolve) => {
    dd.chooseVideo({
      sourceType: ["album", "camera"],
      maxDuration: duration,
      success: (res) => {
        resolve(res.filePath);
      },
      // fail: (err)=> {
      //   console.log(err)
      // }
    });
  });
};

export const chooseDingTalk = () => {
  return new Promise((resolve, reject) => {
    dd.uploadAttachmentToDingTalk({
      image: { multiple: true, compress: false, max: 9, spaceId: "7502312049" },
      space: { spaceId: "7502312049", isCopy: 1, max: 9 },
      file: { spaceId: "7502312049", max: 9 },
      types: ["photo", "camera", "file", "space"], //PC端仅支持["photo","file","space"]
      success: (res) => {
        console.log("res--", res.data);
        resolve(res.data);
      },
      fail: (err) => {
        reject(err);
        // dd.alert({
        //     content:JSON.stringify(err)
        // })
      },
    });
  });
};

export const uploadFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const filename = filePath.split("/").pop();
    ApiRequest.post(oss, { filename }).then((res) => {
      const { fileName, accessid, dir, policy, signature, callback } = res;
      const formData: any = {
        fileName,
        key: dir,
        policy,
        OSSAccessKeyId: accessid,
        signature,
      };

      if (formData.key.indexOf(".") === -1) {
        formData.key = dir + fileName;
      }
      if (callback) {
        formData.callback = callback;
      }

      console.log({
        url: res.host,
        fileType: "image",
        fileName: "file",
        filePath,
        formData,
      });
      dd.uploadFile({
        url: res.host,
        fileType: "image",
        fileName: "file",
        filePath,
        formData,
        header: {
          "Content-Type": "multipart/form-data;",
        },
        success: ({ data }) => {
          try {
            const { url, id } = JSON.parse(data)?.data || {};
            if (url) {
              resolve({
                url,
                id,
              });
            } else {
              reject("上传失败");
            }
          } catch (error) {
            reject(error || "上传失败");
          }
        },
        fail: (error) => {
          reject(error || "上传失败");
        },
      });
    });
  });
};

export const openLink = (url = "") => {
  if (!url) {
    Taro.showModal({ title: "跳转url不能为空" });
    return;
  }
  dd.openLink({
    url,
    fail: (err) => Taro.showModal({ title: JSON.stringify(err) }),
  });
};

export const downloadFile = (url) => {
  Taro.downloadFile({
    url: url,
    success: function (res) {
      // @ts-ignore
      dd.saveVideoToPhotosAlbum({
        filePath: res.tempFilePath,
        success: (res) => {
          setTimeout(() => {
            Taro.showToast({ title: "保存成功" });
            // Taro.navigateBack({
            //   delta: 3,
            // });
          }, 1000);
        },
        fail: (res) => {
          console.log("保存失败", res);
        },
      });
    },
    fail: (res) => {
      console.log("发生异常", res);
    },
  });
};
