import React, { Component } from 'react';
import './buyCard.scss';
import { Modal, MoneyList, OnlineCard } from '@/components';


class buyCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModal: false,
      chargeMoney: 0,
      isSuccess: true,
    }
  }
  componentDidMount() {

  }
  // 选择金额
  moneyItem = (money,index) =>{
    if(index === 5){
      this.setState({
        isModal: true,
      })
    } else {
      this.setState({
        chargeMoney: money
      })
    }
  }
  // 关闭弹框 取消
  cancelfun(){
    this.setState({
      isModal: false
    })
  }
  // 关闭弹框 确定
  confirmfun (value) {
    this.setState({
      isModal: false,
      chargeMoney: Number(value),
    })
  }
  render() {
    const { isModal, isSuccess, chargeMoney } = this.state;
    return (
      <div className='buyCard_container'>
        <div className='buyCard_box'>
          {
            true
            ? <div className='buyCard_noData'>
                <span>电子线上卡</span>
              </div>
            :<OnlineCard 
              itemData={
                {
                  tenantName:'商户',
                  upMoney:100,
                  cardKey:12366, 
                  isBind:1,
                }
              } 
              isBuy={true} 
            />
          }
          <h6 className='buyCard_explain'>注：购买线上卡后需要到商家领取实体卡进行绑定后使用</h6>
          <div className='buyCard_money'>
            <MoneyList 
              List={[30,50,100,200,300,6]} 
              itemMoney={this.moneyItem.bind(this)}
              userDefined = { chargeMoney }
            />
          </div>
        </div>
        {isModal&&<Modal 
          type={'input'}
          title={'输入金额(元)'}
          inputType={'number'}
          cancel={'取消'}
          confirm={'确定'}
          cancelBtn={this.cancelfun.bind(this)}
          confirmBtn={this.confirmfun.bind(this)}
          placeholder={'请输入 0.01-10000 的数字'}
          min={0.01}
          max={10000}
        />}
        {isSuccess&&<Modal 
          type={'text'}
          list={[{ word:'恭喜购买成功！'}]}
          confirm={'点击查看'}
          confirmBtn={this.confirmfun.bind(this)}
        />}
      </div>
    );
  }
}


export default buyCard;