import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getDeviceInfo, collect, cancelCollect, refreshDeviceInfo } from '@/api/api';
import classnames from 'classnames';
import { PayWay, Interim, Toast } from '@/components';
import { getUrlConcat, getH, getM } from '@/utils/commons';
import './deviceBoot.scss'

export class deviceBoot extends Component {
  constructor(prpos){
    super(prpos)
    this.state = {
      dataInfo: {
        Device: {},
        CarDeviceConfig: {
          ElectricityDu: 0,
        },
        DeviceConfig: {
          PowerFirstTime: 0,
        }
      },//设备信息
      isPopup: false,
      current: 0,//当前端口索引
      portData: {},//当前端口信息
      isCollect: false,//收藏
      isRefresh: false,//点击刷新
      chargeMoney: 0,//充电金额
      numArray: [ '一', '二', '三', '四', '五', '六', '七', '八', '九', '十' ],
    }
  }
  
  componentDidMount(){
    const query_params = new URLSearchParams(this.props.location.search);
    const deviceNumber = query_params.get('deviceNumber');
    this.deviceInfo(deviceNumber);

  }
  componentWillUnmount () {

  }
  // 获取设备信息
  deviceInfo (Num) {
    getDeviceInfo(Num).then(({ success, data, errormsg })=>{
      if(success){
        // IsFavorites 1收 0 取消
        const { IsFavorites } = data;
        this.setState({
          dataInfo: data,
          isCollect: Number(IsFavorites) === 1
        })
      } else {
        this.props.history.replace('/home')
        Toast.fail( errormsg)
      }
    })
  }
  //信号
  deviceSignal = (signals) => {
    signals = Number(signals);
    if(!signals)return;
    let signal = 0;
    if (signals < 4 || signals >= 99) {
      signal = 0;
    } else if (signals < 10) {
      signal = 1;
    } else if (signals < 16) {
      signal = 2;
    } else if (signals < 22) {
      signal = 3;
    } else if (signals < 28) {
      signal = 4;
    } else {
      signal = 5;
    }
    return signal;
  }
  // 充电状态文本
  statusWord(item){
    if(item.TranId && item.State === 1){
      return '充电中';
    } else if(item.State === 1){
      return `${item.TimeLeft!==0?'剩'+item.TimeLeft.toFixed(0)+'分':''}`;
    } else if(item.State === 2){
      return '空闲';
    } else if(item.State === 3){
      return '故障';
    }
  }
  // 充电状态颜色
  statusClass(item){
    if(item.TranId && item.State === 1){
      return 'charging';
    } else if(item.State === 1){
      return 'occupy';
    } else if(item.State === 2){
      return '';
    } else if(item.State === 3){
      return 'fault';
    }
  }
  // 计费方式文本
  chargingWord(Num){
    switch(Num){
      case 0:
        return '按时间计费';
      case 1:
        return '按电量计费'
      case 2:
        return '按功率计费';
      case 3:
        return '固定计费';
      default:
        return '';
    }
  }
  // 是否收藏
  collectBtn =(isCollect,data)=>{
    if(!isCollect){
      collect(data.Number).then(({success})=>{
        if(success){
          Toast.success('收藏成功')
          this.setState({
            isCollect: !isCollect, 
          })
        }
      })
    } else {
      cancelCollect(data.Id).then(({success})=>{
        if(success){
          Toast.success('取消收藏')
          this.setState({
            isCollect: !isCollect,
          })
        }
      })
    }
  }
  // 刷新数据
  refreshBtn =(data)=>{
    Toast.loading('加载数据...',1000);
    this.setState({
      isRefresh: true
    },()=>{
      refreshDeviceInfo(data.Number).then(({ success, data, errormsg })=>{
        if(success){
          // IsFavorites 1收 0 取消
          const { IsFavorites } = data;
          this.setState({
            dataInfo: data,
            isCollect: Number(IsFavorites) === 1
          })
        } else {
          this.props.history.replace('/home')
          Toast.fail( errormsg)
        }
      })
      this.isRefreshTime = setTimeout(()=>{
        clearTimeout(this.isRefreshTime)
        this.setState({
          isRefresh: false
        })
      },800)
    })
  }
  // 点击某个端口
  itemPort =(Num,item)=>{
    //item.State: 1 表示被占用，2 表示空闲，3 表示故障
    if(item.State === 1){
      if(item.InvitationCode === 'Code'){
        console.log('应急充电')
      } else if(item.TranId){
        this.props.history.push(`/chargeInfo?TransId=${item.TranId}`);
      } else {
        Toast.fail('端口被占用')
      }
    } else if(item.State === 3){
      Toast.fail('端口故障')
    } else if(item.State === 2){
      this.setState({
        current: Num,
        isPopup: true,
        portData: item,
      })
    }
  }
  // 支付结果 处理
  paymentResult =( status, TransId = null, errormsg)=>{
    const { chargeMoney, dataInfo:{Device:{ Number, DeviceType } } } = this.state;
    let query = {
      status: status?1:2,
      chargeMoney: chargeMoney,
      DeviceNumber: Number,
      DeviceWay: DeviceType,
      TransId: TransId?TransId:'',
      errmsg: errormsg?errormsg:'',
    }
    this.setState({
      chargeMoney: 0,
    },()=>{
      this.props.history.push(`/deviceOpen${getUrlConcat(query)}`);
    })
  }
  // 弹框关闭
  closePayPopup =( status = false, TranId )=>{
    const {  current, dataInfo:{ DeviceWays }} = this.state;
    if(status){
      DeviceWays[current - 1].TranId = TranId;
      DeviceWays[current - 1].State = 1; 
    }
    this.setState({
      isPopup: false,
      current: 0,
    })   
    if(!status){
      this.setState({
        chargeMoney:0
      })
    }
  }
  // 选择金额
  selectMoneyFun =(money)=>{
    this.setState({
      chargeMoney: money,
    })
  }
  // 单价文本 计费方式文本 按时间计费 按电量计费
  unitPriceWord(){
    const { dataInfo:{ ChargingType, Device:{ perMinute }, CarDeviceConfig} } = this.state;
    if(ChargingType === 0){
      return `1元=${getH(perMinute) > 0 ?(getH(perMinute)+'小时'):''}${getM(perMinute)>0?(getM(perMinute)+'分钟'):''}`;
    } else if(ChargingType === 1){
      return `1度=${(CarDeviceConfig.ElectricityDu)}元`;
    }
  }
  // 计费方式文本 安功率计费 固定计费
  powerWord =()=> {
    const { numArray, dataInfo:{ DeviceConfig:{ powConfigList }, ChargingType, timeFixedCostConfigList} } = this.state;
    return (
      <ul className='powerWord_box'>
        {
          ChargingType === 2
          ? powConfigList&&powConfigList.map((item,index)=>
            <li className='powerWord_item' key={'charging2'+index}>
              <h5 className='item_label'>{`第${numArray[index]}档:`}</h5>
              <span>{`${item.startPow}瓦${item.endPow !== 999? (' < '+item.endPow + '瓦') : '以上'}，${item.powTime}分钟/元`}</span>
            </li>
            )
          : (ChargingType === 3&&timeFixedCostConfigList)&&timeFixedCostConfigList.map((item,index)=>
              <li className='powerWord_item' key={'charging3'+index}>
                <h5 className='item_label'>{`第${numArray[index]}档:`}</h5>
                <span>{`${item.money}元=${item.deviceDefaultHour}分钟`}</span>
              </li>
            )
        }
      </ul>
    )
  }
  
  render() {
    const { isPopup, isCollect, isRefresh, current, portData:{ DeviceWayId }, chargeMoney } = this.state;
    const { dataInfo:{ ChargingType, timeFixedCostConfigList, Device, Device:{ Name, Number, Signals,DeviceType, perMinute }, CarDeviceConfig, DeviceWays }} = this.state;
    return (
      <div className='device_container'>
        {
          Object.keys(Device).length !== 0
          ? <div className='device_box'>
              <div className='device_info'>
                <div className='info_title'>
                  <h6 className='title_center'>
                    <em className="title_icon"></em>
                    <span className="title_text">{Name}</span>  
                  </h6>
                  <ul className='info_signal'>
                    {[1,2,3,4,5].map((item)=>
                      <li className={classnames(`signal_item${item}`,this.deviceSignal(Signals)>item &&'active')} key={'id'+item}></li>
                    )}
                  </ul>
                </div>
                <div className='info_number'>
                  <span>{`设备编号：${Number}`}</span>
                  <div className='info_btn'>
                    <button 
                      className={classnames('btn_collect', isCollect &&'active')} 
                      onClick={()=>{this.collectBtn(isCollect, Device)}}
                    ></button>
                    <button 
                      className={classnames('btn_refresh',isRefresh&&'active')} 
                      onClick={()=>{this.refreshBtn(Device)}}
                    ></button>
                  </div>
                </div>
              </div>
              <ul className='port_box'>
                {
                  DeviceWays&&DeviceWays.map((item,index)=>
                  <li 
                    key={'id'+item.DeviceWayId} 
                    onClick={()=>{this.itemPort(index+ 1,item)}} 
                    className={classnames('port_item',(index+ 1) === current&&'active',this.statusClass(item))
                  }>
                    <div className='item_way'>{item.DeviceWayId}</div>
                    <div className='item_explain'>{this.statusWord(item)}</div>
                  </li>)
                }
              </ul>
              <ul className='device_ways'>
                <li className={classnames('ways_title')}>
                  <p className='title_info'>
                    <em className='info_icon'></em>
                    <span>{this.chargingWord(ChargingType)}</span>
                  </p>
                </li>
                <li className={classnames('ways_title')}>
                  <p className='title_info'>
                    <span>计费方式</span>
                  </p>
                  <span className='ways_info'>{this.unitPriceWord()}</span>
                </li>
                {this.powerWord()}
              </ul>
              <PayWay 
                isPopup={isPopup}
                DeviceWayId ={DeviceWayId}
                dataInfo={{ChargingType, Number, DeviceType, perMinute, CarDeviceConfig, timeFixedCostConfigList}}
                chargeMoney={chargeMoney} 
                closePayPopup={this.closePayPopup}
                selectMoneyFun={this.selectMoneyFun}
                payResult={this.paymentResult}
              />
            </div>
          : <Interim />
        }
      </div>
      
    )
  }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(deviceBoot)
