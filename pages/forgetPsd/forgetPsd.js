// pages/changePsd/changePsd.js
import { sendVerify, findPwd } from '../../api/logAndReg'
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    time: true,
    timer: 0,
    phone: '',
    verify: '',
    password: '',
    repassword: '',
    isFinding: false
  },
  // 方法
  handleInput(e) {
    app.setData(e, this)
  },
  //发送验证码
  // sendverify() {
  //   sendVerify({ phone: this.data.phone, check: 1 }).then((res) => {
  //     if (res.code == 1) {
  //       this.verbutton()
  //     }
  //   })
  // },
  //发送验证码
  sendVerify() {
    sendVerify({ phone: this.data.phone, check: 1 }).then((res) => {
      if (res.code == 1) {
        this.verbutton()
        app.toastSuccess('发送成功')
      } else {
        app.toastFail(res.msg)
      }
    })
  },
  //倒计时
  verbutton() {
    this.setData({
      time: false,
      timer: 60
    })
    let interval
    interval = setInterval(() => {
      if (this.data.timer > 1) {
        this.setData({
          time: false,
          timer: this.data.timer - 1
        })
      } else {
        this.setData({
          time: true
        })
        clearInterval(interval)
      }
    }, 1000)
  },
  // 处理进入下一步
  jumpNext() {
    const { phone, verify, password, repassword } = this.data
    if (!phone) {
      return app.toastFail('请输入手机号')
    } else if (!verify) {
      return app.toastFail('请输入验证码')
    } else if (!password) {
      return app.toastFail('请输入新密码')
    } else if (!repassword) {
      return app.toastFail('请再次输入新密码')
    } else {
      this.setData({
        isFinding: true
      })
      findPwd({ phone, verify, password, repassword })
        .then(() => {
          this.setData({
            isFinding: false
          })
          setTimeout(() => {
            wx.navigateTo({ url: '/pages/login/login' })
          }, 1500)
        })
        .catch(() => {
          this.setData({
            isFinding: false
          })
        })
    }
  }
})
