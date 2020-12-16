//index.js
//获取应用实例
const app = getApp()
import { cashLists } from '../../api/personal'

Page({
  data: {
    page: 1,
    totalPage: 1,
    list: [],
    activeNames: [],
    state: '',
  },

  onLoad: function (options) {
    const {state} = options;
    if(state){
      this.setData({state});
    }
    this.getData()
  },
 
  //下拉事件
  onReachBottom() {
    if (this.data.page < this.data.totalPage) {
      this.data.page += 1
      this.getData('down')
    }
  },
  getData(type) {
    cashLists({
      page: this.data.page,
      rows: 10,
      state: this.data.state
    }).then((res) => {
      this.data.totalPage = res.data.page_total
      let list = this.data.list
      const resList = res.data.list
      if (type === 'down') {
        list.push(...resList)
        this.setData({
          list: this.data.list,
        })
      } else {
        this.setData({
          list: resList,
        })
      }
    })
  },

  onChange(e) {
    this.setData({
      activeNames: e.detail,
    })
  },
})
