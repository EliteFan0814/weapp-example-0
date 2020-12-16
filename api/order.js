import { fly } from '../utils/request'

// 订单列表
export function getOrderList(page, rows, screen) {
  return fly.get('/worker/order/lists', { page, rows, screen })
}
// 确认抵达
export function confirmArrived(order_id) {
  return fly.post('/worker/order/reach', { order_id })
}
// 订单详情
export function getOrderDetail(order_id) {
  return fly.get('/worker/order/info', { order_id })
}
// 选择产品分类
export function getCateList() {
  return fly.get('/worker/category/lists')
}
// 选择产品列表
export function getProductList(page, row, cate_id) {
  return fly.get('/worker/product/lists', { page, row, cate_id })
}
// 选择技能列表
export function getSkillList(product_id) {
  return fly.get('/worker/skill/lists', { product_id })
}
// 确定最终定价
export function confirmOrder(data) {
  return fly.post('/worker/order/price', data)
}
