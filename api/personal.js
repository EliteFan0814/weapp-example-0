import {
  fly
} from '../utils/request'

export function getInfo(params) {
  return fly.get('/worker/worker/info', params)
}

export function editInfo(data) {
  return fly.post('/worker/worker/edit', data)
}

export function getBillList(params) {
  return fly.get('/worker/worker_bill/lists', params)
}

export function getArticleList(params) {
  return fly.get('/worker/article/lists', params)
} 

export function getArticleInfo(params) {
  return fly.get('/worker/article/info', params)
}

export function resetPwd(data) {
  return fly.post('/worker/worker/reset', data)
}

export function sendVerify(data) {
  return fly.post('/worker/pub/sendverify', data)
}

export function chkPhone(data) {
  return fly.post('/worker/worker/chkPhone', data)
}

export function chgPhone(data) {
  return fly.post('/worker/worker/chgPhone', data)
}

export function cashOuAccount(params) {
  return fly.get('/worker/cash_account/lists', params)
}

export function cashOut(data) {
  return fly.post('/worker/cash/apply', data)
}

export function cashLists(params) {
  return fly.get('/worker/cash/lists', params)
}
