import {
  fly
} from '../utils/request'

// 测试接口，可以删除
export function getBannerList(page) {
  return fly.get('/member/index/slider', page)
}