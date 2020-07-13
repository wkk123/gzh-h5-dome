import React, { Component } from 'react';
import { Popup } from 'react-weui';
import { Modal, WayList, MoneyList } from '@/components';
import {  gzhPayPayment, loopBalancePay } from '@/api/api';
import { imgUrl }  from '@/config'
import { getH, getM } from '@/utils/commons';


import classnames from 'classnames';

import PropTypes from 'prop-types';

class payWay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isWay: false,
      isModal: false,
      userDefined: 0,//自定义金额
      wayType: 3,//支付类型 默认余额
      moneyIndex: -1,
    }
  }

  componentDidMount() {
    console.log('this.props',this.props)
  }

  componentWillUnmount() {

  }
  // 立即支付
  payBtn = () => {
    const { dataInfo:{ Number, DeviceType }, DeviceWayId, chargeMoney} = this.props;
    const {  wayType } = this.state;
    if(!chargeMoney) return;
    gzhPayPayment(chargeMoney, DeviceType, Number, DeviceWayId, wayType).then(({success, data, errormsg})=>{
      if(success){
        const { TransactionsId } = data;
        //余额支付
        if( wayType === 3 ) {
          this.props.closePayPopup(true, TransactionsId);
          this.javaLoopBalancePay( TransactionsId);
        } else {//微信
          const { wxPayData:{ m_values} } = data;
          this.wxPayment( m_values, TransactionsId);
        }
      } else {
        this.props.closePayPopup(false);
        this.props.payResult(false, null, errormsg);
      }
    }).catch(error => {
      console.error('支付结果',error);
      this.props.payResult(false);
    });
  }
  //java 循环调用
  javaLoopBalancePay = (TransId) =>{
    loopBalancePay(TransId).then(({ success, errormsg}) => {
      if(success){
        clearTimeout(this.javaPay)
        this.props.payResult(true, TransId, errormsg);
      } else {
        let self = this;
        this.javaPay = setTimeout(()=>{
          self.javaLoopBalancePay(TransId,errormsg);
        },1000)
      }
    })
  }
  // 微信支付
  wxPayment =(data, transactionId)=>{
    let that = this;
    window.wx.chooseWXPay({
      timestamp:data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
      nonceStr:data.nonceStr, // 支付签名随机串，不长于 32 位
      package:data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
      signType:data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
      paySign:data.paySign,// 支付签名
      success: function (res) {
        if(res.err_msg === "get_brand_wcpay_request：ok"||res.errMsg === "chooseWXPay:ok"){
          that.props.payResult(true, transactionId,'支付成功');
          that.props.closePayPopup(true, transactionId);
        } else{
          that.props.payResult(false, transactionId,'支付失败');
        }
      }
    });
  }
  //预付时间文本
  prepayWord(){
    const { chargeMoney, dataInfo:{  ChargingType, perMinute, CarDeviceConfig, timeFixedCostConfigList} } = this.props;
    let Time = '';
     if(ChargingType === 0){
      Time = chargeMoney * perMinute;
    } else if(ChargingType === 1){
      Time = (Math.round(chargeMoney/CarDeviceConfig.ElectricityDu * 100)/100);
    } else if(ChargingType === 3){
      if(timeFixedCostConfigList &&timeFixedCostConfigList.length!==0){
        timeFixedCostConfigList.forEach((item)=>{
          if(item.money === chargeMoney){
            return Time = item.deviceDefaultHour;
          }
        })
      }
    }
    return(
      <p className='font3'>
        {'预付：'}
        <span className='font28'>{Number(chargeMoney).toFixed(2)}</span>
        {' 元 '}
        {ChargingType === 1
          ? <em>
              <span className='fontPrimary'>{Time}</span>
              {'度'}
            </em>
          : (ChargingType !== 2 &&(
            getH(Time)>0
            ? <em>
                <span className='fontPrimary'>{getH(Time)}</span>
                {'小时'}
                { getM(Time) >0
                  ? <em>
                      <span className='fontPrimary'>{getM(Time)}</span>
                      {'分钟'}
                    </em>
                  : ''
                }
              </em>
            : getM(Time) >0
              ? <em>
                  <span className='fontPrimary'>{getM(Time)}</span>
                  {'分钟'}
                </em>
              : ''
            ))
        }
      </p>
    )
  }
  // 计费方式文本
  chargingWord(Num){
    switch(Num){
      case 0:
        return '时间';
      case 1:
        return '电量';
      case 2:
        return '功率';
      case 3:
        return '固定';
      default:
        return '时间'
    }
  }
  render() {
    const {  isWay, isModal, userDefined, wayType, moneyIndex } = this.state;
    const { isPopup, DeviceWayId, chargeMoney } = this.props;
    const { dataInfo:{ ChargingType, timeFixedCostConfigList }} = this.props;
    return (
      <div className='payWay_box'>
        <Popup
          show={isPopup}
          onRequestClose={()=>{
            this.setState({
              userDefined: 0,
              moneyIndex: -1,
            },()=>{
              this.props.closePayPopup()
            })
          }}
        >
          <div className='popup_box'>
            <ul className='popup_hearde'>
              <li 
                className={classnames('hearde_tiem','close')}
                onClick={()=>{
                  this.setState({
                    userDefined: 0,
                    moneyIndex: -1,
                  },()=>{
                    this.props.closePayPopup()
                  })
                }}
              ></li>
              <li className='hearde_title'>支付</li>
              <li className={classnames('hearde_tiem')}></li>
            </ul>
            <div className='popup_center'>
              <div className='center_item'>
                <h6 className='font3'>充电金额<span className='font9'>{`（按${this.chargingWord(ChargingType)}计费）`}</span></h6>
                <h6 className='font3'>{DeviceWayId&&`充电口：${DeviceWayId}号`}</h6>
              </div>
              <MoneyList 
                List={ChargingType !== 3?[1,2,3,4,5,6]:timeFixedCostConfigList}
                userDefined = {userDefined}
                moneyIndex = {moneyIndex}
                itemMoney={( money, index )=>{
                  if(index === 5){
                    this.setState({
                      isModal: true,
                      moneyIndex: index,
                    })
                  } else {
                    this.setState({
                      userDefined: 0,
                      moneyIndex: index,
                    })
                  }
                  this.props.selectMoneyFun(money)
                }}
              />
              <div className={classnames('center_item',false&&'border')}>
                <h6 className='font9'>支付方式</h6>
                <p className='item_text' 
                  onClick={()=>{
                    this.setState({
                      isWay: true,
                    })
                  }}
                >
                  <span className='font3'>{wayType === 3?'账户余额':'微信'}</span>
                  <span className='font9'>{wayType === 3&&'（默认）'}</span>
                  <img className='item_icon' src={imgUrl+'icon/right.png'} alt="icon" />
                </p>
              </div>
              {/* <div className='center_item'>
                <h6 className='font9'>线上卡充电</h6>
                <p className='item_text'>
                  <span className='fontPrimary'>点击购买</span>
                  <img className='item_icon' src={imgUrl+'icon/right.png'} alt="icon" />
                </p>
              </div> */}
              <div className='center_item bottom'>
                {this.prepayWord()}
                <div 
                  className={classnames('item_btn',chargeMoney&&'active')}
                  onClick={()=>{
                    this.setState({
                      userDefined: 0,
                      moneyIndex: -1,
                    },()=>{
                      this.payBtn()
                    })
                  }}
                >去支付</div>
              </div>
            </div> 
          </div>
        </Popup>
        <WayList 
          wayItem={(type)=>{
            this.setState({
              isWay: false,
              wayType: type,
            })
          }}
          isMoneyWay={isWay} 
          isChecked={wayType}
        />
        {isModal&&<Modal 
          type={'input'}
          title={'输入金额(元)'}
          inputType={'number'}
          cancel={'取消'}
          confirm={'确定'}
          cancelBtn={()=>{
            this.setState({
              isModal: false
            })
          }}
          confirmBtn={(value)=>{
            this.setState({
              isModal: false,
              chargeMoney: Number(value),
              userDefined: Number(value)
            },()=>{
              this.props.selectMoneyFun(value)
            })
          }}
          placeholder={'请输入 0.01-10000 的数字'}
          min={0.01}
          max={10000}
        />}
      </div>
    );
  }
}

payWay.propTypes = {
  payResult: PropTypes.func.isRequired,
  chargeMoney: PropTypes.number.isRequired,
  DeviceWayId:  PropTypes.number.isRequired,
  dataInfo: PropTypes.object.isRequired,
  isPopup: PropTypes.bool.isRequired,
  closePayPopup: PropTypes.func.isRequired,
  selectMoneyFun:PropTypes.func.isRequired,
};
payWay.defaultProps = {
  isPopup: false,
  chargeMoney:0,
  DeviceWayId: 0,
  dataInfo: {},//ChargingType, Number, DeviceType, Money, PerHour, CarDeviceConfig
  closePayPopup: ()=>{},
  selectMoneyFun:()=>{},
  payResult: ()=>{},
};

export default payWay;