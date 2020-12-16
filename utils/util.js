const formatTime = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = (n) => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 二次封装微信toast
const toast = (title, icon = 'none', duration = 1500) => {
  wx.showToast({
    title,
    icon,
    duration
  })
}

module.exports = {
  formatTime: formatTime,
  toast
}
