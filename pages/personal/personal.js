import { getInfo } from '../../api/personal'
const app = getApp()
Page({
  data: {
    list: [
      {
        label: '师傅协议',
        icon: '../../static/img/personal/info.png',
        path: 'noticeDetail'
      },
      {
        label: '平台公告',
        icon: '../../static/img/personal/notice.png',
        path: 'notice'
      }
      // {
      //   label: '联系客服',
      //   icon: '../../static/img/tel.png',
      //   path: 'LevelList'
      // },
    ],
    info: {
      amount: 0,
      cash_finish: 0
    },
    param: {}
  },
  onLoad: function () {},
  onShow: function () {
    this.getInfo()
  },
  onPullDownRefresh: function () {
    this.getInfo()
  },
  getInfo() {
    getInfo().then((res) => {
      const { info, param } = res.data
      this.setData({
        info,
        param
      })
      wx.stopPullDownRefresh()
    })
  },
  changeInfo() {
    wx.navigateTo({
      // url: `/pages/changeInfo/changeInfo?info=${JSON.stringify(this.data.info)}`
      url: `/pages/changeInfo/changeInfo?name=${this.data.info.realname}&thumb=${this.data.info.thumb}&phone=${this.data.info.account}&thumb_str=${this.data.info.picurl}`
    })
  },
  goLogin() {
    wx.navigateTo({
      url: `/pages/login/login`
    })
  },
  async goBill() {
    wx.navigateTo({
      url: `/pages/bill/bill`
    })
  },
  async goWithdraw() {
    wx.navigateTo({
      url: `/pages/withdraw/withdraw`
    })
  },
  async goWithdrawRecord() {
    wx.navigateTo({
      url: `/pages/withdraw/withdrawRecord?state=3`
    })
  },
  async open(e) {
    const { path } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/notice/${path}`
    })
  },
  async contact() {
    wx.makePhoneCall({
      phoneNumber: this.data.param.kefu,
      success(res) {},
      fail(err) {}
    })
  },
  signOut() {
    wx.showModal({
      title: '提示',
      content: '确定退出登录吗？',
      success: function (res) {
        if (res.confirm) {
          wx.reLaunch({ url: '/pages/login/login' })
          app.globalData.isLogin = false
          wx.clearStorageSync()
        }
      }
    })
  }
})
