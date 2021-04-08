// baseComponents/base-btn/base-btn.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    btnName: {
      type: String,
      value: 'btnName'
    },
    disabled: {
      type: Boolean,
      value: false
    },
    isPushing: {
      type: Boolean,
      value: false
    }
  },
  // 向外暴露css class 类，方便父组件接管自定义组件样式
  externalClasses: ['base-btn-style'],
  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    handleTap() {
      if (this.data.isPushing) {
        return
      }
      this.triggerEvent('handleTap')
    }
  }
})
