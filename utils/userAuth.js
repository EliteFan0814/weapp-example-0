import {
  flyForToken
} from './request'
import authConfig from './authConfig'

const app = getApp()
let token = wx.getStorageSync('token')
// 获取微信code
function getWxCode() {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        if (res.code) {
          resolve(res.code)
        } else {
          console.log('获取微信code失败' + res.errMsg)
          reject
        }
      }
    })
  })
}
// 用code换取token
async function code2Token() {
  const code = await getWxCode()
  const res = await flyForToken.post(authConfig.loginUrl, {
    [authConfig.codeName]: code
  })
  const tokenRes = res.data
  return tokenRes.data.token
}
// 换取token并存入本地localStorage
async function setTokenSync() {
  try {
    if (!token) {
      const res = await code2Token()
      token = res
      wx.setStorageSync('token', res)
    }
    app.globalData.isLogin = true
    return token
  } catch (err) {
    app.globalData.isLogin = false
  }
}
// 暂时删除获取的token值用来做判断（此处并未真正删除localStorage中的token）
function clearHaveToken() {
  token = ''
}

export default {
  setTokenSync,
  clearHaveToken
}