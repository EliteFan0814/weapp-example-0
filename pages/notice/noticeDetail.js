import {getArticleInfo} from '../../api/personal'

// pages/notice/noticeDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    info: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {id, title} = options;
    wx.setNavigationBarTitle({title});
    this.setData({id: id || 2});
    this.getData();
  },

  getData(){
    getArticleInfo({id: this.data.id}).then(res => {
      const {info} = res.data;
      this.setData({
        info
      })
    })
  }
})