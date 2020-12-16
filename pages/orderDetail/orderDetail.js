import {
  getOrderDetail,
  getCateList,
  getProductList,
  getSkillList,
  confirmArrived,
  confirmOrder
} from '../../api/order'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderId: null,
    // price: null,
    isConfirming: false,
    isSendingArrive: false,
    isShowAddDialog: false,
    addNew: '点击添加增项服务',
    orderDetail: null,
    orderItemList: [],
    orderLog: [],
    activeSelect: 'category',
    selectedCateId: null, // 记录下所选取的 cateId
    prodListPage: 1,
    prodListRow: 10,
    prodListTotal: 1,
    selectList: [
      {
        title: '产品分类',
        value: '点击选择',
        type: 'category',
        arrayTo: 'cateList',
        id: null,
        disabled: false,
        children: []
      },
      {
        title: '产品名称',
        value: '点击选择',
        type: 'product',
        arrayTo: 'productList',
        id: null,
        disabled: true,
        children: []
      },
      {
        title: '服务技能',
        value: '点击选择',
        type: 'skill',
        arrayTo: 'skillList',
        id: null,
        disabled: true,
        children: []
      }
    ],
    finallSelectedList: [], //  最终选择项组成的列表
    // cateList: [],
    // productList: [],
    // skillList: [],
    showConfirmArrive: false,
    canChangeOrder: false,
    totalPrice: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({ orderId }) {
    this.setData({
      orderId
    })
    this.getOrderDetail()
    this.getCateList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('页面销毁')
    wx.switchTab({
      url: '/pages/order/order'
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  // 方法
  // 获取订单详情
  getOrderDetail() {
    getOrderDetail(this.data.orderId).then((res) => {
      // 对订单项遍历，加入是否能够修改价格的属性
      const status = res.data.info.status
      this.setData({
        showConfirmArrive: status === 3 ? true : false,
        canChangeOrder: status === 4 || status === 5 ? true : false
      })
      let filterOrder = res.data.order_item.map((item) => {
        let tempItem = {}
        tempItem.product_id = item.product_id
        tempItem.skill_id = item.skill_id
        tempItem.product_name = item.product_name
        tempItem.skill_name = item.skill_name
        tempItem.final_price = item.final_price
        return tempItem
      })

      this.setData({
        orderDetail: res.data.info,
        orderItemList: filterOrder,
        orderLog: res.data.order_log
      })
      this.countTotalPrice()
    })
  },
  // 初始默认获取第一级分类列表
  getCateList() {
    getCateList()
      .then((res) => {
        const key = 'selectList[0].children'
        let temp = res.data.list
        temp.forEach((item) => {
          item.isSelected = false
        })
        this.setData({
          [key]: res.data.list
        })
      })
      .catch(() => {})
  },
  // 处理确认抵达
  handleArrived(e) {
    this.setData({
      isSendingArrive: true
    })
    const bindKey = `orderDetail.status`
    confirmArrived(e.currentTarget.dataset.orderId)
      .then((res) => {
        this.getOrderDetail()
        this.setData({
          // [bindKey]: 4,
          // canChangeOrder: true,
          isSendingArrive: false
        })
      })
      .catch((err) => {
        this.setData({
          isSendingArrive: false
        })
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
  // 处理弹框的显示和隐藏
  handleShowAddDialog() {
    this.setData({
      isShowAddDialog: !this.data.isShowAddDialog
    })
  },
  // 确定新增选项
  confirmDialog() {
    // 如果选择完毕，生成新的选项
    if (this.data.finallSelectedList[2] !== null) {
      console.log('this.data.finallSelectedList', this.data.finallSelectedList)
      const temp = this.data.finallSelectedList
      let newOrderItem = {}
      newOrderItem.product_id = temp[1].product_id
      newOrderItem.skill_id = temp[2].skill_id
      newOrderItem.product_name = temp[1].name
      newOrderItem.skill_name = temp[2].name
      newOrderItem.final_price = ''
      this.data.orderItemList.push(newOrderItem)
      this.setData({
        orderItemList: this.data.orderItemList
      })
      this.handleShowAddDialog()
    } else {
      app.toastFail('请选择全部选项')
    }
  },
  // 删除选项
  deleteOrderItem(e) {
    const _this = this
    wx.showModal({
      title: '提示',
      content: '确认删除当前项',
      success(res) {
        if (res.confirm) {
          const index = e.currentTarget.dataset.index
          _this.data.orderItemList.splice(index, 1)
          _this.setData({
            orderItemList: _this.data.orderItemList
          })
          _this.countTotalPrice()
        }
      }
    })
  },
  // 合计金额
  countTotalPrice() {
    const priceList = this.data.orderItemList.map((item) => {
      return Number(item.final_price)
    })
    const finallPrice = priceList
      .reduce((a, b) => {
        return a + b
      })
      .toFixed(2)
    this.setData({
      totalPrice: finallPrice
    })
  },
  // 打开手风琴选项
  nowOpen(e) {
    console.log(e)
    // const {type} = e.currentTarget.dataset
    this.setData({
      activeSelect: e.detail
    })
  },
  // 根据 cateId 预加载产品列表的第一页
  preGetProductList(cateId) {
    this.setData({
      prodListPage: 1
    })
    getProductList(1, this.data.prodListRow, cateId).then((res) => {
      console.log('res', res)
      const key = `selectList[1].children`
      this.setData({
        [key]: res.data.list,
        prodListTotal: res.data.page_total
      })
    })
  },
  // 产品列表为分页结构，处理下滑时获取新的分页存入列表
  infinityGetProductList(e) {
    const useInfinity = e.currentTarget.dataset.useInfinity
    // console.log('infinityGetProductList', e)
    if (useInfinity) {
      if (this.data.prodListPage < this.data.prodListTotal) {
        this.setData({
          prodListPage: ++this.data.prodListPage
        })
        getProductList(this.data.prodListPage, this.data.prodListRow, this.data.selectedCateId).then((res) => {
          this.data.selectList[1].children.push(res.data.list)
          this.setData({
            selectList: this.data.selectList,
            prodListTotal: res.data.page_total
          })
        })
      }
    }
  },
  //根据 prodId 获取服务技能列表
  getSkillList(prodId) {
    getSkillList(prodId).then((res) => {
      const key = `selectList[2].children`
      this.setData({
        [key]: res.data.list
      })
    })
  },
  // 处理选中某一项
  handleSelectItem(e) {
    console.log('手风琴', e)
    const fartherIndex = e.currentTarget.dataset.index
    const childIndex = e.currentTarget.dataset.innerIndex
    const finallyTempKey = `finallSelectedList[${fartherIndex}]` // 存入最终选择项对应的位置
    let isTheSame = false // 判断是否点击同一个选项
    let SelectedInfo = null // 点击某一项所获得的当前项的信息
    // const tempKey = `selectList[${fartherIndex}].children`
    // const key = `selectList[${fartherIndex}].children[${childIndex}].isSelected`
    let temp = this.data.selectList[fartherIndex].children
    temp.forEach((item, index) => {
      if (index === childIndex) {
        if (item.isSelected === true) {
          isTheSame = true
        } else {
          isTheSame = false
        }
        item.isSelected = true
        SelectedInfo = item
      } else {
        item.isSelected = false
      }
    })
    this.setData({
      selectList: this.data.selectList,
      selectedCateId: SelectedInfo.cate_id ? SelectedInfo.cate_id : this.data.selectedCateId, // data 中存储所选择的 cateId
      [finallyTempKey]: SelectedInfo
    })
    console.log('SelectedInfo', SelectedInfo)
    console.log('selectedCateId', this.data.selectedCateId)
    console.log('finallSelectedList', this.data.finallSelectedList)
    // 如果点击的不是同一个选中的选项，则预加载下一层选项
    if (!isTheSame) {
      if (SelectedInfo) {
        // 预加载产品列表
        if (fartherIndex === 0) {
          const key1 = `selectList[1].disabled`
          const key2 = `selectList[2].disabled`
          const finallKey1 = `finallSelectedList[1]`
          const finallKey2 = `finallSelectedList[2]`
          this.setData({
            [key1]: false,
            [key2]: true,
            [finallKey1]: null,
            [finallKey2]: null
          })
          this.preGetProductList(SelectedInfo.cate_id)
        } else if (fartherIndex === 1) {
          const key = `selectList[2].disabled`
          const finallKey2 = `finallSelectedList[2]`
          this.setData({
            [key]: false,
            [finallKey2]: null
          })
          this.getSkillList(SelectedInfo.product_id)
        }
      }
    }
  },
  // 修改当前项价格
  changePrice(e) {
    const index = e.currentTarget.dataset.index
    const key = `orderItemList[${index}].final_price`
    this.setData({
      [key]: e.detail.value
    })
    this.countTotalPrice()
  },
  // 确认最终价格
  confirmOrder() {
    let verify = false
    this.data.orderItemList.map((item) => {
      if (!item.final_price) {
        verify = false
      } else {
        verify = true
      }
    })
    if (verify) {
      this.setData({
        isConfirming: true
      })
      console.log(this.data.orderItemList)
      confirmOrder({ order_id: this.data.orderId, item: this.data.orderItemList })
        .then((res) => {
          this.setData({
            isConfirming: false
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        })
        .catch(() => {
          this.setData({
            isConfirming: false
          })
        })
    } else {
      app.toastFail('请将价格填写完整')
    }
  },

  //  以下为暂时不用的函数

  //
  submitSelect(e) {
    console.log(e)
    this.setData({
      addNew: e.detail.value,
      isShowDialog: false
    })
  },
  //
  focusInput(e) {
    const index = e.currentTarget.dataset.index
    console.log(e)
    const key = `orderItemList${index}.showChangeBtn`
    this.data.orderItemList[index].showChangeBtn = true
    this.setData({
      orderItemList: this.data.orderItemList
    })
  }
})
