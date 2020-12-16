import { login } from '../../api/logAndReg'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLoging: false,
    account: null,
    password: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideHomeButton()
  },
  //
  handleForm(e) {
    const name = e.currentTarget.dataset.type
    this.setData({
      [name]: e.detail.value
    })
  },
  // 处理登陆
  handleLogin() {
    const { account, password } = this.data
    if (!account) {
      app.toastFail('请输入账户')
    } else if (!password) {
      app.toastFail('请输入密码')
    } else {
      this.setData({
        isLoging: true
      })
      login(account, password)
        .then((res) => {
          this.setData({
            isLoging: false
          })
          wx.setStorageSync('token', res.data.mytoken.token)
          app.globalData.isLogin = true
          wx.switchTab({
            url: '/pages/index/index'
          })
        })
        .catch((err) => {
          console.log('err', err)
          this.setData({
            isLoging: false
          })
        })
    }
  },
  handleRegist() {
    wx.navigateTo({
      url: '/pages/regist/regist'
    })
  },
  //
  forgetPsd() {
    wx.navigateTo({
      url: '/pages/forgetPsd/forgetPsd'
    })
  }
})
