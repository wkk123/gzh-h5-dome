import net from "./net";
import { business, order, device, newBusiness, newDevice, newOrder } from "./../config/index";
import store from '@/store/index';
import { setLocal, getUrlConcat, selectSystem } from '@/utils/commons';
// import { saveUserInfo } from '@/store/actions';
let { companyInfo:{ companyName }, userInfo:{ AvatarUrl, Name}, openId } = store.getState();//
// openId = 'oLD3504e0NhNO8tFk5tVQowsQWEo';
console.log('openId',openId);
console.log(store.getState());
// 设备类型
let Source = selectSystem();
// 获取Ticket 初始化微信扫码功能时使用
const getTicket = async () => {
  const data = await net.get(business + "v1/account/OfficialAccounts");
  return data;
};
// 获取 openid
const getOpenId = async (code) => {
  const data = await net.get(business + "v1/account/GZHGetOpenId", {
    code: code,
  });
  return data;
};
// 获取验证码
const getCode = async (Mobile) => {
  const data = await net.post(business + "v1/account/H5LogSendMobileCode", {
    Mobile: Mobile,
    CName: companyName,
  });
  return data;
};
// 手机号登录获取用户信息
const getUserInfo = async ( Mobile, MCode) => {
  const userData = await net.post(business + "v1/account/H5SmsLogin", {
    Mobile: Mobile,
    MCode: MCode,
    CodeType: 1,
    NickName: Name?Name:'',
    AvatarUrl: AvatarUrl?AvatarUrl:'',
  });
  const { success, data } = userData;
  console.log('success, data1',success, data)
  if(success){
    setLocal('userInfo',getUrlConcat(data));
  }
  return userData;
};
// 用户账号信息
const acountInfo =async (  ) => {
  const acountData = await net.post( business + 'v1/my/Index');
  return acountData;
};
//充电 界面 公众号支付
const gzhPayPayment =async ( Money, DeviceType, DeviceNumber, Ways, PayType = 1, OpenId = openId ) => {
  const data = await net.post( order+'v1/scan/WXGZHPay', {
    Money: Money,
    DeviceType: DeviceType,
    DeviceNumber: DeviceNumber,
    Ways: Ways,
    PayType: PayType,//支付类型1微信、2支付宝、3余额
    OpenId: OpenId,
    ActicityId:0,
    ActivitySchemeId:0,
    Source: Source,
    TransactionType:'2',
    InvitationCode:'',
    Hour:'0',
    Id:'0',
  });
  return data;
};
// java环境 循环请求余额支付结果接口
const loopBalancePay =async ( TransId ) => {
  const data = await net.post( order + 'v1/scan/loopBalancePay', {
    TransId: TransId
  });
  return data;
};
//充电柜开门
const openDoor =async ( orderId ) => {
  const data = await net.post( "v1/scan/RenewSendOpenOrder", {
    TranId: orderId,
  });
  return data;
};
//充电详情
const chargingInfo =async ( orderId ) => {
  const data = await net.post( order+'v1/scan/AppletsChargingInfo', {
    Id: orderId,
  });
  return data;
};
//重新启动
const restartDevice =async ( TransId, DeviceNumber ) => {
  const data = await net.post( order+'v1/scan/ResendDevicerInstruction', {
    TransId: TransId,
    DeviceNumber: DeviceNumber,
  });
  return data;
};
// 取消充电 执行
const cancelCharging =async ( TransId, DeviceNumber, DeviceWay ) => {
  const data = await net.post( order + 'v1/scan/WXAppletsRefund', {
    TransId: TransId,
    DeviceNumber: DeviceNumber,
    DeviceWay: DeviceWay,
    Id: 0,
  });
  return data;
};
// 充电柜 取消充电
const cabinetCancelCharging =async ( Id, TransId, DeviceNumber, DeviceWay ) => {
  const data = await net.post( order + 'v1/scan/CabinetQXRefund', {
    Id: Id,
    TransId: TransId,
    DeviceNumber: DeviceNumber,
    DeviceWay: DeviceWay
  });
  return data;
};
// 远程续充（ 仅支持 电瓶车充电桩 ）
const remoteCharging =async ( Id, Money, DeviceNumber, DeviceWay, PayType = 1, OpenId = openId ) => {
  const data = await net.post( order + 'v1/scan/AppletsRePay', {
    Id: Id,
    Money: Money,//金额
    DeviceNumber: DeviceNumber,//设备号
    Ways: DeviceWay,//路数
    PayType: PayType,//支付方式
    OpenId: OpenId,
    Source: Source,
    TransactionType: 2,
    Hour: 0,
    InvitationCode: '',
    DeviceType: 1,
    ActicityId: 0,
    ActivitySchemeId: 0,
  });
  return data;
};
// 交易记录
const tradingRecord =async ( Page ) => {
  const data = await net.post( order + 'v1/my/AppletsTransrecord', {
    Page: Page
  });
  return data;
};
// 充值时 支付
const payMoney =async ( ActicityMoney, PayType = 1, ActicityId = 0, ActivitySchemeId = 0, ActicityType = 0 ) => {
  const data = await net.post( 'v1/Activitys/ActivityRecharge', {
    ActicityMoney: ActicityMoney,//金额
    PayType: PayType,//支付方式 微信1 支付宝2
    ActicityId: ActicityId,
    ActivitySchemeId: ActivitySchemeId,
    ActicityType: ActicityType,
    Source: Source,
  });
  return data;
};
//获取设备信息
const getDeviceInfo =async ( DeviceNumber ) => {
  const data = await net.post( device +'v1/scan/Index', {
    DeviceNumber: DeviceNumber
  });
  return data;
};
//刷新设备信息
const refreshDeviceInfo =async ( DeviceNumber ) => {
  const data = await net.post( device+'v1/scan/DeviceInfoNew', {
    DeviceNumber: DeviceNumber
  });
  return data;
};
// 我的所有的设备收藏列表
const collectionList =async ( Page ) => {
  const data = await net.post( business+'v1/my/Favoritesrecord', {
    Page: Page
  });
  return data;
};
// 收藏设备
const collect =async ( DeviceNumber ) => {
  const data = await net.post( business + 'v1/search/AddFavorites', {
    DeviceNumber:DeviceNumber
  });
  return data;
};
// 取消设备收藏
const cancelCollect =async ( Id ) => {
  const data = await net.post( business + 'v1/my/CancelFavorites', {
    Id:Id
  });
  return data;
};
// 获取充电记录列表
const getRecordList = async ( Page ) => {
  const data = await net.post( order + "v1/scan/AppletsCharging", {
    Page: Page,
  });
  return data;
};
//我的卡片
const userCardBag = async ( ) => {
  const data = await net.get( newBusiness + 'user/userCard/applet/userQuery');
  return data;
};
//卡号适用范围
const cardUsedScope = async ( tenantId, latitude, longitude) => {
  const data = await net.get( newDevice + 'device/applet/cardUsedScope',{
    tenantId: tenantId,
    latitude: latitude,
    longitude: longitude,
  });
  return data;
};
// 购买线上卡
const buyOnlineCard = async ( money, deviceNumber, payType = 1 ) => {
  const data = await net.post( newOrder +'order/applet/buyOnlineCard', {
    money: Number(money)*100,//充值或购卡金额  转为分
    deviceNumber: deviceNumber,
    payType: payType,
    Source: Source,
  });
  return data;
};
// 线上卡充值
const rechargeUpCard = async ( money, cardKey, payType = 1 ) => {
  const data = await net.post( newOrder +'order/applet/rechargeUpCard', {
    money: Number(money)*100,//充值或购卡金额  转为分
    cardKey: cardKey,
    payType: payType,
    Source: Source,
  });
  return data;
};
// 绑定线上卡
const userBind = async ( cardKey, id ) => {
  const data = await net.post( newBusiness+'user/userCard/app/userBind', {
    cardKey: cardKey,//卡号
    userCardId: id,//线上卡记录编号
  });
  return data;
};
// 解绑线上卡
const userUnbind = async ( cardKey, id ) => {
  const data = await net.post( newBusiness+'user/userCard/app/userUnbind', {
    cardKey: cardKey,//卡号
    userCardId: id,//线上卡记录编号
  });
  return data;
};
export { 
  getCode,
  getUserInfo, 
  getTicket, 
  getOpenId, 
  getRecordList, 
  openDoor,
  chargingInfo,
  restartDevice,
  cancelCharging,
  cabinetCancelCharging,
  remoteCharging,
  collect,
  cancelCollect,
  collectionList,
  tradingRecord,
  acountInfo,
  payMoney,
  getDeviceInfo,
  refreshDeviceInfo,
  gzhPayPayment,
  loopBalancePay,
  userCardBag,
  cardUsedScope,
  buyOnlineCard,
  rechargeUpCard,
  userBind,
  userUnbind
};