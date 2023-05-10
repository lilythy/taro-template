export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/test/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '模版',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    list: [
      {
        pagePath: "pages/index/index",
        selectedIconPath: "resource/home_selected.png",
        iconPath: "resource/home.png",
        text: "工作台"
      },
      {
        pagePath: "pages/test/index",
        selectedIconPath: "resource/data_selected.png",
        iconPath: "resource/data.png",
        text: "项目池"
      }
    ]
  }
})
