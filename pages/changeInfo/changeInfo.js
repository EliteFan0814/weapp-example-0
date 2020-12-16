// pages/changeInfo/changeInfo.js
import {editInfo} from '../../api/personal' 

const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: '', 
    phone: '',
    thumb: '',
    thumb_str: '',
    show: false,
  },
  onLoad(options){
    const {name, thumb, phone, thumb_str} = options;
    console.log(options);
    this.setData({
      name, thumb, phone, thumb_str
    })
  },
  changeName(){
    this.setData({
      show: true
    })
  },
  onClose(){
    this.setData({ show: false });
  },
  upload(){
    app.wxUpImg().then( res => {
      const {data} = res;
      console.log(data);
      if(data.fileurl){
        const thumb_str = data.fileurl_str;
        const thumb = data.fileurl;
        this.setData({thumb_str,thumb});
        editInfo({thumb}).then(res=>{
        })
      }
    })
  },
  open(e) {
    const { path } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/${path}/${path}?phone=${this.data.phone}`
    })
  },
  inputChange(e){
    app.setData(e, this)
  },
  async submit() {
    const {name} = this.data;
    console.log(name);
    if (!name) {
      app.toastFail('请输入昵称')
    }else{
      editInfo({realname:name}).then(res=>{
      })
    }
  }
})
