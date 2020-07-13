import { getLocal, urlResolver }  from '@/utils/commons';
// 公司信息
let companyInfo = getLocal('companyInfo')?urlResolver(getLocal('companyInfo')):{};
// 用户信息
let userInfo = getLocal('userInfo')?urlResolver(getLocal('userInfo')):{};
// 用户token
let Authorization = getLocal('userInfo')?urlResolver(getLocal('userInfo')).Token:'';
// openId
let openId = getLocal('openId')?getLocal('openId'):'';

let defaultState = {
  companyInfo:{
    companyName:'永意充电',
    logoUrl: '', 
    serviceTelephone: '057188583856', 
    serviceType: 1,
    subTitle: 1,
    ...companyInfo
  },
  userInfo: {
    AvatarUrl:'',
    ExistPassWord:'',
    Moblie:'',
    Name:'',
    Token:'',
    ...userInfo
  },
  Authorization: Authorization,
  openId: openId,
  isLogin: Authorization ? true : false,
  acountData: {
    TotalAccount:{
      AccountMoney: 0,
      Bao: 0,
      Coupon: 0,
      Mobile: "",
      Points: 0,
      UserName: ""
    },
    TotalCharge:{
      TotalHour: null,
      TotalTimes: null
    },
    userActivityReturn:{
      IsActivity: null,
      UseFrequency: null,
    },
  },//账户信息
};

const incrementReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "USERINFO": {
      return {
        ...state,
        Authorization: getLocal('userInfo')?urlResolver(getLocal('userInfo')).Token:'',
        isLogin: getLocal('userInfo')?(urlResolver(getLocal('userInfo')).Token?true:false):false,
        userInfo: {...state.userInfo,...action.userInfo},
      };
    }
    case "ACOUNTDATA": {
      return {
        ...state,
        acountData: {...action.acountData},
      };
    }
    default:
      return state;
  }
};
export default incrementReducer;
