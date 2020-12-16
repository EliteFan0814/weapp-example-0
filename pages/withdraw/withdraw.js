const app = getApp()
import {
  cashOuAccount,
  cashOut,
  getInfo
} from '../../api/personal'


Page({
  data: {
    option: [],
    type: '',
    apply_amount: null,
    realname: '',
    account: '',
    bank: '',
    minCash: 0,
    amount: null,
    lists: [],
    info: [],
    cash_shouxu: '',
    shouxu: ''
  },

  onLoad: function () {
    this.getInfo()
  },
  onShow() {
    this.getData()
  },
  getInfo() {   //获取个人信息
    getInfo().then((res) => {
      if (res.code == 1) {
        this.setData({
          info: res.data.info,
          amount: res.data.info.amount,
          minCash: res.data.param.cash_min,
          cash_shouxu: res.data.param.cash_shouxu
        })
        // 普通用户
      } else {
        app.toastFail(res.msg)
      }
    })
  },
  getData() { //获取提现账户列表
    cashOuAccount({}).then((res) => {
      if (res.code == 1) {
        res.data.type_screen.map((item) => {
          item.text = item.label
          item.value = item.value
        })
        this.setData({
          lists: res.data.list,
          option: res.data.type_screen,
          type: res.data.list[0].type,
        })
        this.getUser();
        console.log(res.data);
        console.log(option);
      } 
    })
  },
  getUser() {
    if (this.data.lists.length != 0) {
      let list = this.data.lists.filter((item) => {
        return item.type == this.data.type
      })
      this.setData({
        realname: list[0].realname,
        account: list[0].account,
        bank: list[0].bank,
      })
    }
  },
  onChange(e) {
    this.setData({
      type: e.detail,
    })
    this.getUser()
  },
  // 文本框赋值
  setInputVal(e) {
    app.setData(e, this);
    const {name} = e.currentTarget.dataset;
    if(name == "apply_amount"){
      const {apply_amount, cash_shouxu} = this.data;
      let shouxu = apply_amount * cash_shouxu / 100;
      this.setData({shouxu})
    }
  },
  open() {
    wx.navigateTo({
      url: '/pages/withdraw/withdrawRecord',
    })
  },
  submit() {
    const {type, apply_amount, account, realname,bank, minCash, amount} = this.data;
    const _money = Number(apply_amount)
    const _minCash = Number(minCash)
    const _amount = Number(amount)
    // 判断余额相关
    if (_money) {
      if (_money < _minCash) {
        return app.toastFail('最低提现金额' + this.data.minCash + '元')
      }
      if (_money > _amount) {
        return app.toastFail('提现金额超出余额')
      }
    } else {
      return app.toastFail('请输入提现金额')
    }
    let item = {
      type,
      apply_amount,
      realname,
      account,
      bank,
    }
    if(!account){
      app.toastFail('请输入提现账户');
    }else if(type == 'AMT' && !bank){
      app.toastFail('请输入银行卡号');
      delete item.account;
    }else if (!realname) {
      app.toastFail('请输入真实姓名');
    } else {
      cashOut(item).then((res) => {
        if (res.code == 1) {
          app.toastSuccess('申请成功')
          this.setData({
            apply_amount: '',
            account: '',
            realname: '',
            bank: '',
            amount: amount - apply_amount,
          })
          setTimeout(this.open, 1500)
        } else {
          app.toastFail(res.msg)
        }
      })
    }
  },
})