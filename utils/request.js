import userAuth from './userAuth' // 登录获取token
import Fly from '../lib/wx'

const fly = new Fly()
const flyForToken = new Fly()

fly.config = {
  headers: {
    'content-type': 'application/json'
  },
  baseURL: 'https://xiaochengxu.wgywkm.com',
  parseJson: true,
  timeout: 10000
}

// 请求拦截
fly.interceptors.request.use(async (request) => {
  fly.lock()
  try {
    // const token = await userAuth.setTokenSync() // 方式1 执行wx.login登录并获取token
    const token = wx.getStorageSync('token') //  方式2 直接获取token
    if (token) {
      request.headers['Authorization'] = 'Bearer ' + token
    }
    return request
  } catch (err) {
    console.log('请求拦截错误', err)
  } finally {
    fly.unlock()
  }
})
// 响应拦截
fly.interceptors.response.use(
  (response) => {
    // 响应成功，但是数据异常
    if (response.data.code === 0) {
      wx.showToast({
        title: response.data.msg,
        icon: 'none',
        duration: 2000
      })
      return Promise.reject(response.data)
    }
    // 响应成功，数据正常，但是有特别的 message 信息需要展示
    if (response.data.code === 1 && response.data.msg !== 'ok') {
      wx.showToast({
        title: response.data.msg,
        icon: 'success',
        duration: 1500
      })
      return Promise.resolve(response.data)
    }
    // 响应成功，数据正常,无需展示 message 信息
    return response.data
  },
  (err) => {
    console.log('响应拦截处有错误', err)
    if (err.status === 900) {
      // userAuth.clearHaveToken() // 方式1
      wx.removeStorageSync('token') // 方式2
    } else if (err.status === 404) {
      wx.navigateTo({
        url: '/pages/404/404'
      })
    } else if (err.status >= 500 && err.status < 600) {
      wx.showToast({
        title: '服务器错误',
        icon: 'none'
      })
    } else {
      if (err.response.data) {
        wx.showToast({
          title: err.response.data,
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: err.message,
          icon: 'none'
        })
      }
    }
  }
)

flyForToken.config = fly.config
export { fly, flyForToken }
