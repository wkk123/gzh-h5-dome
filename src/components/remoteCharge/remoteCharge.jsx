import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, WayList } from '@/components';
import { remoteCharging, loopBalancePay } from '@/api/api'

import './remoteCharge.scss';

class remoteCharge extends Component {
  constructor(props) {
    super(props);
    this.state={
      isWay: false,
      wayType: -1,//支付类型 默认余额
      chargeMoney: 0,
    } 
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }
  // 远程续充
  longRangeCharge =(chargeMoney, wayType)=>{
    const { parameter:{ Id, DeviceNumber, DeviceWay }} = this.props;
    this.setState({
      wayType: -1,//支付类型 默认余额
      chargeMoney: 0,
    },()=>{
      remoteCharging(Id, chargeMoney, DeviceNumber, DeviceWay, wayType).then(({success, data, errormsg})=>{
        if(success){
          console.log('data',data);
          const { TransactionsId } = data;
          this.props.remoteResults(true, TransactionsId, errormsg);
          //余额支付
          if( wayType === 3 ) {
            this.javaLoopBalancePay( TransactionsId, errormsg );
          } else {//微信
            const { wxPayData:{ m_values} } = data;
            this.wxPayment( m_values, TransactionsId);
          }
        } else {
          this.props.remoteResults(success,null,errormsg);
        }
      }).catch(error => {
        console.error('支付结果',error);
        this.props.remoteResults(false);
      });
    })
  }
  //java 循环调用
  javaLoopBalancePay = (TransId, errormsg) =>{
    loopBalancePay(TransId).then(({success}) => {
      if(success){
        clearTimeout(this.javaPay)
        this.props.remoteResults(true, TransId, errormsg);
      } else {
        let self = this;
        this.javaPay = setTimeout(()=>{
          self.javaLoopBalancePay(TransId, errormsg);
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
        if(res.err_msg === "get_brand_wcpay_request：ok"||res.errMsg === "chooseWXPay:ok" ){
          that.props.remoteResults(true, transactionId,'支付成功');
        } else{
          that.props.remoteResults(false, transactionId,'支付失败');
        }
      }
    });
  }

  render() {
    const {  isWay, wayType, chargeMoney } = this.state;
    const { isRemote } = this.props;
    return (
      <div className='remoteCharge_box'>
        <WayList 
          wayItem={(type)=>{
            this.setState({
              isWay: false,
              wayType: type,
            },()=>{
              this.longRangeCharge(chargeMoney, type)
            })
          }}
          isMoneyWay={isWay} 
          isChecked={wayType}
        />
        {isRemote&&<Modal 
          type={'input'}
          title={'输入金额(元)'}
          inputType={'number'}
          cancel={'取消'}
          confirm={'确定'}
          cancelBtn={()=>{this.props.RemoteFun(false)}}
          confirmBtn={(value)=>{
            this.setState({
              isWay: true,
              chargeMoney: value,
            },() => {
              this.props.RemoteFun(false);
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

remoteCharge.propTypes = {
  RemoteFun: PropTypes.func.isRequired,
  remoteResults: PropTypes.func.isRequired,
  parameter: PropTypes.object.isRequired,
  isRemote: PropTypes.bool.isRequired,
};
remoteCharge.defaultProps = {
  RemoteFun: ()=>{},
  remoteResults:()=>{},
  parameter: {
    Id:'',
    DeviceNumber:'', 
    DeviceWay:'',
  },
  isRemote: false,
};

export default remoteCharge;