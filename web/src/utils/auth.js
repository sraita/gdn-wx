export function getToken () {
  return localStorage.getItem('loginToken')
}

export function setToken (token) {
  return localStorage.setItem('loginToken', token);
}

export function removeToken() {
  return localStorage.removeItem('loginToken');
}

export function getRefreshToken() {
  return localStorage.getItem('refreshToken')
}

export function setRefreshToken(refresh_token) {
  return localStorage.setItem('refreshToken', refresh_token);
}

export function removeRefreshToken() {
  return localStorage.removeItem('refreshToken');
}