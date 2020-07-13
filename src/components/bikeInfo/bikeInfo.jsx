import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { sixMinutes, getH, getM }from '@/utils/commons';
import './bikeInfo.scss';

class bikeInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {
    
  }
  // 文本处理
  copyWriter(State,LongTime){
    if(State === 1){
      let Result = (Number(LongTime) > 60?((Number(LongTime) - Number(LongTime)%60)/60+'小时'+(Number(LongTime)%60)+'分钟'):(LongTime+'分钟'))
      return Result;
    } else {
      return LongTime;
    }
  }
  // 计费方式
  billingWord(BillingType){
    switch(BillingType){
      case 0:
        return '按时间计费';
      case 1:
        return '按电量计费';
      case 2:
        return '按功率计费';
      case 3:
        return '固定计费';
      default:
        return '按时间计费';
    }
  }
  render() {
    const { itemData:{ BillingType, Electricity, CreateTime, DeviceNumber, DeviceWay, IsRefunDable, InstallAddress, Calculating, Hour, LongTime, DeviceMony, OrderNo, State } } = this.props;
    // State === 1 //充电中
    return (
      <div className='chargeInfo_box'>
        <div className='chargeInfo_info'>
          <div className='info_top'>
            <h6 className='font16'>{`设备编号：${DeviceNumber}`}</h6>
            <h6 className='font16'>{`端口：${DeviceWay}号`}</h6>
          </div>
          <div className='circle1'>
            <div className='info_circle'>
              <div className={classnames('circle_border',State === 1?'active':'finish')}>
                <div className='border_dot'></div>
              </div>
              <div className='circle_info'>
                <div className='circle_text'>
                  <span className='font10'>预充</span>
                  {
                    State === 1
                    ? (BillingType === 1
                    ? <p className='font10'><span className='font24'>{Electricity}</span>度</p>
                      :Calculating
                        ? <p className='font10'>
                            <span className='font24'>计算中...</span>
                          </p>
                        : <p className='font10'>
                            {getH((Hour*100*60)/100)!==0&&<span className='font24'>{getH((Hour*100*60)/100)}</span>}
                            {getH((Hour*100*60)/100)!==0&&`${'小时'}`}
                            {getM((Hour*100*60)/100)!==0&&<span className='font24'>{getM((Hour*100*60)/100)}</span>}
                            {getM((Hour*100*60)/100)!==0&&`${'分钟'}`}
                          </p>
                      )
                    : <span className='font22'>充电结束</span>
                  }
                  <span className='font12'>{`消费${Number(DeviceMony).toFixed(2)}元`}</span>
                </div>
              </div> 
            </div>
          </div>
        </div>
        <ul className='info_list'>
          <li className='list_item'>
            <span className='item_lable'>开始时间</span>
            <span className='item_word'>{CreateTime}</span>
          </li>
          { State === 1&&<li className='list_item'>
              <span className='item_lable'>已充时间</span>
              <span className='item_word'>{this.copyWriter(State,LongTime)}</span>
            </li>
          }
          <li className='list_item'>
            <span className='item_lable'>设备地址</span>
            <span className='item_word'>{InstallAddress}</span>
          </li>
          <li className='list_item'>
            <span className='item_lable'>订单编号</span>
            <span className='item_word'>{OrderNo}</span>
          </li>
          <li className='list_item'>
            <span className='item_lable'>计费方式</span>
            <span className='item_word'>{this.billingWord(BillingType)}</span>
          </li>
        </ul>
        {/* IsRefunDable  0 可以退款，1 不退款*/}
        { State === 1&&
          <div className='chargeInfo_btn'>
            {!sixMinutes(CreateTime)&&<button 
              className='btn_check' 
              onClick={(e)=>{
                e.stopPropagation();
                this.props.itemBtn(2)
              }}
              type="submit"
              >重新启动</button>
            }
            {IsRefunDable === 0 && !sixMinutes(CreateTime)&&<button 
              className='btn_check active' 
              onClick={(e)=>{
                e.stopPropagation();
                this.props.itemBtn(1)
              }}  
              type="submit">取消充电</button>
            }
            {(BillingType !== 1 && BillingType !== 3 && sixMinutes(CreateTime))&&<button 
              className='btn_check' 
              onClick={(e)=>{
                e.stopPropagation();
                this.props.itemBtn(3)
              }}  
              type="submit">远程续充</button>
            }
          </div>
        } 
        { State === 3&&
          <div className='chargeInfo_btn'>
            <button
              className='btn_check' 
              onClick={(e)=>{
                e.stopPropagation();
                this.props.itemBtn(4)
              }} 
              type="submit"
            >再充一次</button>
          </div>
        }
        {State === 1&&!sixMinutes(CreateTime)&&<div className='chargeInfo_six'>
          <span>6分钟内未成功充电可免费取消</span>
        </div>}
      </div>
    );
  }
}

bikeInfo.propTypes = {
  itemData: PropTypes.object.isRequired,
  itemBtn: PropTypes.func.isRequired,
};

export default bikeInfo;