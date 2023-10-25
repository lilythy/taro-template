const mapV2Message = '客户端版本过低，请升级客户端并开启V2引擎。';

const markers = [
  {
    id: 0,
    latitude: 30.266786,
    longitude: 120.10675,
    width: 19,
    height: 31,
    iconPath: '/image/mark_bs.png',
    callout: {
      content: 'callout'
    }
  }
];

const animMarker = [
  {
    id: 1,
    latitude: 30.266786,
    longitude: 120.10675,
    width: 19,
    height: 31,

    iconPath: '/image/mark_bs.png',

    fixedPoint: {
      originX: 200,
      originY: 150
    },
    markerLevel: 2
  }
];

const labelMarker = [
  {
    id: 2,
    latitude: 30.266786,
    longitude: 120.10675,
    width: 19,
    height: 31,
    iconPath: '/image/mark_bs.png',
    label: {
      content: 'Hello Label',
      color: '#00FF00',
      fontSize: 14,
      borderRadius: 3,
      bgColor: '#ffffff',
      padding: 10
    },
    markerLevel: 2
  }
];
const customCalloutMarker = [
  {
    id: 3,
    latitude: 30.266786,
    longitude: 120.10675,
    width: 19,
    height: 31,
    iconPath: '/image/mark_bs.png',
    customCallout: {
      type: 2,
      descList: [
        {
          desc: '预计',
          descColor: '#333333'
        },
        {
          desc: '5分钟',
          descColor: '#108EE9'
        },
        {
          desc: '到达',
          descColor: '#333333'
        }
      ],
      isShow: 1
    },
    markerLevel: 2
  }
];

const iconAppendStrMarker = [
  {
    id: 34,
    latitude: 30.266786,
    longitude: 120.10675,
    width: 19,
    height: 31,
    iconAppendStr: 'iconAppendStr',
    markerLevel: 2
  }
];

var myTrafficEnabled = 0;
var myCompassEnabled = 0;
var myScaleEnabled = 0;
var myGestureEnabled = 0;

const longitude = 120.10675;
const latitude = 30.266786;
const includePoints = [
  {
    latitude: 30.266786,
    longitude: 120.10675
  }
];

Page({
  data: {
    scale: 14,
    longitude,
    latitude,
    includePoints,
    mapV2Enable: dd.canIUse('map.optimize')
  },
  onReady() {
    // 使用 dd.createMapContext 获取 map 上下文
    this.mapCtx = dd.createMapContext('map');
  },
  demoResetMap() {
    this.setData({
      scale: 14,
      longitude,
      latitude,
      includePoints,
      groundOverlays: [],
      circles: [],
      polygon: [],
      polyline: []
    });
    if (dd.canIUse('createMapContext.return.clearRoute')) {
      this.mapCtx.clearRoute();
    }
  },
  demoGetCenterLocation() {
    if (dd.canIUse('createMapContext')) {
      this.mapCtx.getCenterLocation({
        success: res => {
          dd.alert({
            content:
              'longitude:' + res.longitude + '\nlatitude:' + res.latitude + '\nscale:' + res.scale
          });
          console.log(res.longitude);
          console.log(res.latitude);
          console.log(res.scale);
        }
      });
    }
  },
  demoMoveToLocation() {
    if (dd.canIUse('createMapContext')) {
      this.mapCtx.moveToLocation();
    }
  },
  demoMarkerAnimation() {
    if (!dd.canIUse('createMapContext.return.updateComponents')) {
      dd.alert({
        title: '不支持',
        content: mapV2Message
      });
      return;
    }
    this.mapCtx.updateComponents({
      markers: animMarker
    });
    this.mapCtx.updateComponents({
      command: {
        markerAnim: [{markerId: 1, type: 0}]
      }
    });
  },
  demoMarkerLabel() {
    if (!dd.canIUse('createMapContext.return.updateComponents')) {
      dd.alert({
        title: '不支持',
        content: mapV2Message
      });
      return;
    }
    this.mapCtx.updateComponents({
      scale: 14,
      longitude,
      latitude,
      includePoints,
      markers: labelMarker
    });
  },
  demoMarkerCustomCallout() {
    if (!dd.canIUse('createMapContext.return.updateComponents')) {
      dd.alert({
        title: '不支持',
        content: mapV2Message
      });
      return;
    }
    this.mapCtx.updateComponents({
      scale: 14,
      longitude,
      latitude,
      includePoints,
      markers: customCalloutMarker
    });
  },
  demoMarkerAppendStr() {
    if (!dd.canIUse('createMapContext.return.updateComponents')) {
      dd.alert({
        title: '不支持',
        content: mapV2Message
      });
      return;
    }
    this.mapCtx.updateComponents({
      scale: 14,
      longitude,
      latitude,
      includePoints,
      markers: iconAppendStrMarker
    });
  },
  demoTrafficOverlay() {
    if (!dd.canIUse('createMapContext.return.updateComponents')) {
      dd.alert({
        title: '不支持',
        content: mapV2Message
      });
      return;
    }
    myTrafficEnabled = (myTrafficEnabled + 1) % 2;
    this.mapCtx.updateComponents({setting: {trafficEnabled: myTrafficEnabled}});
  },
  demoShowRoute() {
    if (!dd.canIUse('createMapContext.return.showRoute')) {
      dd.alert({
        title: '不支持',
        content: mapV2Message
      });
      return;
    }
    this.mapCtx.showRoute({
      startLat: 30.257839,
      startLng: 120.062726,
      endLat: 30.256718,
      endLng: 120.059985,
      zIndex: 4,
      routeColor: '#FFB90F',
      iconPath: '/image/map_alr.png',
      iconWidth: 10,
      routeWidth: 10
    });
  },
  demoCompass() {
    if (dd.canIUse('createMapContext')) {
      myCompassEnabled = (myCompassEnabled + 1) % 2;
      this.mapCtx.showsCompass({isShowsCompass: myCompassEnabled});
    }
  },
  demoScale() {
    if (dd.canIUse('createMapContext')) {
      myScaleEnabled = (myScaleEnabled + 1) % 2;
      this.mapCtx.showsScale({isShowsScale: myScaleEnabled});
    }
  },
  demoGesture() {
    if (dd.canIUse('createMapContext')) {
      myGestureEnabled = (myGestureEnabled + 1) % 2;
      this.mapCtx.gestureEnable({isGestureEnable: myGestureEnabled});
    }
  },
  demoPolyline() {
    if (!dd.canIUse('map.polyline')) {
      dd.alert({
        title: '不支持',
        content: mapV2Message
      });
      return;
    }
    this.setData({
      scale: 16,
      longitude,
      latitude,
      polyline: [
        {
          points: [
            {
              // 右上
              latitude: 30.264786,
              longitude: 120.10775
            },
            {
              // 左下
              latitude: 30.268786,
              longitude: 120.10575
            }
          ],
          color: '#FF0000DD',
          width: 10,
          dottedLine: false,
          iconPath: '/image/map_alr.png',
          iconWidth: 10
        }
      ]
    });
  },
  demoPolygon() {
    if (!dd.canIUse('map.polygon')) {
      dd.alert({
        title: '不支持',
        content: mapV2Message
      });
      return;
    }
    this.setData({
      scale: 16,
      longitude,
      latitude,
      polygon: [
        {
          points: [
            {
              // 右上
              latitude: 30.264786,
              longitude: 120.10775
            },
            {
              // 右下
              latitude: 30.268786,
              longitude: 120.10775
            },
            {
              // 左下
              latitude: 30.268786,
              longitude: 120.10575
            },
            {
              // 左上
              latitude: 30.264786,
              longitude: 120.10575
            }
          ],
          fillColor: '#BB0000DD',
          width: 5
        }
      ]
    });
  },
  demoCircle() {
    if (!dd.canIUse('map.circles')) {
      dd.alert({
        title: '不支持',
        content: mapV2Message
      });
      return;
    }
    this.setData({
      scale: 16,
      longitude,
      latitude,
      circles: [
        {
          longitude,
          latitude,
          color: '#BB76FF88',
          fillColor: '#BB76FF33',
          radius: 100,
          strokeWidth: 3
        }
      ]
    });
  },
  regionchange(e) {
    console.log('regionchange', e);
  },
  markertap(e) {
    console.log('marker tap', e);
  },
  controltap(e) {
    console.log('control tap', e);
  },
  tap() {
    console.log('tap');
  },
  callouttap(e) {
    console.log('callout tap', e);
  }
});
