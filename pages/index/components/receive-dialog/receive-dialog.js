// pages/index/components/receive-dialog/receive-dialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderName: {
      type: String,
      value: null
    },
    orderId: {
      type: [String, Number],
      value: null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeDialog() {
      this.triggerEvent('closeDialog')
    },
    goOrderDetail() {
      this.triggerEvent('closeDialog')
      wx.navigateTo({
        url: `/pages/orderDetail/orderDetail?orderId=${this.data.orderId}`
      })
    }
  }
})
