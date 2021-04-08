const app = getApp()
import { regist, getSkillList, sendVerify, getAgreement, getAreaList } from '../../api/logAndReg'
Page({
  data: {
    showArea: false,
    mainActiveIndex: 0,
    activeId: null,
    agent_id: null,
    areaStr: '',
    showAgreement: true,
    isRegisting: false,
    isFirstForm: true,
    formStep: 1,
    isShowDialog: false,
    name: '',
    areaList: [],
    accountList: [
      {
        name: 'area',
        text: '区域选择',
        imgUrl: '/static/img/regist/address.png',
        value: '',
        isPsd: false,
        isVerify: false,
        isSelect: true,
        type: 'text',
        placeholder: '请选择区域'
      },
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
        name: 'referrer',
        text: '推荐人',
        imgUrl: '/static/img/regist/name.png',
        value: '',
        isPsd: false,
        isVerify: false,
        type: 'text',
        placeholder: '请输入推荐人姓名'
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
      referrer: '',
      id_front: '',
      id_back: '',
      qualification: '',
      skill_arr: []
    },
    isAgree: false,
    agreementDetail: undefined,
    time: true,
    timer: 0
  },
  handleAreaSelect() {
    this.setData({
      showArea: !this.data.showArea
    })
  },
  onClickNav({ detail = {} }) {
    this.setData({
      mainActiveIndex: detail.index || 0
    })
  },
  onClickItem({ detail = {} }) {
    console.log(detail)
    const activeId = this.data.activeId === detail.id ? null : detail.id
    this.setData({ activeId: activeId, agent_id: detail.agent_id, areaStr: detail.text, showArea: false })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getSkillList()
      .then((res) => {
        this.setData({
          skillClassList: res.data.list
        })
      })
      .catch((err) => {})
    getAgreement().then((res) => {
      this.setData({
        agreementDetail: res.data.info.content
      })
    })
    getAreaList().then((res) => {
      console.log(res)
      this.setData({
        areaList: res.data.list
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
  openAgreement() {
    this.setData({
      showAgreement: true
    })
  },
  closeAgreement() {
    this.setData({
      showAgreement: false
    })
  },
  // 处理同意按钮
  handleAgreeCheckbox(e) {
    this.setData({
      isAgree: e.detail
    })
  },
  handleAgree() {
    this.setData({
      isAgree: true
    })
  },
  handleAgree() {
    this.setData({
      isAgree: true
    })
  },
  handleRefuse() {
    wx.navigateBack({
      delta: 1
    })
    // this.setData({
    //   showAgreement: false,
    //   isAgree: false
    // })
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
    // 判断全选按钮是否存在，如果存在就不再unshift
    if (!filterSkillList[0].isSelectAllBtn) {
      filterSkillList.unshift({ label: '全选', name: '全选', isSelectAllBtn: true, isSelected: false })
    }
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
    const flagAll = this.data.nowSkillList[0].isSelected
    if (index === 0) {
      // 如果点击的是全选按钮，则遍历数组进行全选
      this.data.nowSkillList.map((item) => {
        item.isSelected = !flagAll
      })
      this.setData({
        nowSkillList: this.data.nowSkillList
      })
    } else {
      // 如果点击的是普通按钮
      const skillId = e.currentTarget.dataset.skillId
      let item = this.data.nowSkillList[index]
      item.isSelected = !item.isSelected
      // this.setData({
      //   nowSkillList: this.data.nowSkillList
      // })
      const temp = this.data.nowSkillList
      // 遍历普通按钮，判断是否全部选中
      let innerFlag = true
      for (let i = 1; i < temp.length; i++) {
        if (!temp[i].isSelected) {
          innerFlag = false
          break
        }
      }
      temp[0].isSelected = innerFlag
      this.setData({
        nowSkillList: this.data.nowSkillList
      })
    }
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
    const bindKey = `uploadData.skill_arr`
    this.setData({
      [bindKey]: AllselectedSkill
    })
  },
  // 处理进入下一步
  jumpNext() {
    let { formStep, uploadData } = this.data
    const { phone, verify, realname, address, referrer, skill_arr } = uploadData
    if (formStep == 1) {
      if (!this.data.agent_id) {
        return app.toastFail('请选择地区')
      } else if (!phone) {
        return app.toastFail('请输入手机号')
      } else if (!verify) {
        return app.toastFail('请输入验证码')
      } else if (!realname) {
        return app.toastFail('请输入真实姓名')
      } else if (!address) {
        return app.toastFail('请输入家庭地址')
      } else if (!referrer) {
        return app.toastFail('请输入推荐人姓名')
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
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },
  // 处理注册
  handRegist() {
    const { uploadData } = this.data
    uploadData.agent_id = this.data.agent_id
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
          setTimeout(this.handleLogin, 500)
        }
      })
    }
  }
})
