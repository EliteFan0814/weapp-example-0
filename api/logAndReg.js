import { fly } from '../utils/request'

// 注册
export function regist(data) {
  return fly.post('/worker/pub/register', data)
}
// 登陆
export function login(account, password) {
  return fly.post('/worker/pub/login', { account, password })
}
// 师傅技能选择
export function getSkillList() {
  return fly.get('/worker/skill/lists')
}

// 发送验证码
export function sendVerify(data) {
  return fly.post('/worker/pub/sendverify', data)
}

// 忘记密码，找回密码
export function findPwd(data) {
  return fly.post('/worker/pub/findPwd', data)
}

