// pages/changePwd/changePwd.js
const app = getApp()
import {resetPwd} from '../../api/personal' 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldpassword: '',
    password: '',
    repassword: '',
  }, 
  inputChange(e){
      app.setData(e, this);
  },  
  submit(){
    const {oldpassword, password, repassword} = this.data;
    if(!oldpassword){
      app.toastFail('请输入原密码');
    }else if(!password){
      app.toastFail('请输入新密码');
    }else if(!repassword){
      app.toastFail('请确认密码');
    }else if(repassword !== password){
      app.toastFail('两次密码不一致，请重新输入');
    }else{
      resetPwd({oldpassword, password, repassword}).then(res=>{
        if(res.code == 1){
          setTimeout(() => {
            wx.reLaunch({url: '/pages/login/login'});
            wx.clearStorageSync();
            app.globalData.isLogin = false;
          }, 1500);
        }
      })
    }
  }
})