import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BikeInfo, Toast, CarInfo, Interim, RemoteCharge } from '@/components';
import { chargingInfo, cancelCharging, restartDevice } from '@/api/api';
import { getQueryString } from '@/utils/commons';

import './chargeInfo.scss';

function mapStateToProps(state) {
  return {

  };
}

class chargeInfo extends Component {
  state = {
    orderInfo:{},//订单详情
    isToLoad: false,
    isRemote: false,
    parameter:{//远程续充参数
      Id:'', 
      DeviceNumber:'', 
      DeviceWay:''
    },
    TransId:'',//
  }
  componentDidMount(){
    let TransId = getQueryString('TransId',this.props.location.search)
    this.setState({
      TransId:TransId
    })
    this.getOrderInfo(TransId);
  }
  // 获取订单详情
  getOrderInfo(TransId){
    chargingInfo(TransId).then(({ success, data}) => {
      if( success ){
        this.setState({
          orderInfo: data,
          isToLoad: true 
        })
      }
    })
  }
  // 电瓶车点击按钮
  itemBtnBike = (status) => {
    const { orderInfo:{ Id, DeviceNumber, DeviceWay} } = this.state;
    if(status === 1) {
      this.cancelCharge( Id, DeviceNumber, DeviceWay)
    } else if(status === 2) {
      this.anewCharge(Id, DeviceNumber)
    } else if(status === 3) {
      this.setState({
        isRemote: true,
        parameter:{ Id, DeviceNumber, DeviceWay },
      })
    } else if(status === 4){
      this.goToCharge( DeviceNumber );
    }
  }
  // 取消充电
  cancelCharge(TransId, DeviceNumber, DeviceWay){
    cancelCharging(TransId, DeviceNumber, DeviceWay).then(({success})=>{
      if(success){
        Toast.success('操作成功',1500,()=>{
          this.props.history.replace('/home')
        })
      }
    })
  }
  // 重新启动
  anewCharge(Id, DeviceNumber){
    restartDevice(Id, DeviceNumber).then(({success})=>{
      if(success){
        Toast.success('操作成功')
        const { TransId } = this.state;
        this.getOrderInfo(TransId);
      }
    })
  }
  // 再充一次
  goToCharge (DeviceNumber) {
    this.props.history.replace(`/deviceBoot?deviceNumber=${DeviceNumber}`);
  }
  // 远程续充输入金额弹框关闭
  Remoteitem = (Bool)=>{
    this.setState({
      isRemote: Bool,
    })
  }
  // 远程支付结果
  remoteResults = (status, TransId=null, errormsg = null)=>{
    if(status){
      const { TransId } = this.state;
      this.getOrderInfo(TransId);
      Toast.success('续充成功')
    } else if(errormsg){
      Toast.success(errormsg)
    }
    console.log('续充',TransId)
    this.setState({
      parameter:{
        Id:'', 
        DeviceNumber:'', 
        DeviceWay:''
      },
    })
  }
  render() {
    const { isRemote, parameter, orderInfo, isToLoad } = this.state;
    return (
      <div className='chargeInfo_container'>
        { isToLoad
          ? <div className='container_center'>
              {
                true
                ? <BikeInfo
                    itemData={ orderInfo } 
                    itemBtn = { this.itemBtnBike } 
                  />
                : <CarInfo />
              }
            </div>
          : <Interim />
        }
        <RemoteCharge
          isRemote = {isRemote}
          parameter={parameter}
          RemoteFun={this.Remoteitem}
          remoteResults={this.remoteResults}
        />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
)(chargeInfo);