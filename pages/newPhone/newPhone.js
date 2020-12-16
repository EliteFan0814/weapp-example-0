// pages/changePhone/changePhone.js
const app = getApp()
import {sendVerify, chgPhone} from '../../api/personal' 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    verify: '',
    timer: 60,
    time: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  inputChange(e){
    app.setData(e, this);
  },  
  sendVerify(){
    if(!this.data.phone) return app.toastFail('请输入手机号');
    sendVerify({phone: this.data.phone, check: 2}).then(res=>{
      if (res.code == 1) {
        this.verbutton()
        app.toastSuccess('发送成功')
      } else {
        app.toastFail(res.msg)
      }
    })
  },
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
  submit(){
    const {phone, verify} = this.data;
    if(!phone){
      app.toastFail('请输入手机号');
    }else if(!verify){
      app.toastFail('请输入验证码');
    }else{
      chgPhone({phone, verify}).then(res => {
        if(res.code == 1){
          wx.redirectTo({url: '/pages/changeInfo/changeInfo'})
        }
      })
    }
  }
}) 