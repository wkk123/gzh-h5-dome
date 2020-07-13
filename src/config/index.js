// 全局配置

let baseUrl = '';
let GZHAppId = '';
let APPSECRET = '';
let WXPAYKEY = ''; 
let isBrowser = '';
if (process.env.NODE_ENV === 'development'){//开发

  baseUrl = "https://api.hzchaoxiang.cn/";
  GZHAppId = "wx6d889bd8291edc13";
  APPSECRET = "37650C59045F44899C1F8A2FCEC8B051";
  WXPAYKEY = "OcfGygv7Yhck7CmUr7ATFv1fEKwU2QDH"; 

  // baseUrl = "https://api.saas.diandian11.com/gwx/";
  // GZHAppId = "wx73289560a665d730";
  // APPSECRET = "1337edb265908fe532c0f32cfc13d615";
  // WXPAYKEY = "CC9FAE299961298C1ABAFBAC6F863C0F";
  isBrowser = true;
} else if (process.env.NODE_ENV === 'production') {//生产 及上线
  baseUrl = "https://api.saas.diandian11.com/gwx/";
  // baseUrl = "https://api.hzchaoxiang.cn/";
  // GZHAppId = "wx6d889bd8291edc13";
  // APPSECRET = "37650C59045F44899C1F8A2FCEC8B051";
  // WXPAYKEY = "OcfGygv7Yhck7CmUr7ATFv1fEKwU2QDH"; 
  GZHAppId = "wx73289560a665d730";
  APPSECRET = "1337edb265908fe532c0f32cfc13d615";
  WXPAYKEY = "CC9FAE299961298C1ABAFBAC6F863C0F";
  isBrowser = false;
}
const imgUrl = 'https://changchong.oss-cn-hangzhou.aliyuncs.com/gzh/';
const phone = "057188583856";

const business = "api-business/api/";
const device = "api-device/api/";
const order = "api-order/api/";

const newBusiness = 'api-business/';
const newDevice = 'api-device/';
const newOrder = 'api-order/';

export { 
  baseUrl, 
  GZHAppId,
  APPSECRET,
  WXPAYKEY,
  isBrowser,
  imgUrl,
  phone,
  business, 
  device, 
  order,
  newBusiness,
  newDevice,
  newOrder
};
