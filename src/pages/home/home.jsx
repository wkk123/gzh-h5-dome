import React, { Component } from 'react'
import { GZHAppId, phone, isBrowser } from '@/config';
import Banner from './banner/banner';
import RichScan from './richScan/richScan';
import { Card, Modal, Footer } from '@/components';
import './home.scss';
import {imgUrl} from '@/config';
import { compileUrl, getQueryString, wxSha1Sign, generateMixed, urlResolver, setLocal, getLocal, getUrlConcat } from '@/utils/commons';
import { getTicket, getOpenId } from '@/api/api';
import store from '@/store';

class home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardList: [
        { icon: imgUrl + "module/1.svg", title: "快速充值", pathname: "accountBalance", type: 'gzh' },
        { icon: imgUrl + "module/3.svg", title: "在线卡", pathname: "myCardBag", type: 'gzh' },
        { icon: imgUrl + "module/4.svg", title: "我的收藏", pathname: "favorite", type: 'gzh' },
      ],
      isModal: false,
      ...store.getState()
    };
  }

  componentDidMount() {
    this.initialize();
    this.permissionSetting();
  }
  //初始化 获取url公司信息 与 openid
  initialize() {
    const Url = window.location.href;
    let companyInfo = urlResolver(Url.split("#")[0]);
    let companyName = companyInfo.companyName ? decodeURI(companyInfo.companyName) : '永意充电';
    companyInfo.companyName = companyName;
    companyInfo.serviceTelephone = phone;
    document.title = companyName;
    setLocal('companyInfo', getUrlConcat(companyInfo));
    if (!isBrowser && !getQueryString('code', Url)) {
      compileUrl(Url, companyInfo)
    } else {
      const openId = getLocal('openId');
      const code = getQueryString('code', Url);
      if (!openId && code) {
        getOpenId(code).then(({ success, data }) => {
          if (success && data) {
            setLocal('openId', data);
          }
        })
      }
    }
  }
  // 通过config接口注入权限验证配置
  permissionSetting(){
    getTicket().then(({success, data})=>{
      if (success){
        const Obj = {
          jsapi_ticket: data,
          nonceStr: generateMixed(8),
          timestamp: new Date().getTime(),
          url: window.location.href.split("#")[0],
        };
        const sign = wxSha1Sign(Obj);
        window.wx.config({
          debug: false,
          appId: GZHAppId,
          timestamp: Obj.timestamp, 
          nonceStr: Obj.nonceStr, 
          signature: sign,
          jsApiList: ['scanQRCode', 'chooseWXPay'], // 必填，需要使用的JS接口列表
        });    
      }
    })
    
  }
  // 扫码
  scanQRCodeBtn =()=> {
    const { isLogin } = this.state;
    if(!isLogin){
      this.loginfun()
      return;
    }
    let that = this;
    window.wx.scanQRCode({
      needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
      success: function (res) {
        const { resultStr } = res;
        let deviceNum = ''
        let index = resultStr.lastIndexOf("id=");
        if (index !== -1) {
          deviceNum  = resultStr.substr(index + 3)
        }
        that.props.history.push(`/deviceBoot?deviceNumber=${deviceNum}`);
      }
    });
  }
  // 点击输入设备编码 打开弹框
  richScan =()=> {
    const { isLogin } = this.state;
    if(!isLogin){
      this.loginfun()
      return;
    }
    this.setState({
      isModal:true
    })
  }
  // 跳转登录
  loginfun =() =>{
    const { pathname } = this.props.location;
    this.props.history.push({pathname:'login', query:{ pathname:pathname }})
  }
  render() {
    const { cardList, isModal } = this.state;
    return (
      <div className="home_container">
        <div className="home_content">
          <Banner />
          <Card cardList={cardList} />
          <RichScan 
            scanQRCodeBtn = {this.scanQRCodeBtn}
            inputNumber={this.richScan}
          />  
        </div>
        {isModal&&<Modal 
          type={'input'}
          title={'输入充电桩编号'}
          cancel={'取消'}
          confirm={'确定'}
          cancelBtn={()=>{
            this.setState({
              isModal: false
            })
          }}
          confirmBtn={(value)=>{
            this.setState({
              isModal: false
            },()=>{
              this.props.history.push(`/deviceBoot?deviceNumber=${value}`);
            })
          }}
          placeholder={'输入充电桩编号'}
          maxLength={8}
        />}
        <Footer />
      </div>
    );
  }
}

export default home