// pages/finance/finance.js
const app = getApp()
import { getInfo } from '../../api/personal'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    info: {
      shouyi: 0,
      order_money: 0,
      order_num: 0,
      amount: 0,
      cash_finish: 0,
      today_shouyi: 0,
      today_order_num: 0,
      today_order_money: 0
    },
    skill: []
  },
  onLoad: function () {
    this.getInfo()
  },
  onPullDownRefresh: function () {
    this.getInfo()
  },
  getInfo() {
    getInfo().then((res) => {
      const { info, skill } = res.data
      this.setData({
        info,
        skill
      })
      wx.stopPullDownRefresh()
      console.log(info)
    })
  },
  goBill() {
    wx.navigateTo({
      url: `/pages/bill/bill`
    })
  },
  goOrder() {
    wx.switchTab({
      url: `/pages/order/order`
    })
  },
  goWithdrawRecord() {
    wx.navigateTo({
      url: `/pages/withdraw/withdrawRecord?state=3`
    })
  }
})
