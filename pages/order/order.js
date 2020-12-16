import { getOrderList, confirmArrived } from '../../api/order'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    rows: 10,
    totalPage: 1,
    screen: 0,
    tabsList: [],
    orderList: [],
    isSendingArrive: false,
    arrivedInfo: '我已抵达'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      page: 1
    })
    this.getOrderList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},
  //小程序触底事件
  onReachBottom: function () {
    if (this.data.page < this.data.totalPage) {
      this.data.page += 1
      this.getOrderList('down')
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 1500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.page < this.data.totalPage) {
      // this.data.page += 1
      this.setData({
        page: this.data.page + 1
      })
      this.getOrderList('down')
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  // 方法
  getOrderList(type) {
    getOrderList(this.data.page, this.data.rows, this.data.screen).then((res) => {
      this.setData({
        totalPage: res.data.page_total,
        tabsList: res.data.screens
      })
      let orderList = this.data.orderList
      const resList = res.data.list
      if (type === 'down') {
        orderList.push(...resList)
        this.setData({
          orderList: orderList
        })
      } else {
        this.setData({
          orderList: resList
        })
      }
    })
  },
  //
  changeTab(e) {
    console.log(e)
    this.setData({
      page: 1,
      orderList: [],
      screen: e.detail.name
    })
    this.getOrderList()
  },
  // 打电话
  phoneCall(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
      success() {},
      fail(err) {
        console.log(err)
      }
    })
  },
  // 打开地图
  openMap(e) {
    wx.openLocation({
      latitude: e.currentTarget.dataset.lat,
      longitude: e.currentTarget.dataset.lon,
      scale: 14,
      name: e.currentTarget.dataset.address
    })
  },
  goOrderDetail(e) {
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?orderId=' + e.currentTarget.dataset.orderId
    })
  },
  // 处理抵达
  handleArrived(e) {
    this.setData({
      isSendingArrive: true
    })
    const bindKey = `orderList[${e.currentTarget.dataset.index}].status`
    confirmArrived(e.currentTarget.dataset.orderId)
      .then((res) => {
        this.setData({
          [bindKey]: 4,
          isSendingArrive: false
        })
      })
      .catch((err) => {
        this.setData({
          isSendingArrive: false
        })
      })
  }
})
