import wxPosition from '../../utils/authPosition'
import { getUserInfo, exchangeSwitch, agreeNowOrder, refuseNowOrder } from '../../api/index'
const app = getApp()

Page({
  data: {
    capsuleToTop: app.globalData.capsuleToTop,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isGetPositionAuth: false,
    latitude: null,
    longitude: null,
    isLogin: app.globalData.isLogin,
    isWorking: false,
    popupLoopTimer: null,
    isGetLatestOrder: false,
    isWaittingReceive: false, // 是否正在展示一个待接订单
    latestOrderWrap: null,
    latestOrderAlbum: [],
    latestOrder: null,
    isReceiving: false,
    isRefusing: false,
    showDialog: false
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.getPositionAuth()
    // this.getWxUserInfoSilent()
  },
  onShow: function () {
    this.setData({
      isLogin: app.globalData.isLogin
    })
    if (this.data.isLogin) {
      this.getUserInfo()
      this.popupDialogLoop()
    }
  },
  // 下拉刷新获取最新订单(备选方案，勿删)
  // onPullDownRefresh: function () {
  //   this.byPullDownGetLatestOrderInfo() // 通过下拉方式获取最新订单
  //   wx.stopPullDownRefresh() //停止下拉刷新
  // },

  // 方法
  // 获取用户信息,从中取得开工状态
  getUserInfo() {
    getUserInfo()
      .then((res) => {
        app.globalData.isWorking = !!res.data.info.is_open
        this.setData({
          isWorking: !!res.data.info.is_open
        })
      })
      .catch(() => {})
  },
  // 是否获取定位权限
  async getPositionAuth() {
    const positionInfo = await wxPosition.asyncGetPosition()
    if (positionInfo) {
      console.log(positionInfo)
      app.globalData.isGetPositionAuth = true
      this.setData({ isGetPositionAuth: true, latitude: positionInfo.latitude, longitude: positionInfo.longitude })
    } else {
      app.globalData.isGetPositionAuth = false
      this.setData({ isGetPositionAuth: false })
    }
  },
  // 未授权定位则打开授权设置页面
  showAuthPosition() {
    if (!this.data.isGetPositionAuth) {
      wxPosition.isAuthPosition().then((res) => {
        if (res) {
          app.globalData.isGetPositionAuth = true
          this.setData({ isGetPositionAuth: true })
        }
      })
    } else if (!this.data.isLogin) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
  },
  // 通过下拉方式获取最新订单
  byPullDownGetLatestOrderInfo() {
    if (!this.data.isWorking || !this.data.isLogin) {
      app.toastFail('请确认登陆并开启开业按钮')
    } else {
      if (app.globalData.latestOrderInfo.length) {
        this.setData({
          isGetLatestOrder: true,
          latestOrder: app.globalData.latestOrderInfo[0]
        })
      } else {
        app.wxToast('暂无新订单')
        this.setData({
          isGetLatestOrder: false
        })
      }
    }
  },
  // 通过主动弹出获取最新订单
  // getLatestOrderInfo() {
  //   if (!this.data.isWorking || !this.data.isLogin) {
  //     // app.toastFail('请确认登陆并开启开业按钮')
  //   } else {
  //     if (app.globalData.latestOrderInfo.length) {
  //       this.setData({
  //         isGetLatestOrder: true,
  //         isWaittingReceive: true,
  //         latestOrder: app.globalData.latestOrderInfo[0]
  //       })
  //     } else {
  //       // app.wxToast('暂无新订单')
  //       this.setData({
  //         isGetLatestOrder: false
  //       })
  //     }
  //   }
  // },
  // 轮询弹出最新订单
  popupDialogLoop() {
    clearInterval(this.data.popupLoopTimer)
    this.data.popupLoopTimer = setInterval(() => {
      if (!this.data.isWorking || !this.data.isLogin) {
        // app.toastFail('请确认登陆并开启开业按钮')
      } else {
        if (app.globalData.latestOrderInfo.length) {
          if (!this.data.isWaittingReceive) {
            this.setData({
              isGetLatestOrder: true,
              isWaittingReceive: true,
              latestOrder: app.globalData.latestOrderInfo[0],
              latestOrderWrap: app.globalData.latestOrderWrap,
              latestOrderAlbum: app.globalData.latestOrderWrap.album.slice(0, 3)
            })
          }
        } else {
          // app.wxToast('暂无新订单')
          this.setData({
            isGetLatestOrder: false
          })
        }
      }
      // if (this.data.isGetLatestOrder) {
      // }
    }, app.globalData.indexLoopTime)
  },
  // 改变开工状态
  changeWorkStyle() {
    exchangeSwitch(!this.data.isWorking ? 1 : 0, this.data.longitude, this.data.latitude)
      .then((res) => {
        app.globalData.isWorking = !this.data.isWorking
        this.setData({
          isWorking: !this.data.isWorking
        })
        // 如果是歇业状态则关闭获取订单
        if (!this.data.isWorking) {
          this.setData({
            isGetLatestOrder: false
            // latestOrder: app.globalData.latestOrderInfo[0]
          })
        }
      })
      .catch(() => {})
  },
  //  同意接单
  receiveOrder() {
    this.setData({
      isReceiving: true
    })
    agreeNowOrder(this.data.latestOrder.order_id)
      .then(() => {
        // 接单成功
        this.setData({
          isReceiving: false,
          showDialog: true
          // isWaittingReceive: false
        })
      })
      .catch(() => {
        this.setData({
          isReceiving: false,
          showDialog: false,
          isWaittingReceive: false
        })
      })
  },
  // 拒绝接单
  refuseOrder() {
    this.setData({
      isRefusing: true
    })
    refuseNowOrder(this.data.latestOrder.order_id)
      .then((res) => {
        app.globalData.latestOrderInfo = []
        this.setData({
          isRefusing: false,
          isGetLatestOrder: false,
          showDialog: false,
          isWaittingReceive: false
          // latestOrder: app.globalData.latestOrderInfo[0]
        })
        app.wxToast('已拒绝接单')
      })
      .catch(() => {
        this.setData({
          isRefusing: false,
          isGetLatestOrder: false,
          isWaittingReceive: false
        })
      })
  },
  // 关闭接单成功弹窗
  closeDialog() {
    console.log('close')
    app.globalData.latestOrderInfo = []
    this.setData({
      showDialog: false,
      isWaittingReceive: false
    })
    wx.navigateTo({
      url: '/pages/order/order'
    })
  },
  // 静默获取用户的微信个人信息
  getWxUserInfoSilent() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: (res) => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  // 获取用户的微信个人信息
  getWxUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
