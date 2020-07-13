import qs from "qs";
import moment from "moment";
import { GZHAppId } from "@/config/index";
import sha1 from 'js-sha1'//一种加密方式
const setLocal = function (name, content) {
  if (!name) return;
  if (typeof content !== "string") {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
};
const getLocal = function (name) {
  if (!name) return;
  return window.localStorage.getItem(name);
};
const removeLocal = function (name) {
  if (!name) return;
  window.localStorage.removeItem(name);
};

// sessionStorage
const setSession = function (name, content) {
  if (!name) return;
  if (typeof content !== "string") {
    content = JSON.stringify(content);
  }
  window.sessionStorage.setItem(name, content);
};
const getSession = function (name) {
  if (!name) return;
  return window.sessionStorage.getItem(name);
};
const removeSession = function (name) {
  if (!name) return;
  window.sessionStorage.removeItem(name);
};
// 获取url后的某个值
const getQueryString = function (name, url) {
  url = url.split("?")[1];
  if (!url) return "";
  const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  const obj = url.match(reg);
  if (!obj) return "";
  return obj[2];
};

// 用于get方法后面参数的拼接，传入data是对象
const getUrlConcat = function (data) {
  let dataStr = ""; //数据拼接字符串
  let url = "";
  Object.keys(data).forEach((key) => {
    dataStr += key + "=" + data[key] + "&";
  });
  if (dataStr !== "") {
    dataStr = dataStr.substr(0, dataStr.lastIndexOf("&")); // 去除掉最后一个"&"字符
    url = url + "?" + dataStr;
  }
  return url;
};
// 保留小数
const keepDecimal = (Num, a) =>{//Num小数,a位数   只截取 不计算
  let reg = new RegExp("^(.*\\..{" + a + "}).*$");
  return Number(String(Num).replace(reg, "$1"));
};
// 分--转--元
const centToUnit = (a)=>{
  return a ? (Math.floor(a*100)/10000) : '0.00';
};
// 元--转--分
const unitToCent = (a) => {
  return a?(Number(a)*100):0;
};
// 多个数据进行相加
const multiAdd = (...arg) => {
  let a = 0;
  for (let i = 0; i < arg.length; i++) {
    a += i;
  }
  return a;
};
// 随机数
const generateMixed = (n) => {
  let chars = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", ];
  let str = "";
  for (let i = 0; i < n; i++) {
    let site = Math.ceil(Math.random() * 61);
    str += chars[site];
  }
  return str;
};
//编译公众号url 
// companyName=项目&logoUrl=图片名称&serviceTelephone=电话&serviceType=1&subTitle=logo下的名称 1 显示 2不显示
// &scope=1 授权获取用户昵称 省市区 头像
const compileUrl = function ( URLs, Obj ) {
  let appid = GZHAppId;
  let companyName = encodeURI(Obj.companyName);
  Obj.companyName = companyName;
  Obj.t = new Date().getTime();
  let scope = true;
  if (Obj.scope && Obj.scope=== '1') {
    scope = false;
    delete Obj.scope;
  } else if (Obj.scope){
    delete Obj.scope;
  }
  let redirectUri = URLs.split("?")[0] + `?${qs.stringify(Obj)}`; 
  redirectUri = urlencode(redirectUri);
  let queryStr = `appid=${appid}&redirect_uri=${redirectUri}&response_type=code&scope=${ scope ? "snsapi_base" : "snsapi_userinfo" }&state=STATE#wechat_redirect`;
  let url = "https://open.weixin.qq.com/connect/oauth2/authorize?" + queryStr;
  return window.location.replace(url);
};
// 编码
const urlencode = function (str) {
  str = (str + "").toString();
  return encodeURIComponent(str).replace(/!/g, "%21").replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A").replace(/%20/g, "+");
};
// Url参数解析 返回object
const urlResolver = function (url){
  let relust = qs.parse(url.split("?")[1]);
  return relust;
};
// 微信注入权限签名
const wxSha1Sign = function(data){
  let str = "";
  Object.keys(data).sort().forEach((key) => {
    str += `${key.toLowerCase()}=${data[key]}&`;
  });
  str = str.substr(0, str.lastIndexOf("&"));
  return sha1(str);
};
// 隐藏手机号中间四位
const phoneFormat = function (phone) {
  return phone.replace(/^(\d{3})\d{4}(\d+)/,"$1****$2")
}
// 手机号正则判断
const phoneRegExp=function(phoneNum){
  return (/^1[34578]\d{9}$/.test(phoneNum))
}
// 时间转换
const formateData = function(str) {
  const dateNow = moment().format("YYYY-MM-DD");
  const yesterday = moment(str).format("YYYY-MM-DD");
  const lessDay = moment(dateNow).diff(moment(yesterday), 'days');
  let strDay = ''
  switch (lessDay) {
    case 0: strDay = `今天 ${moment(str).format('HH:mm:ss')}`; break;
    case 1: strDay = `昨天 ${moment(str).format('HH:mm:ss')}`; break;
    default:
      const relatively = moment(dateNow).diff(moment(yesterday), 'years');
      if(relatively < 1) {
        if(relatively === 0){
          strDay = moment(str).format("MM-DD HH:mm:ss");
          break;
        } else {
          strDay = moment(str).format("YYYY-MM-DD HH:mm");
          break;  
        }
      } else {
        strDay = moment(str).format("MM-DD HH:mm");
        break;
      }
      
  }
  return strDay;
}
// 向上取整保留两个位小数
const keepTwoDecimalFull = function(num) {
  var result = parseFloat(num);
  if (isNaN(result)) {//不为数字时
    return 0;
  }
  result = Math.ceil(num * 100) / 100;
  var s_x = result.toString();
  var pos_decimal = s_x.indexOf('.');
  if (pos_decimal < 0) {
    pos_decimal = s_x.length;
    s_x += '.';
  }
  while (s_x.length <= pos_decimal + 2) {
    s_x += '0';
  }
  return s_x;
}
//Ways支付类型：1微信，2支付宝，3余额，4投币，5刷卡，6免费特权,7在线卡
const payModel = (type) =>{
  switch(type){
    case 1:
      return '微信';
    case 2:
      return '支付宝';
    case 3:
      return '余额';
    case 4:
      return '投币';
    case 5:
      return '刷卡';
    default:
      return '微信';
  }
}
//状态模式
const stateModel = (type) => {
  switch(type){
    case 1: 
      return '账户充值';
    case 2: 
      return '扫码充电';
    case 3: 
      return '预约付款';
    case 6: 
      return '免费充电特权卡充电';  //无属性
    case 7: 
      return '线上卡充电';//无属性
    case 9: 
      return '充电退款';//无属性
    default:
      return '账户充值';
  }
}
// 六分钟
const sixMinutes = (str) => {
  const a = moment(str).format();
  const b = moment().format();
  const c = moment(b).diff(a,'minute');
  if(c >= 6){
    return true;
  } else {
    return false;
  }
}
//判断系统
const selectSystem = function() { 
  const u = navigator.userAgent;
  const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
  const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
   if(isiOS){
    return 1;
  } else if(isAndroid){
    return 2;
  }
  // 判断浏览器
  // var ua = navigator.userAgent.toLowerCase();
  // if (ua.match(/MicroMessenger/i) == "micromessenger") {
  //   return true;
  // } else {
  //   return false;
  // }
}
//秒转小时分
const s_to_hs = function (Num){
  Num = Number(Num);
  let h = parseInt(Num / 60 / 60);
  let m = parseInt(Num / 60 % 60);
  // let s = parseInt(Num % 60);
  if(h > 0){
    return (h>0?`${h}小时`:'')+(m>0?`${m}分钟`:'');
  } else {
    return (h>0?`${h}小时`:'')+(m>0?`${m}分钟`:'0分钟');
  }
}
//分转小时分
const m_to_hs = function (Num){
  Num = Number(Num);
  let h = parseInt(Num / 60);
  let m = parseInt(Num % 60);
  if(h > 0){
    return (h>0?`${h}小时`:'')+(m>0?`${m}分钟`:'');
  } else {
    return (h>0?`${h}小时`:'')+(m>0?`${m}分钟`:'0分钟');
  }
}
//获取分钟的小时
const getH = function (Num){
  Num = Number(Num);
  let h = parseInt(Num / 60);
  return h>0?h:0;
}
//获取分中的分
const getM = function (Num){
  Num = Number(Num);
  let m = parseInt(Num % 60);
  return m>0?m:0;
}
// 跳转公用H5 公用模块
const goToModule =function(name,query={}){
  if(!name) return;
  let token = getLocal('userInfo')?urlResolver(getLocal('userInfo')).Token:'';
  query.token = token;
  window.open(`http://applet.diandian11.com/index.html#/${name}?${qs.stringify(query)}`)
}
export {
  setLocal,
  getLocal,
  removeLocal,
  setSession,
  getSession,
  removeSession,
  getQueryString,
  getUrlConcat,
  keepDecimal,
  centToUnit,
  unitToCent,
  multiAdd,
  generateMixed,
  compileUrl,
  urlencode,
  urlResolver,
  wxSha1Sign,
  phoneFormat,
  phoneRegExp,
  formateData,
  keepTwoDecimalFull,
  payModel,
  stateModel,
  sixMinutes,
  selectSystem,
  s_to_hs,
  m_to_hs,
  getH,
  getM,
  goToModule,
};
