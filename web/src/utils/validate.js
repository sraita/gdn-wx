export function isMobile(val) {
  const reg = /^1[3|7|8]\d{9}$|^19[8-9]\d{8}$|^166\d{8}|^15[0-3|5-9]\d{8}|^14[5|7]\d{8}$/;
  return reg.test(val)
}

export function checkPassStrong(val) {
  let mode = 0;
  if (val.length < 6 || val.length > 18) {
    return mode;
  }
  if (/\d/.test(val)) mode++; //数字
  if (/[a-z]/.test(val)) mode++; //小写
  if (/[A-Z]/.test(val)) mode++; //大写  
  if (/\W/.test(val)) mode++; //特殊字符

  return mode;
}