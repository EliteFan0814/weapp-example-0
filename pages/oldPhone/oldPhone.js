const app = getApp()
import {
  chkPhone,
  sendVerify
} from '../../api/personal'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    time: true,
    flogs: false,
    count: 0,
    timer: 0,
    verify: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      phone: options.phone,
    })
  },
  // input
  setinputval(e) {
    app.setData(e, this)
  },
  // 确认验证
  onyanzheng() {
    if (!this.data.phone) {
      return app.toastFail('请输入正确手机号')
    }else if (!this.data.verify) {
      return app.toastFail('请输入验证码')
    }else{
      chkPhone({
        phone: this.data.phone,
        verify: this.data.verify,
      }).then((res) => {
        console.log(res);
        if (res.code == 1) {
          // app.countdown(this, 'true')
          this.setData({
            flogs: true,
          })
          wx.navigateTo({
            url: '/pages/newPhone/newPhone',
          })
        } else {
          app.toastFail(res.msg)
        }
      }).catch(err => {
        app.toastFail(err.msg)
      })
    }
  },
  // 发送验证码
  returncode(e) {
    this.setData({
      flogs: false,
    })
    app.countdown(this)
  },
  //倒计时
  verbutton() {
    this.setData({
      time: false,
      timer: 60,
    })
    let interval = setInterval(() => {
      if (this.data.timer > 1) {
        this.setData({
          time: false,
          timer: this.data.timer - 1,
        })
      } else {
        this.setData({
          time: true,
        })
        clearInterval(interval)
      }
    }, 1000)
  },
  sendVerify() {
    sendVerify({
      phone: this.data.phone,
      check: 1,
    }).then((res) => {
      if (res.code == 1) {
        this.verbutton()
        app.toastSuccess('发送成功')
      } else {
        app.toastFail(res.msg)
      }
    })
  },
})