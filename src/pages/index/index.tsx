import { useDidShow } from "@tarojs/taro";
import { View, ScrollView, Image } from "@tarojs/components";
import { AtTabs, AtTabsPane, AtDivider, AtFab } from "taro-ui";
import React, { useEffect, useState } from "react";
import { test } from "@/api/modules/home";
import { get } from "@/api/request";
import * as dayjs from "dayjs";
import addIcon from "@/resource/add.png";
import ScrollPage from "@/components/scrollView";
import { connect } from "react-redux";
import "./index.less";

interface IBlock {
  open: boolean;
  data: any;
}

const WorkBench = (props) => {
  const { userStore } = props;
  const { zxInfo } = userStore;
  const [current, setCurrent] = useState(0); // 当前tab
  const [params, setParams] = useState({ pageNo: 1, pageSize: 10 });
  const [dataRes, setDataRes] = useState({});
  const [projectList, setProjectList] = useState<any[]>([]);
  const [planDateList, setPlanDateList] = useState<any[]>([]);

  const tabList = [
    { title: "我的项目" },
    { title: "我的客户" },
    { title: "工作计划" },
    { title: "周报" },
  ];

  const handleClick = (value) => {
    setParams({ ...params, pageNo: 1 });
    setCurrent(value);
    doRequest(value, { pageNo: 1 });
  };

  // 获取我的项目列表
  const getProjectList = async (newParams?: any, attach?: boolean) => {
    try {
      setParams({ ...params, ...(newParams || {}) });
      const { data = {}, success } = await get(test, {
        checkUserId: zxInfo?.zxuid,
        ...params,
        ...(newParams || {}),
      });
      if (success) {
        setDataRes(data);
        const rows = data?.rows || [];
        if (attach) {
          setProjectList([...projectList, ...rows]);
        } else {
          setProjectList(rows);
        }
      } else {
        setProjectList([]);
      }
    } catch (error) {
      //
    }
  };
  const doRequest = (cur?: any, newParam?: any) => {
    if ([undefined, null].includes(cur)) {
      cur = current;
    }

    switch (cur) {
      case 0:
        getProjectList(newParam);
        break;
      case 1:
        // getContactList(newParam);
        break;
      case 2:
        // getPlanList();
        break;
      case 3:
        // getReport();
        break;
    }
  };

  useDidShow(() => {
    if (planDateList?.length) {
      doRequest(null, { pageNo: 1 });
    }
  });

  useEffect(() => {
    if (zxInfo?.zxuid) {
      doRequest(current);
    }
  }, [zxInfo?.zxuid]);

  return (
    <View className="workbench-wrap">
      <AtTabs
        current={current}
        tabList={tabList}
        onClick={handleClick}
        swipeable={false}
      >
        <AtTabsPane current={current} index={0}>
          <ScrollPage
            className="list-scrollview"
            dataResult={dataRes}
            onScrollEnd={() => getProjectList({}, true)}
          >
            <View>
            projectList
              {(projectList || []).map((item: any) => (
                <View>{item?.id}</View>
              ))}
            </View>
          </ScrollPage>
        </AtTabsPane>
        <AtTabsPane current={current} index={1}>
          <ScrollPage
            className="list-scrollview"
            dataResult={dataRes}
            // onScrollEnd={() => getContactList({}, true)}
          >
            <View>
              {[].map((item: any) => (
                <View>{item?.id}</View>
              ))}
            </View>
          </ScrollPage>
        </AtTabsPane>
        <AtTabsPane current={current} index={2}>
          <ScrollView scrollY className="tab-plan-scroll">
            <View className="time-line-wrap">
              <View className="time-line-bottom">
                {[...new Array(25)].map((item, idx) => (
                  <View className="time-line-item">
                    <View>
                      {idx < 10 ? `0${idx}` : idx === 24 ? "00" : idx}:00
                    </View>
                    <AtDivider content="" />
                  </View>
                ))}
              </View>

              {[].map((item: any, idx) => (
                <View className="activity-item">
                  <View className="activity-content">
                    {item?.followUpPlanVO?.planFollowUpContent || ""}
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </AtTabsPane>
        <AtTabsPane current={current} index={3}>
          <ScrollView scrollY className="report-scrollview">
            <View className="at-article">
              <View className="at-article__2">当前工作汇总：</View>
              <View className="at-article__2 future-plan-title">
                未来工作计划
              </View>
            </View>
          </ScrollView>
        </AtTabsPane>
      </AtTabs>

      {current !== 3 && (
        <AtFab className="add-btn">
          <Image className="add-icon" src={addIcon} />
        </AtFab>
      )}
    </View>
  );
};

export default connect((store: any) => ({ userStore: store.userStore }))(
  WorkBench
);
