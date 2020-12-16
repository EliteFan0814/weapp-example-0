import { fly } from '../utils/request'

// 获取个人信息
export function getUserInfo() {
  return fly.get('/worker/worker/info')
}
// 切换接单状态
export function exchangeSwitch(newstate, add_lon, add_lat) {
  return fly.post('/worker/worker/open', { newstate, add_lon, add_lat })
}
// 获取最近订单
export function getNearbyOrder() {
  return fly.get('/worker/order/index')
}
// 同意接单
export function agreeNowOrder(order_id) {
  return fly.post('/worker/order/agree', { order_id })
}
// 拒绝接单
export function refuseNowOrder(order_id) {
  return fly.post('/worker/order/refuse', { order_id })
}
// 发送位置信息
export function postLocationInfo(add_lon, add_lat) {
  return fly.post('/worker/worker/dingwei', { add_lon, add_lat })
}
