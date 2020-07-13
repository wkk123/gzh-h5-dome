import React, { Component } from 'react'
import './balanceCharge.scss';
import { MoneyList } from '@/components';

export class balanceCharge extends Component {
  constructor(prpos){
    super(prpos)
    this.state = {
      
    }
  }
  // 选择金额某一个
  moneyItem(item,Num){
    console.log('item',item);
    if(Num !== 5){
      this.setState({
        chargeMoney:item,
      })
    } else {

    }
  }

  render() {
    return (
      <div className='balanceCharge_container'>
        <div className='balanceCharge_box'>
          <div className='balanceCharge_info'>
            <h6 className='Balance_title'>请选择充值金额</h6>
            <div className='balanceCharge_Balance'>
              <MoneyList 
                List={[30,50,100,200,300,6]} 
                itemMoney={this.moneyItem.bind(this)}
              />
            </div>  
          </div>
          <div className='balanceCharge_btn'> 
            <button onClick={this.balancePay} type="submit" className='btn' >确认充值</button>
          </div>
        </div>
      </div>
    )
  }
}

export default balanceCharge
