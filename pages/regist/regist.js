const app = getApp()
import { regist, getSkillList, sendVerify } from '../../api/logAndReg'
Page({
  data: {
    isRegisting: false,
    isFirstForm: true,
    formStep: 1,
    isShowDialog: false,
    name: '',
    accountList: [
      {
        name: 'phone',
        text: '手机号',
        imgUrl: '/static/img/regist/phone.png',
        value: '',
        isPsd: false,
        isVerify: false,
        type: 'number',
        placeholder: '请输入手机号'
      },
      {
        name: 'verify',
        text: '验证码',
        imgUrl: '/static/img/regist/verify.png',
        value: '',
        isPsd: false,
        type: 'text',
        placeholder: '请输入验证码'
      },
      // {
      //   name: 'confirmPsd',
      //   text: '确认密码',
      //   imgUrl: '/static/img/regist/psd.png',
      //   value: '',
      //   isPsd: true,
      // isVerify:false,
      //   type: 'text',
      //   placeholder: '请再次输入密码'
      // },
      {
        name: 'realname',
        text: '真实姓名',
        imgUrl: '/static/img/regist/name.png',
        value: '',
        isPsd: false,
        isVerify: false,
        type: 'text',
        placeholder: '请输入真实姓名'
      },
      {
        name: 'address',
        text: '家庭住址',
        imgUrl: '/static/img/regist/address.png',
        value: '',
        isPsd: false,
        isVerify: false,
        type: 'text',
        placeholder: '请输入家庭住址'
      },
      {
        name: 'descript',
        text: '个人简介',
        imgUrl: '/static/img/regist/name.png',
        value: '',
        isPsd: false,
        isVerify: false,
        type: 'text',
        placeholder: '请输入个人简介'
      }
    ],
    skillClassList: [],
    selectedSkillClassIndex: null,
    nowSkillList: [
      {
        id: 0,
        name: '吊顶安装',
        isSelected: true
      },
      {
        id: 1,
        name: '吊装',
        isSelected: false
      },
      {
        id: 2,
        name: '吊安装',
        isSelected: true
      },
      {
        id: 3,
        name: '吊',
        isSelected: false
      }
    ],
    cardList: [
      {
        name: 'id_front',
        text: '身份证正面照',
        value: '/static/img/regist/card-front.png',
        isupdate: false
      },
      {
        name: 'id_back',
        text: '身份证背面照',
        value: '/static/img/regist/card-end.png',
        isupdate: false
      },
      {
        name: 'qualification',
        text: '从业资格证',
        value: '/static/img/regist/card-work.png',
        isupdate: false
      }
    ],
    uploadData: {
      phone: '',
      verify: '',
      realname: '',
      address: '',
      descript: '',
      id_front: '',
      id_back: '',
      qualification: '',
      skill_arr: []
    },
    time: true,
    timer: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getSkillList().then((res) => {
      this.setData({
        skillClassList: res.data.list
      })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideHomeButton()
  },
  // sendverify() {
  //   sendVerify({ phone: this.data.uploadData.phone, check: 2 }).then((res) => {
  //     if (res.code == 1) {
  //       this.verbutton()
  //     }
  //   })
  // },
  // 方法
  //发送验证码
  sendVerify() {
    sendVerify({ phone: this.data.uploadData.phone, check: 2 }).then((res) => {
      if (res.code == 1) {
        this.verbutton()
        app.toastSuccess('发送成功')
      } else {
        app.toastFail(res.msg)
      }
    })
  },
  //倒计时
  verbutton() {
    this.setData({
      time: false,
      timer: 60
    })
    let interval = setInterval(() => {
      if (this.data.timer > 1) {
        this.setData({
          time: false,
          timer: this.data.timer - 1
        })
      } else {
        this.setData({
          time: true
        })
        clearInterval(interval)
      }
    }, 1000)
  },
  // 处理 input 的双向绑定同时过滤出上传的数据
  handleInput(e) {
    app.setData(e, this)
    this.filterUpData(e, 'uploadData')
  },
  // 过滤出要上传的数据
  filterUpData(e, dataName) {
    const key = `${dataName}.${e.currentTarget.dataset.key}`
    this.setData({
      [key]: typeof e.detail.value == 'undefined' ? e.detail : e.detail.value
    })
  },
  // 上传图片
  async upImg(e) {
    const imgKey = e.currentTarget.dataset.imgKey
    const imgIndex = e.currentTarget.dataset.imgIndex
    const bindUploadKey = `uploadData.${imgKey}`
    const bindlocalKey = `cardList[${imgIndex}].value`
    const res = await app.wxUpImg()
    console.log('res', res)
    this.setData({
      [bindlocalKey]: res.data.fileurl_str,
      [bindUploadKey]: res.data.fileurl
    })
  },

  // 打开选择技能列表
  openDialog(e) {
    // 获取当前选择的技能列表
    let handleSkillList = e.currentTarget.dataset.skillList
    // 获取选择的技能类别角标
    let selectedSkillClassIndex = e.currentTarget.dataset.index
    // 加入是否选中标记
    let filterSkillList = handleSkillList.map((item) => {
      item.isSelected = item.isSelected || false
      return item
    })
    // 设置弹框中的技能列表
    this.setData({
      isShowDialog: true,
      selectedSkillClassIndex: selectedSkillClassIndex,
      nowSkillList: filterSkillList
    })
  },
  // 处理技能的选择和取消
  handleSelect(e) {
    const index = e.currentTarget.dataset.index
    const skillId = e.currentTarget.dataset.skillId
    let item = this.data.nowSkillList[index]
    item.isSelected = !item.isSelected
    this.setData({
      nowSkillList: this.data.nowSkillList
    })
  },
  // 关闭选择技能
  closeDialog() {
    this.setData({
      isShowDialog: false
    })
  },
  // 确认选择技能
  confirmDialog() {
    const bindKey = `skillClassList[${this.data.selectedSkillClassIndex}].children`
    this.setData({
      isShowDialog: false,
      [bindKey]: this.data.nowSkillList
    })
    console.log('this.data.nowSkillList', this.data.nowSkillList)
    this.filterAllselectedSkill()
  },
  // 所有技能选择完毕进行结果筛选并存入要发送的数据中
  filterAllselectedSkill() {
    const AllselectedSkill = this.data.skillClassList.reduce((val, item) => {
      if (item.children) {
        return item.children.reduce((v, innerItem) => {
          if (innerItem.isSelected) {
            v.push(innerItem.skill_id)
          }
          return v
        }, val)
      }
    }, [])
    console.log(111, this.data.skillClassList)
    const bindKey = `uploadData.skill_arr`
    this.setData({
      [bindKey]: AllselectedSkill
    })
  },
  // 处理进入下一步
  jumpNext() {
    let { formStep, uploadData } = this.data
    const { phone, verify, realname, address, descript, skill_arr } = uploadData
    if (formStep == 1) {
      if (!phone) {
        return app.toastFail('请输入手机号')
      } else if (!verify) {
        return app.toastFail('请输入验证码')
      } else if (!realname) {
        return app.toastFail('请输入真实姓名')
      } else if (!address) {
        return app.toastFail('请输入家庭地址')
      } else if (!descript) {
        return app.toastFail('请输入个人简介')
      }
    } else if (formStep == 2) {
      if (!skill_arr.length) {
        return app.toastFail('请选择技能')
      }
    }
    this.setData({
      formStep: ++formStep
    })
  },
  // 返回上一步
  jumpPre() {
    this.setData({
      formStep: --this.data.formStep
    })
  },
  // 处理登陆按钮
  handleLogin() {
    console.log(wx)
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },
  // 处理注册
  handRegist() {
    const { uploadData } = this.data
    const { id_front, id_back, qualification } = uploadData
    if (!id_front) {
      app.toastFail('请上传身份证正面照')
      return
    } else if (!id_back) {
      app.toastFail('请上传身份证背面照')
      return
    } else if (!qualification) {
      app.toastFail('请上传从业资格证')
      return
    } else {
      regist(uploadData).then((res) => {
        if (res.code == 1) {
          setTimeout(this.handleLogin, 1500)
        }
      })
    }
  }
})
