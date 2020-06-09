import Cookies from 'js-cookie'

// 设置 cookie的名字 ,注意,user.js也有admin-token,但是这是mock里的配置,暂时用不到mock,不care
// const TokenKey = 'Admin-Token'
const TokenKey = 'Chryl-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
