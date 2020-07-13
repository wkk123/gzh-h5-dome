import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { sixMinutes } from '@/utils/commons';
import './recordItem.scss';

class recordItem extends Component {
  static propTypes = {
    itemData: PropTypes.object.isRequired,
    isUnderway: PropTypes.bool.isRequired,
    itemBtn: PropTypes.func.isRequired,
  }
  static defaultProps = {
    itemData: {},
    isUnderway: true,//true 充电中 false 充电结束
    itemBtn: () => {},
  }
  state = {

  }
  
  stateWord(num){
    switch(num){
      case 'code':
        return '应急充电';
      case 1:
        return '正在充电';
      case 2:
        return '充电关闭';
      case 3:
        return '充电完成';
      case 104: 
        return '充满自停';
      case 105: 
        return '功率过大';
      case 106: 
        return '温度过高断电';
      case 107: 
        return '未插插头';
      case 108: 
        return '未知断电';
      default:
        return '充电异常';
    }
  }

  render () {
    const { itemData, itemData:{ BillingType, DeviceName, IsRefunDable, DeviceNumber, CreateTime, EndTime, UsedMoney, State }, isUnderway } = this.props;
    return (
      <div className={classnames('record_itembox',!isUnderway&&'active')}>
        <div className={classnames('itembox_box',`${isUnderway}`,isUnderway?'center':'top')}>
          <ul className='item_left'>
            <li className="item_text title">{ DeviceName }</li>
            <li className="item_text">{`设备编号：${DeviceNumber}`}</li>
            {!isUnderway&&<li className="item_text">{`开始时间：${ CreateTime }`}</li>}
            {isUnderway&&<li className="item_text">{`当前花费：${ Number(UsedMoney).toFixed(2) }`}</li>}
            {!isUnderway&&<li className="item_text">{`结束时间：${ EndTime}`}</li>}
          </ul>
          <div className={classnames('item_right')}>
            <span className='item_state'>{this.stateWord(State)}</span>
          </div>
        </div>
        {State === 1&&<div className='itemBtn_box'>
          {IsRefunDable === 0 && !sixMinutes(CreateTime)&&<button 
            type="submit" 
            className="item_btn cancel"
            onClick={(e)=>{
              e.stopPropagation();
              this.props.itemBtn(1,itemData);
            }} 
          >取消充电</button>}
          {!sixMinutes(CreateTime)&&<button 
            type="submit" 
            className="item_btn"
            onClick={(e)=>{
              e.stopPropagation();
              this.props.itemBtn(2,itemData);
            }} 
          >重新启动</button>}
          {(BillingType !== 1 && BillingType !== 3&&sixMinutes(CreateTime))&&<button 
            type="submit" 
            className="item_btn"
            onClick={(e)=>{
              e.stopPropagation();
              this.props.itemBtn(3,itemData);
            }} 
          >远程续充</button>}
        </div>}
      </div>
    )
  }
}

export default recordItem