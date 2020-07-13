import asyncComponent from "@/utils/asyncComponent";
const login = asyncComponent(() => import("@/pages/login/login"));
const home = asyncComponent(() => import("@/pages/home/home"));
const record = asyncComponent(() => import("@/pages/record/record"));
const mine = asyncComponent(() => import("@/pages/mine/mine"));
const account = asyncComponent(() => import("@/pages/account/account"));
const tradinglist = asyncComponent(() => import("@/pages/tradingRecord/tradinglist"));
const tradingInfo = asyncComponent(() => import("@/pages/tradingInfo/tradingInfo"));
const deviceBoot = asyncComponent(() => import("@/pages/deviceBoot/deviceBoot"));
const deviceOpen = asyncComponent(() => import("@/pages/deviceOpen/deviceOpen"));
const chargeInfo = asyncComponent(() => import("@/pages/chargeInfo/chargeInfo"));
const favorite = asyncComponent(() => import("@/pages/favorite/favorite"));
const accountBalance = asyncComponent(() => import("@/pages/accountBalance/accountBalance"));
const balanceCharge = asyncComponent(() => import("@/pages/balanceCharge/balanceCharge"));
const myCardBag = asyncComponent(() => import("@/pages/myCardBag/myCardBag"));
const buyCard = asyncComponent(() => import("@/pages/buyCard/buyCard"));
const system = asyncComponent(() => import("@/pages/system/system"));
const routes = [
  {
    path: "/login",
    component: login,
    title: "登录",
  },
  {
    path: "/account",
    component: account,
    title: "手机号登录",
  },
  {
    path: "/home",
    component: home,
    title: "首页",
  },
  {
    path: "/mine",
    component: mine,
    title: "我的",
  },
  {
    path: "/record",
    component: record,
    title: "充电记录",
  },
  {
    path: "/tradinglist",
    component: tradinglist,
    title: "交易记录",
  },
  {
    path: "/tradingInfo",
    component: tradingInfo,
    title: "交易详情",
  },
  {
    path: "/deviceBoot",
    component: deviceBoot,
    title: "启动设备",
  },
  {
    path: "/deviceOpen",
    component: deviceOpen,
    title: "设备启动中",
  },
  {
    path: "/chargeInfo",
    component: chargeInfo,
    title: "充电详情",
  },
  {
    path: "/favorite",
    component: favorite,
    title: "我的收藏",
  },
  {
    path: "/accountBalance",
    component: accountBalance,
    title: "账户余额",
  },
  {
    path: "/balanceCharge",
    component: balanceCharge,
    title: "余额充值",
  },
  {
    path: "/myCardBag",
    component: myCardBag,
    title: "我的卡包",
  },
  {
    path: "/buyCard",
    component: buyCard,
    title: "购买",
  },
  {
    path: "/system",
    component: system,
    title: "系统设置",
  },
];

export default routes;