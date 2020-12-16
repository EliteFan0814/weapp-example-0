// pages/notice/notice.js
import {getArticleList} from '../../api/personal'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    nowPage: 1,
    page_total: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getArticleList();
  },
  onReachBottom(){
    if(this.data.nowPage < this.data.page_total)this.getArticleList();
  },
  getArticleList(){
    getArticleList({page: this.data.nowPage, rows: 10, cate: 'w_notice'}).then(res=>{
      const {list, page_total} = res.data;
      this.setData({
        list,
        page_total
      })
    })
  },
  goDetail(e) {
    const {id, title} = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/notice/noticeDetail?id=${id}&title=${title}`,
    })
  },
})