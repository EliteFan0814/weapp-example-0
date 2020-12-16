// baseComponents/base-pre-img/base-pre-img.js
import baseTools from '../../utils/baseTools'
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    singleShow: {
      type: Boolean,
      value: true
    },
    imgList: {
      type: [String, Array],
      value: ''
    },
    mode: {
      type: String,
      value: ''
    },
    isPreview: {
      type: Boolean,
      value: true
    }
  },
  // 向外暴露css class 类，方便父组件接管自定义组件样式
  externalClasses: ['base-img-style'],

  data: {
    list: null
  },
  observers: {
    imgList: function (imgList) {
      if (baseTools.checkType(imgList, 'String')) {
        this.setData({
          list: [imgList]
        })
      } else if (baseTools.checkType(imgList, 'Array')) {
        this.setData({
          list: imgList
        })
      } else {
        app.wxToast('图片数据格式不对')
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    previewImg(event) {
      if (this.data.isPreview) {
        const res = event.currentTarget.dataset
        wx.previewImage({
          current: res.currentImg, // 当前显示图片的http链接
          urls: res.imgList // 需要预览的图片http链接列表
        })
      }
    }
  }
})
