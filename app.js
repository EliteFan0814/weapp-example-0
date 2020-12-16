import { getNearbyOrder, postLocationInfo } from './api/index'
import wxPosition from './utils/authPosition'

App({
  onLaunch: function (options) {
    // 登录
    wx.login({
      success: (res) => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: (res) => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    //检查新版本
    this.checkNewVersion()
  },
  onShow() {
    this.routerToLogin() // 检查是否登陆
    this.checkOrderLoop() // 轮询可接订单
  },
  // 将小程序切为后台时
  onHide: function () {
    // 切为后台时停止轮询查找订单
    // clearInterval(this.globalData.orderLoopTimer)
  },
  globalData: {
    userInfo: null,
    orderLoopTimer: null,
    loopTime: 5000, // 轮询间隔（毫秒）
    indexLoopTime: 3000, //首页获取间隔（毫秒）
    isLogin: wx.getStorageSync('token') ? true : false,
    isGetPositionAuth: null, // 是否获取定位授权
    isWorking: null,
    latestOrderWrap: null, //订单所有信息
    latestOrderInfo: [], // 订单信息
    latestLongitude: null,
    latestLatitude: null,
    isArrivedLoginBefore: false,
    upImgUrl: 'https://xiaochengxu.wgywkm.com/worker/image/upload', // 小程序图片上传地址
    capsuleToTop: wx.getSystemInfoSync()['statusBarHeight'] + 6 //胶囊按钮距离顶部距离= 手机导航栏的高度(px)+6px
  },
  // 检查新版本
  checkNewVersion() {
    // 检测新版本，提示是否马上应用
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log('新版本信息',res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })
  },
  // 检测是否登陆，未登录跳转登录
  routerToLogin() {
    const { isLogin } = this.globalData
    if (!isLogin) {
      //没有登录就跳转至登录页面
      if (!this.globalData.isArrivedLoginBefore) {
        wx.redirectTo({
          url: '/pages/login/login',
          success: () => {
            this.globalData.isArrivedLoginBefore = true
          }
        })
      }
    }
  },
  // 轮询发送位置信息 并查找附近订单
  checkOrderLoop() {
    console.log('this.globalData.isWorking', this.globalData.isWorking)
    clearInterval(this.globalData.orderLoopTimer)
    this.globalData.orderLoopTimer = setInterval(() => {
      if (this.globalData.isLogin && this.globalData.isWorking) {
        console.log('working')
        getNearbyOrder()
          .then((res) => {
            // if (res.data.info.item !== null) {
            if (res.data.info.item.length) {
              this.globalData.latestOrderWrap = res.data.info
              this.globalData.latestOrderInfo = res.data.info.item
              // this.globalData.latestOrderInfo = [res.data.info]
              // console.log('this.globalData.latestOrderInfo',this.globalData.latestOrderInfo)
            }
          })
          .catch(() => {})
        this.getPosition()
      } else {
        console.log('no working')
      }
    }, this.globalData.loopTime)
  },
  // 轮询获取位置信息
  async getPosition() {
    try {
      // 如果首页获取定位权限才进行轮询发送定位
      if (this.globalData.isGetPositionAuth) {
        const positionInfo = await wxPosition.asyncGetPosition()
        if (positionInfo) {
          console.log('loop', positionInfo)
          this.globalData.latestLongitude = positionInfo.longitude
          this.globalData.latestLatitude = positionInfo.latitude
          postLocationInfo(this.globalData.latestLongitude, this.globalData.latestLatitude)
        }
      }
    } catch (err) {
      console.log('轮询定位失败')
    }
  },
  // 小程序原生提示
  wxToast(title, icon = 'none', duration = 1500) {
    wx.showToast({
      title,
      icon,
      duration
    })
  },
  //失败提示
  toastFail(e) {
    wx.showToast({
      title: e,
      icon: 'none'
    })
  },
  //成功提示
  toastSuccess(e) {
    wx.showToast({
      title: e
    })
  },
  // input双向绑定
  setData(e, _this) {
    const name = e.currentTarget.dataset.name
    _this.setData({
      // e.detail.value为小程序原生 input 返回值 e.detail 为 vant 返回值
      [name]: typeof e.detail.value == 'undefined' ? e.detail : e.detail.value
    })
  },
  // 小程序上传图片
  wxUpImg(number = 1) {
    const that = this
    return new Promise((resolve, reject) => {
      wx.chooseImage({
        count: number,
        success(res) {
          const tempFilePaths = res.tempFilePaths
          wx.uploadFile({
            url: that.globalData.upImgUrl,
            filePath: tempFilePaths[0],
            name: 'file',
            formData: {
              user: 'test'
            },
            success(res) {
              const data = JSON.parse(res.data)
              resolve(data)
            },
            fail(err) {
              reject(err)
            }
          })
        }
      })
    })
  }
})
