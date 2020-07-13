import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { imgUrl } from '@/config';
import { Modal } from '@/components';
// import { userBind, userUnbind } from '@/api/api';
import './onlineCard.scss';

export default class onlineCard extends Component {
  static propTypes = {
    itemData: PropTypes.object.isRequired,
    isBuy: PropTypes.bool.isRequired,
    goTopUp: PropTypes.func.isRequired,
    goMap: PropTypes.func.isRequired,
  }
  static defaultProps = {
    isBuy: false,//是否购买卡片
  }
  constructor(props) {
    super(props);
    this.state = {
      isBindCard: false, //解绑或者绑定
      isCollecting: false,//领取卡片
    };
  }
  // 解绑 绑定卡片 isBind 0：未绑（绑卡），1：已绑定 （解绑）
  bindCard = () =>{
    this.setState({
      isBindCard: true
    })
  }
  cancelfun = () =>{
    this.setState({
      isBindCard: false
    })
  }
  confirmfun = (value) =>{
    console.log('value',value);
    this.setState({
      isBindCard: false
    })
  }
  collectingBtn = () =>{
    this.setState({
      isCollecting: true
    })
  }
  render() {
    const { itemData:{ cardKey, isBind, tenantName, upMoney }, isBuy } = this.props;
    const { isBindCard, isCollecting } = this.state;
    return (
      <div className='online_card'>
        <div className='card_info'>
          <div className='info_top'>
            <h6 className='font14'>{tenantName}</h6>
            { (isBind === 0)
              ?(!isBuy&&<button className='btn2' onClick={this.collectingBtn}>领卡方式</button>)
              :(!isBuy&&<button className='btn1' onClick={this.props.goTopUp.bind(this,12,13)}>充值</button>)
            }
          </div>
          <p className='info_center'>余额：<span className='font28'>{(Number(upMoney)/100).toFixed(2)}</span>元</p>
          {!isBuy
            ? <div className='info_bottom'>
                <button type="submit" className='btn2' onClick={this.props.goMap.bind(this,12,13)}>查看适用设备范围</button>
                <button type="submit" className='btn3' onClick={this.bindCard}>
                  <span className='font12'>{`${isBind === 0?'绑定':'解绑'}`}</span>
                  <img className='info_icon' src={imgUrl + 'icon/right.png'} alt="right"/> 
                </button>
              </div>
            : <div className='info_bottom'></div>
          }
        </div>
        {(isBind === 1&&cardKey)&&<h6 className='card_Num'>{`卡号：XSK${cardKey}`}</h6>}
        {(isBindCard && isBind === 0)&&<Modal 
          type={'input'}
          title={'卡号绑定'}
          inputType={'text'}
          cancel={'取消'}
          confirm={'确定'}
          placeholder= {'请输入您的卡号'}
          maxLength = {8}
          cancelBtn={this.cancelfun.bind(this)}
          confirmBtn={this.confirmfun.bind(this)}
        />}
        {(isBindCard && isBind === 1)&&<Modal 
          type={'text'}
          list={[{ word:'确定要解绑实体卡吗？'}]}
          cancel={'取消'}
          confirm={'确定'}
          cancelBtn={this.cancelfun.bind(this)}
          confirmBtn={this.confirmfun.bind(this)}
        />}
        {isCollecting &&<Modal
          type={'text'}
          title={'领卡方式'}
          list={[{ word:'1.到物业直接领取线上卡 '},{ word:'2.拨打电话',telephone:'4000-122313'}]}
          confirm={'知道了'}
          confirmBtn={this.confirmfun.bind(this)}
        />}
      </div>
    )
  }
}
