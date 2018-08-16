export const moneyFormat = (value) => {
  let s = '' + value;
  if(/[^0-9\.]/.test(s)) {
    return "invalid value"
  }
  s = s.replace(/^(\d*)$/,"$1.")
  s = (s + "00").replace(/(\d*\.\d\d)\d*/,"$1");
  s = s.replace(".",",");
  let re = /(\d)(\d{3},)/;
  while(re.test(s))
    s = s.replace(re,"$1,$2");
  s = s.replace(/,(\d\d)$/,".$1");
  return "￥" + s.replace(/^\./,"0.")
}
